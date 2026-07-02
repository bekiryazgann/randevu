import { useApp } from "@/store/AppContext";
import { AppointmentCard } from "@/components/AppointmentCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Clock, Users, CheckCircle2, AlertCircle, Wrench } from "lucide-react";

export default function Dashboard() {
  const { todayAppointments, getTodaySummary } = useApp();
  const summary = getTodaySummary();

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const isPast = (time: string) => time < currentTime;

  const sorted = [...todayAppointments].sort((a, b) => {
    const aPast = isPast(a.time) && a.status === "bekliyor";
    const bPast = isPast(b.time) && b.status === "bekliyor";
    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;
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
        {[
          { label: "Toplam" as const, value: summary.total, icon: Users, className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
          { label: "Bekleyen" as const, value: summary.bekliyor, icon: Clock, className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Geldi" as const, value: summary.geldi, icon: AlertCircle, className: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
          { label: "Tamamlanan" as const, value: summary.tamamlandi, icon: CheckCircle2, className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
          >
            <SummaryCard {...card} />
          </motion.div>
        ))}
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
          <div className="flex flex-col gap-1.5">
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

              const isPastAppt = isPast(appointment.time) && appointment.status === "bekliyor";

              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                >
                  {showTimeHeader && (
                    <div className="flex items-center gap-2 py-1.5">
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
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
                  <div className="ml-[14px] border-l-2 border-border pl-3 pb-0.5">
                    <AppointmentCard appointment={appointment} compact={isPastAppt} />
                    {isLastOfHour && <div className="h-2" />}
                    {idx === sorted.length - 1 && <div className="h-2" />}
                  </div>
                </motion.div>
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
