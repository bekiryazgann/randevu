import { useApp } from "@/store/AppContext";
import { AppointmentCard } from "@/components/AppointmentCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { Clock, Users, CheckCircle2, AlertCircle, Wrench } from "lucide-react";

export default function Dashboard() {
  const { todayAppointments, getTodaySummary } = useApp();
  const summary = getTodaySummary();
  const sorted = [...todayAppointments].sort((a, b) => {
    if (a.status === "tamamlandi" && b.status !== "tamamlandi") return 1;
    if (b.status === "tamamlandi" && a.status !== "tamamlandi") return -1;
    if (a.status === "iptal" && b.status !== "iptal") return 1;
    if (b.status === "iptal" && a.status !== "iptal") return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Bugün</h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Wrench className="size-6 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SummaryCard
          label="Toplam"
          value={summary.total}
          icon={Users}
          className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        />
        <SummaryCard
          label="Bekleyen"
          value={summary.bekliyor}
          icon={Clock}
          className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        />
        <SummaryCard
          label="Geldi"
          value={summary.geldi}
          icon={AlertCircle}
          className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        />
        <SummaryCard
          label="Tamamlanan"
          value={summary.tamamlandi}
          icon={CheckCircle2}
          className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Zaman Çizelgesi
          </h3>
          <div className="h-px flex-1 bg-border" />
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title="Bugün randevu yok"
            description="Yeni randevu eklemek için alttaki + butonuna dokunun."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map((appointment, idx) => {
              const isCompleted = appointment.status === "tamamlandi";
              const isCancelled = appointment.status === "iptal";
              const nextAppointment = sorted[idx + 1];
              const isLastOfHour =
                nextAppointment &&
                appointment.time.substring(0, 2) !== nextAppointment.time.substring(0, 2);

              const showTimeHeader =
                idx === 0 ||
                appointment.time.substring(0, 2) !== sorted[idx - 1].time.substring(0, 2);

              return (
                <div key={appointment.id}>
                  {showTimeHeader && (
                    <div className="flex items-center gap-2 py-2">
                      <div
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-[10px] font-bold",
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : isCancelled
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-primary/10 text-primary"
                        )}
                      >
                        {appointment.time.substring(0, 2)}
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <div className="ml-[18px] border-l-2 border-border pl-4 pb-1">
                    <AppointmentCard appointment={appointment} />
                    {isLastOfHour && <div className="h-2" />}
                    {idx === sorted.length - 1 && <div className="h-2" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl p-3", className)}>
      <Icon className="size-4 opacity-70" />
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-[10px] font-medium opacity-70 uppercase">{label}</span>
    </div>
  );
}
