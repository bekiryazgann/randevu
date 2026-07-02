import { useMemo, useState } from "react";
import { useApp } from "@/store/AppContext";
import { AppointmentCard } from "@/components/AppointmentCard";
import { EmptyState } from "@/components/EmptyState";
import { CustomerDetailSheet } from "@/components/CustomerDetailSheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppointmentStatus } from "@/types";

const tabs: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "bekliyor", label: "Bekleyen" },
  { value: "geldi", label: "Geldi" },
  { value: "tamamlandi", label: "Tamamlanan" },
];

export default function AllAppointments() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const filtered = useMemo(() => {
    let list = [...state.appointments];
    if (filter !== "all") {
      list = list.filter((a) => a.status === filter);
    }
    list.sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return a.time.localeCompare(b.time);
    });
    return list;
  }, [state.appointments, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold">Randevular</h2>
        <p className="text-sm text-muted-foreground">Tüm randevu kayıtları</p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as AppointmentStatus | "all")}
      >
        <TabsList className="w-full h-10">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs h-8">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          title="Randevu bulunamadı"
          description="Bu kategoride henüz randevu yok."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}

      {state.selectedCustomerId && (
        <CustomerDetailSheet
          customerId={state.selectedCustomerId}
          onClose={() => dispatch({ type: "SELECT_CUSTOMER", customerId: null })}
        />
      )}
    </div>
  );
}
