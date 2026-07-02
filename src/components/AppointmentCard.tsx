import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";
import { useApp } from "@/store/AppContext";
import { motion } from "motion/react";
import { Clock, User } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  showCustomer?: boolean;
  compact?: boolean;
}

export function AppointmentCard({ appointment, showCustomer = true, compact = false }: AppointmentCardProps) {
  const { getCustomerById, getVehicleById, dispatch } = useApp();
  const customer = getCustomerById(appointment.customerId);
  const vehicle = getVehicleById(appointment.vehicleId);

  if (!customer || !vehicle) return null;

  const handleClick = () => {
    dispatch({ type: "SELECT_APPOINTMENT", appointmentId: appointment.id });
  };

  if (compact) {
    return (
      <motion.div whileTap={{ scale: 0.98 }}>
        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50 opacity-40"
          onClick={handleClick}
        >
          <CardContent className="flex items-center justify-between p-2.5">
            <div className="min-w-0 flex-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3 shrink-0" />
              <span className="tabular-nums">{appointment.time}</span>
              <span className="truncate">
                {customer.name} · {vehicle.plate}
              </span>
            </div>
            <StatusBadge status={appointment.status} />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}>
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-accent/50",
          appointment.status === "iptal" && "opacity-50"
        )}
        onClick={handleClick}
      >
        <CardContent className="flex flex-col gap-1 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="text-sm font-semibold tabular-nums">{appointment.time}</span>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          {showCustomer && (
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1 ml-0">
              <User className="size-3 shrink-0" />
              {customer.name}
            </p>
          )}

          <p className="text-xs truncate">
            <span className="font-medium">{appointment.operation}</span>
            <span className="text-muted-foreground">
              {" · "}{vehicle.plate} {vehicle.model}
            </span>
          </p>

          {appointment.notes && (
            <p className="text-[11px] text-muted-foreground/60 truncate">
              {appointment.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
