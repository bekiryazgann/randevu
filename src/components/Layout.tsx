import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, Home, ListChecks, Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Ana Sayfa", icon: Home },
  { to: "/randevular", label: "Randevular", icon: ListChecks },
  { to: "/yeni", label: "Yeni", icon: Plus },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm pt-safe">
        <motion.div
          className="mx-auto flex h-14 max-w-lg items-center justify-between px-4"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-600">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Florya Honda</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Servis Randevu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 pb-24 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 backdrop-blur-sm pb-safe">
        <div className="mx-auto flex max-w-lg items-center justify-around h-16 px-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center justify-center gap-1 h-12 min-w-0 flex-1 rounded-xl transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <tab.icon className="size-5" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
