import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Estado } from "../../../types/Estado";

type PuntoGraficoAlerta = {
  etiqueta: string;
  total: number;
};

type PropiedadesTarjetaGraficoAlertas = {
  titulo: string;
  estado: Estado;
  datos: PuntoGraficoAlerta[];
};

const coloresPorEstado: Record<Estado, string> = {
  ok: "#10b981",
  alerta: "#f59e0b",
  error: "#ef4444",
};

function TarjetaGraficoAlertas({ titulo, estado, datos }: PropiedadesTarjetaGraficoAlertas) {
  const color = coloresPorEstado[estado];

  return (
    <article className="scada-card shadow-sm p-4 flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold scada-title p-2 rounded">
          {titulo}
        </h2>
        <span className="text-xs font-semibold" style={{ color }}>
          {estado.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b81f" />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "#94a3b81a" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: `1px solid ${color}`,
                borderRadius: 12,
                color: "#e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color, stroke: color }}
              activeDot={{ r: 6, fill: color, stroke: "#0f172a", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default TarjetaGraficoAlertas;
