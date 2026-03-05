type EstadoAlerta = "alarma" | "advertencia" | "ok";

type AlertaSistema = {
  id: number;
  estado: EstadoAlerta;
  titulo: string;
  descripcion: string;
  hora?: string;
};

type PropiedadesTarjetaAlertas = {
  alertas: AlertaSistema[];
};

const mapaEstadoClase: Record<EstadoAlerta, "alarm" | "warning" | "ok"> = {
  alarma: "alarm",
  advertencia: "warning",
  ok: "ok",
};

function TarjetaAlertas({ alertas }: PropiedadesTarjetaAlertas) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-3">Alertas del Sistema</h2>

      <div className="flex-1 overflow-y-auto scada-scroll pr-1 space-y-2">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`flex items-start gap-3 p-2 scada-alert scada-alert-${mapaEstadoClase[alerta.estado]}`}
          >
            <i
              className={`ph-fill ph-${
                alerta.estado === "alarma"
                  ? "warning-circle"
                  : alerta.estado === "advertencia"
                    ? "warning"
                    : "info"
              } scada-text-${mapaEstadoClase[alerta.estado]} text-xl mt-0.5`}
            />
            <div>
              <div className={`text-sm font-bold scada-text-${mapaEstadoClase[alerta.estado]}`}>
                {alerta.titulo}
              </div>
              <div className={`text-xs scada-text-${mapaEstadoClase[alerta.estado]}`}>
                {alerta.descripcion}
              </div>
              <div className={`text-xs scada-text-${mapaEstadoClase[alerta.estado]}`}>{alerta.hora}</div>
            </div>
          </div>
        ))}

        {/* <div className="p-2 text-xs scada-text-secondary text-center">... mas alertas ...</div> */}
      </div>
    </article>
  );
}

export default TarjetaAlertas;
