import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types";

const statusConfig: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  bekliyor: { label: "Bekliyor", variant: "secondary" },
  geldi: { label: "Geldi", variant: "default" },
  tamamlandi: { label: "Tamamlandı", variant: "outline" },
  iptal: { label: "İptal", variant: "destructive" },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className="shrink-0 text-xs font-medium">
      {config.label}
    </Badge>
  );
}
