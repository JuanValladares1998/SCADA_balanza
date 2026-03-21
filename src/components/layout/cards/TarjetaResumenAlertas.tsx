import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DatoPie = {
  nombre: string;
  valor: number;
  color: string;
};

type DatoBarra = {
  tipo: string;
  total: number;
  color: string;
};

type PropiedadesTarjetaResumenAlertas = {
  atendidas: number;
  pendientes: number;
  acumuladoPorTipo: DatoBarra[];
};

function TarjetaResumenAlertas({
  atendidas,
  pendientes,
  acumuladoPorTipo,
}: PropiedadesTarjetaResumenAlertas) {
  const datosPie: DatoPie[] = [
    { nombre: "Atendidas", valor: atendidas, color: "#10b981" },
    { nombre: "Pendientes", valor: pendientes, color: "#ef4444" },
  ];

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-4">
      <article className="scada-card shadow-sm p-4 flex h-full min-h-0 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold scada-title p-2 rounded">
            Atencion de Alertas
          </h2>
          <span className="text-xs scada-text-secondary">
            {atendidas + pendientes} total
          </span>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosPie}
                dataKey="valor"
                nameKey="nombre"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {datosPie.map((dato) => (
                  <Cell key={dato.nombre} fill={dato.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex justify-center gap-4 text-xs">
          {datosPie.map((dato) => (
            <div key={dato.nombre} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: dato.color }} />
              <span className="scada-text-secondary">
                {dato.nombre}: {dato.valor}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="scada-card shadow-sm p-4 flex h-full min-h-0 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold scada-title p-2 rounded">
            Acumulado por Tipo
          </h2>
          <span className="text-xs scada-text-secondary">Tipos repetidos por layout</span>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={acumuladoPorTipo} layout="vertical" margin={{ top: 8, right: 8, left: 24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b81f" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="tipo"
                width={140}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#94a3b81a" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {acumuladoPorTipo.map((dato) => (
                  <Cell key={dato.tipo} fill={dato.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}

export default TarjetaResumenAlertas;
