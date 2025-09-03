import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Search, BookOpen, CheckSquare, FileText, Users } from "lucide-react";
import { cn } from "../lib/utils";

export default function GlobalSearch() {
  const { classes, tasks, notes, contacts } = useData();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    return {
      classes: classes.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 5),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(query)).slice(0, 5),
      notes: notes.filter((n) => n.title.toLowerCase().includes(query)).slice(0, 5),
      contacts: contacts.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 5),
    };
  }, [q, classes, tasks, notes, contacts]);

  const go = (type: string, id?: string) => {
    setOpen(false);
    setQ("");
    if (type === "class" && id) navigate(`/dashboard/classes/${id}`);
    else if (type === "note" && id) navigate(`/dashboard/notes/${id}`);
    else if (type === "task") navigate(`/dashboard/tasks`);
    else if (type === "contact") navigate(`/dashboard/contacts`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className={cn("flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur") }>
        <Search className="h-4 w-4" />
        <Input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar clases, tareas o notas…"
          className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
        />
      </div>

      {open && results && (
        <Card className="absolute left-0 right-0 top-11 rounded-2xl border-0 shadow-lg backdrop-blur-md">
          <div className="max-h-80 overflow-auto p-2">
            {results.classes.length > 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Clases</div>
            )}
            {results.classes.map((c) => (
              <button key={c.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50" onClick={() => go("class", c.id)}>
                <BookOpen className="h-4 w-4" />
                <span className="truncate">{c.name}</span>
              </button>
            ))}

            {results.tasks.length > 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Tareas</div>
            )}
            {results.tasks.map((t) => (
              <button key={t.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50" onClick={() => go("task")}>
                <CheckSquare className="h-4 w-4" />
                <span className="truncate">{t.title}</span>
              </button>
            ))}

            {results.notes.length > 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Notas</div>
            )}
            {results.notes.map((n) => (
              <button key={n.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50" onClick={() => go("note", n.id)}>
                <FileText className="h-4 w-4" />
                <span className="truncate">{n.title}</span>
              </button>
            ))}

            {results.contacts.length > 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Contactos</div>
            )}
            {results.contacts.map((c) => (
              <button key={c.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50" onClick={() => go("contact")}>
                <Users className="h-4 w-4" />
                <span className="truncate">{c.name}</span>
              </button>
            ))}

            {results.classes.length + results.tasks.length + results.notes.length + results.contacts.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground">Sin resultados</div>
            )}
          </div>
        </Card>
      )}

      {open && (
        <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
