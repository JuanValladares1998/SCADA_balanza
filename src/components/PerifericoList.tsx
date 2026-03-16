import type { Estado } from "../types/Estado";

export type PerifericoItem = {
  id: string | number;
  nombre: string;
  estado: Estado;
};

type PerifericoListProps = {
  title: string;
  items: PerifericoItem[];
  selectedId: string | number;
  onSelect: (id: string | number) => void;
};

const estadoColor: Record<Estado, string> = {
  ok: "bg-emerald-500",
  alerta: "bg-amber-500",
  error: "bg-red-500",
};

export default function PerifericoList({ title, items, selectedId, onSelect }: PerifericoListProps) {
  return (
    <div className="scada-card p-4">
      <h2 className="text-lg font-semibold scada-text-primary mb-3">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
                isSelected
                  ? "border-slate-300 bg-slate-50 shadow-sm"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${estadoColor[item.estado]}`}></span>
                <span className="text-sm font-medium text-slate-700">{item.nombre}</span>
              </div>
              {isSelected && (
                <span className="text-xs font-semibold text-slate-500">Seleccionado</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
