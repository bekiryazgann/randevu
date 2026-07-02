import type { LucideIcon } from "lucide-react";
import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon = CalendarX, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="size-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}
