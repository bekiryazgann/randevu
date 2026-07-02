import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "@/data/mock";
import { Check, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function NewAppointment() {
  const { dispatch, state } = useApp();
  const navigate = useNavigate();
  const preselectedId = state.selectedCustomerId;
  const [step, setStep] = useState<"form" | "customer">(preselectedId ? "form" : "customer");
  const [customerId, setCustomerId] = useState(preselectedId || "");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const selectedCustomer = state.customers.find((c) => c.id === customerId);

  const handleSubmit = () => {
    if (!customerId || !vehicleId || !time) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    const id = `a${Date.now()}`;
    dispatch({
      type: "ADD_APPOINTMENT",
      appointment: {
        id,
        customerId,
        vehicleId,
        operation: notes || "Randevu",
        date,
        time,
        status: "bekliyor",
        notes: notes || undefined,
      },
    });

    toast.success("Randevu başarıyla oluşturuldu.", {
      description: `${time} - ${notes || "Randevu"}`,
    });

    setCustomerId("");
    setVehicleId("");
    setTime("");
    setNotes("");
    setStep("customer");
    dispatch({ type: "SELECT_CUSTOMER", customerId: null });
    navigate("/");
  };

  if (step === "customer") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold">Yeni Randevu</h2>
          <p className="text-sm text-muted-foreground">1/2 - Müşteri Seçimi</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Müşteri Seçimi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3">
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate("/yeni-musteri")}
              className="flex items-center gap-3 rounded-lg border-2 border-dashed border-primary/30 p-3 text-left transition-colors hover:bg-primary/5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Yeni Müşteri Ekle</p>
                <p className="text-xs text-muted-foreground">Hızlı kayıt oluştur</p>
              </div>
            </motion.button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">veya kayıtlı müşteri seçin</span>
              </div>
            </div>

            {state.customers.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                onClick={() => {
                  setCustomerId(c.id);
                  setVehicleId(c.vehicles[0]?.id || "");
                  setStep("form");
                }}
                className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.phone} · {c.vehicles.map((v) => v.plate).join(", ")}
                  </p>
                </div>
              </motion.button>
            ))}

          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStep("customer");
              setCustomerId("");
              dispatch({ type: "SELECT_CUSTOMER", customerId: null });
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Geri
          </button>
        </div>
        <h2 className="text-lg font-bold mt-1">Yeni Randevu</h2>
        <p className="text-sm text-muted-foreground">
          2/2 - Randevu Detayları
          {selectedCustomer && <> · {selectedCustomer.name}</>}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          {selectedCustomer && (
            <div className="space-y-1.5">
              <Label className="text-xs">Araç *</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Araç seçin" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCustomer.vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.plate} - {v.model} {v.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Tarih *</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Saat *</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Saat seçin" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">İşlem / Not</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Yağ değişimi, periyodik bakım..."
              className="h-11"
            />
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="h-12 text-base font-semibold mt-2 gap-2"
          >
            <Check className="size-5" />
            Randevu Oluştur
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
