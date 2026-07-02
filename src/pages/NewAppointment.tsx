import { useState } from "react";
import { useApp, customers } from "@/store/AppContext";
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
import { operations, timeSlots } from "@/data/mock";
import { Check, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function NewAppointment() {
  const { dispatch, state } = useApp();
  const [step, setStep] = useState<"form" | "customer">(state.selectedCustomerId ? "form" : "customer");
  const [customerId, setCustomerId] = useState(state.selectedCustomerId || "");
  const [vehicleId, setVehicleId] = useState("");
  const [operation, setOperation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newVehiclePlate, setNewVehiclePlate] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [newVehicleYear, setNewVehicleYear] = useState("");

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleSubmit = () => {
    if (!customerId || !vehicleId || !operation || !time) {
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
        operation,
        date,
        time,
        status: "bekliyor",
        notes: notes || undefined,
      },
    });

    toast.success("Randevu başarıyla oluşturuldu.", {
      description: `${time} - ${operation}`,
    });

    setCustomerId("");
    setVehicleId("");
    setOperation("");
    setTime("");
    setNotes("");
    setStep("customer");
    dispatch({ type: "SET_PAGE", page: "dashboard" });
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
            <CardTitle className="text-sm font-medium">Kayıtlı Müşteriler</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCustomerId(c.id);
                  setVehicleId(c.vehicles[0]?.id || "");
                  setStep("form");
                }}
                className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent active:scale-[0.98]"
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
              </button>
            ))}

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">veya</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCustomerId("new");
                setStep("form");
              }}
              className="flex items-center gap-3 rounded-lg border-2 border-dashed p-3 text-left transition-colors hover:bg-accent/50 active:scale-[0.98]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <UserPlus className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Yeni Müşteri Ekle</p>
                <p className="text-xs text-muted-foreground">Hızlı kayıt oluştur</p>
              </div>
            </button>
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
          {customerId === "new" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Müşteri Adı *</Label>
                <Input
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Telefon *</Label>
                <Input
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="h-11"
                  inputMode="tel"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs">Plaka *</Label>
                  <Input
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    placeholder="34 AB 1234"
                    className="h-11 uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Model</Label>
                  <Input
                    value={newVehicleModel}
                    onChange={(e) => setNewVehicleModel(e.target.value)}
                    placeholder="Civic"
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Yıl</Label>
                  <Input
                    value={newVehicleYear}
                    onChange={(e) => setNewVehicleYear(e.target.value)}
                    placeholder="2024"
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </>
          )}

          {selectedCustomer && (
            <div className="space-y-1.5">
              <Label className="text-xs">Araç *</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="h-11">
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
            <Label className="text-xs">İşlem *</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="İşlem seçin" />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tarih *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Saat *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-11">
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
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Not</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Eklemek istediğiniz bir not..."
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
