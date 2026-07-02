import { useApp } from "@/store/AppContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { customers, serviceRecords } from "@/data/mock";
import { Phone, Car, Calendar, Wrench, Gauge, X } from "lucide-react";

export function CustomerDetailSheet() {
  const { state, dispatch } = useApp();
  const customerId = state.selectedCustomerId;
  const customer = customerId ? customers.find((c) => c.id === customerId) : undefined;

  if (!customer) return null;

  const customerRecords = serviceRecords.filter((r) => r.customerId === customerId);
  const customerAppointments = state.appointments.filter(
    (a) => a.customerId === customerId
  );

  const handleClose = () => dispatch({ type: "SELECT_CUSTOMER", customerId: null });

  return (
    <Sheet open={!!customerId} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <ScrollArea className="h-full">
          <SheetHeader className="px-4 pt-4 pb-2 text-left sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg">Müşteri Kartı</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="size-8">
                <X className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="px-4 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{customer.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="size-3" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {customer.vehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 rounded-lg border p-2.5 text-sm"
                >
                  <Car className="size-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">{v.plate}</span>
                  <span className="text-muted-foreground">
                    {v.brand} {v.model} {v.year}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="size-4" />
              Aktif Randevular
            </h4>
            {customerAppointments.filter((a) => a.status !== "tamamlandi" && a.status !== "iptal").length === 0 ? (
              <p className="text-sm text-muted-foreground mb-4">Aktif randevu yok.</p>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {customerAppointments
                  .filter((a) => a.status !== "tamamlandi" && a.status !== "iptal")
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{a.operation}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.date} · {a.time}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
              </div>
            )}

            <Separator className="my-4" />

            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Wrench className="size-4" />
              Geçmiş Servis Kayıtları
            </h4>
            {customerRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz servis kaydı yok.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {customerRecords
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((record, idx) => (
                    <div key={record.id}>
                      <div className="flex items-center gap-3 py-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{record.operation}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(record.date).toLocaleDateString("tr-TR")}</span>
                            {record.mileage && (
                              <>
                                <span>·</span>
                                <Gauge className="size-3" />
                                <span>{record.mileage.toLocaleString("tr-TR")} km</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {idx < customerRecords.length - 1 && <Separator />}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
