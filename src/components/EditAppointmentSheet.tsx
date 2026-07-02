import { useState, useEffect } from "react";
import { useApp } from "@/store/AppContext";
import { motion } from "motion/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { timeSlots } from "@/data/mock";
import type { AppointmentStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  X,
  Save,
  Trash2,
  User,
  Car,
  Clock,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const statusOptions: { value: AppointmentStatus; label: string; color: string }[] = [
  { value: "bekliyor", label: "Bekliyor", color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
  { value: "geldi", label: "Geldi", color: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
  { value: "tamamlandi", label: "Tamamlandı", color: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
  { value: "iptal", label: "İptal", color: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
];

export function EditAppointmentSheet() {
  const { state, dispatch, getCustomerById, getVehicleById } = useApp();
  const appointment = state.appointments.find((a) => a.id === state.selectedAppointmentId);

  const [status, setStatus] = useState<AppointmentStatus>("bekliyor");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setDate(new Date(appointment.date));
      setTime(appointment.time);
      setNotes(appointment.notes || "");
    }
  }, [appointment]);

  if (!appointment) return null;

  const customer = getCustomerById(appointment.customerId);
  const vehicle = getVehicleById(appointment.vehicleId);

  const handleSave = () => {
    const dateStr = date ? date.toISOString().split("T")[0] : appointment.date;
    dispatch({
      type: "UPDATE_APPOINTMENT",
      appointment: {
        ...appointment,
        status,
        date: dateStr,
        time,
        operation: notes || appointment.operation,
        notes: notes || undefined,
      },
    });
    toast.success("Randevu güncellendi");
    dispatch({ type: "SELECT_APPOINTMENT", appointmentId: null });
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_APPOINTMENT", id: appointment.id });
    toast.success("Randevu silindi");
    dispatch({ type: "SELECT_APPOINTMENT", appointmentId: null });
  };

  const handleViewCustomer = () => {
    dispatch({ type: "SELECT_APPOINTMENT", appointmentId: null });
    dispatch({ type: "SELECT_CUSTOMER", customerId: appointment.customerId });
  };

  return (
    <Sheet
      open={!!state.selectedAppointmentId}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: "SELECT_APPOINTMENT", appointmentId: null });
      }}
    >
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
        <ScrollArea className="h-full">
          <SheetHeader className="px-4 pt-4 pb-2 text-left sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg">Randevu Düzenle</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: "SELECT_APPOINTMENT", appointmentId: null })}
                className="size-8"
              >
                <X className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="px-4 pb-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                {customer?.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold truncate">{customer?.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Car className="size-3 shrink-0" />
                  <span className="truncate">
                    {vehicle?.plate} - {vehicle?.model}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto shrink-0 h-8 text-xs gap-1"
                onClick={handleViewCustomer}
              >
                <User className="size-3" />
                Müşteri Kartı
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Durum
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatus(opt.value)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors",
                      status === opt.value
                        ? opt.color + " border-current"
                        : "border-border text-muted-foreground hover:border-muted-foreground/30"
                    )}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm">
                <Calendar className="size-3 inline mr-1" />
                Tarih
              </Label>
              <DatePicker date={date} onSelect={setDate} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                <Clock className="size-3 inline mr-1" />
                Saat
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 w-full text-base">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t} className="text-base py-3">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm" htmlFor="edit-notes">
                <FileText className="size-3 inline mr-1" />
                İşlem / Not
              </Label>
              <Input
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="İşlem açıklaması..."
                className="h-12 text-base"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button onClick={handleSave} size="lg" className="flex-1 h-12 text-base font-semibold gap-2">
                <Save className="size-5" />
                Kaydet
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="lg"
                className="h-12 gap-2"
              >
                <Trash2 className="size-5" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
