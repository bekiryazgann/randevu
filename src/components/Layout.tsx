import type { ReactNode } from "react";
import { useApp } from "@/store/AppContext";
import { CalendarDays, Home, ListChecks, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const { state, dispatch } = useApp();

  const tabs = [
    {
      id: "dashboard" as const,
      label: "Ana Sayfa",
      icon: Home,
    },
    {
      id: "appointments" as const,
      label: "Randevular",
      icon: ListChecks,
    },
    {
      id: "new" as const,
      label: "Yeni",
      icon: Plus,
    },
  ];

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-600">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Florya Honda</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Servis Randevu</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">
              {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 pb-24 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-around h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: "SET_PAGE", page: tab.id })}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 h-full px-3 min-w-0 flex-1 transition-colors",
                "active:scale-95",
                state.activePage === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
