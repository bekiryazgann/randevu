import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function NewCustomer() {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = () => {
    if (!name || !phone || !plate) {
      toast.error("Ad, telefon ve plaka zorunludur.");
      return;
    }

    const customerId = `c${Date.now()}`;
    const vehicleId = `v${Date.now()}`;

    const customer = {
      id: customerId,
      name,
      phone,
      vehicles: [
        {
          id: vehicleId,
          plate,
          brand: "Honda",
          model: model || "Belirtilmedi",
          year: Number(year) || new Date().getFullYear(),
        },
      ],
    };

    dispatch({ type: "ADD_CUSTOMER", customer });
    dispatch({ type: "SELECT_CUSTOMER", customerId });

    toast.success("Müşteri başarıyla eklendi.", {
      description: `${name} · ${plate}`,
    });

    navigate("/yeni");
  };

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/yeni")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">Yeni Müşteri</h2>
          <p className="text-sm text-muted-foreground">Hızlı müşteri kaydı</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Ad Soyad *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="h-11"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Telefon *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              className="h-11"
              inputMode="tel"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5 col-span-1">
              <Label className="text-xs">Plaka *</Label>
              <Input
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="34 AB 1234"
                className="h-11 uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Model</Label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Civic"
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yıl</Label>
              <Input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="h-11"
                inputMode="numeric"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="h-12 text-base font-semibold mt-2 gap-2"
          >
            <Check className="size-5" />
            Kaydet ve Randevuya Geç
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
