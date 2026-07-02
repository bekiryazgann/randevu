import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";
import { useApp } from "@/store/AppContext";
import { Car, Clock, User, Wrench } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  showCustomer?: boolean;
}

export function AppointmentCard({ appointment, showCustomer = true }: AppointmentCardProps) {
  const { getCustomerById, getVehicleById, dispatch } = useApp();
  const customer = getCustomerById(appointment.customerId);
  const vehicle = getVehicleById(appointment.vehicleId);

  if (!customer || !vehicle) return null;

  const handleClick = () => {
    dispatch({ type: "SELECT_APPOINTMENT", appointmentId: appointment.id });
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50 active:scale-[0.98]",
        appointment.status === "iptal" && "opacity-50"
      )}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Clock className="size-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tabular-nums">{appointment.time}</span>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {showCustomer && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0" />
            <span className="truncate">{customer.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm">
          <Wrench className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="font-medium truncate">{appointment.operation}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Car className="size-3.5 shrink-0" />
          <span className="truncate">
            {vehicle.plate} - {vehicle.model} {vehicle.year}
          </span>
        </div>

        {appointment.notes && (
          <p className="text-xs text-muted-foreground/70 border-t pt-1.5 mt-0.5 truncate">
            {appointment.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
