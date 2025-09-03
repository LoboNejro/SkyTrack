import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, CheckSquare, FileText, Calendar, User, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/classes", icon: BookOpen, label: "Clases" },
  { to: "/dashboard/tasks", icon: CheckSquare, label: "Tareas" },
  { to: "/dashboard/notes", icon: FileText, label: "Notas" },
  { to: "/dashboard/calendar", icon: Calendar, label: "Calendario" },
  { to: "/dashboard/settings", icon: Settings, label: "Ajustes" },
  { to: "/dashboard/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center">
      <nav className="pointer-events-auto flex items-end gap-2 rounded-2xl bg-background/70 px-3 py-2 shadow-lg backdrop-blur-md">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group relative grid place-items-center rounded-xl p-2 transition-all",
                active ? "bg-accent/60" : "hover:bg-accent/40",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", active ? "scale-110 text-primary" : "group-hover:scale-110")}/>
              <span className="mt-1 text-[10px] text-muted-foreground">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
