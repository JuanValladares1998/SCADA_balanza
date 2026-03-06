import type { Estado } from "../../../types/Estado";

type SensorInfrarrojo = {
  id: number;
  nombre: string;
  estado: Estado;
};

type PropiedadesTarjetaSensoresIR = {
  sensores: SensorInfrarrojo[];
};

function TarjetaSensoresIR({ sensores }: PropiedadesTarjetaSensoresIR) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-2">Monitoreo Sensores IR</h2>
      <div className="mb-3 p-2 rounded scada-chip scada-chip-ok flex items-center justify-between">
        <span className="text-xs font-semibold scada-text-ok uppercase tracking-wide">Estado de posicion</span>
        <span className="text-sm font-bold scada-text-ok">Camion alineado</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
        {
          sensores.map((sensor) => (
            <div
              key={sensor.id}
              className={`scada-soft-box p-2 ${sensor.estado === "ok" ? "scada-soft-ok" : sensor.estado === "alerta" ? "scada-soft-alerta" : "scada-soft-error"}`}
            >
              <div className="scada-text-secondary font-bold">{sensor.nombre}</div>
              <div
                className={`mt-2 inline-flex w-fit items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase scada-chip bg-status-${sensor.estado} scada-text-${sensor.estado}`}
              >
                {sensor.estado}
              </div>
            </div>
          ))
        }
      </div>
    </article>
  );
}

export default TarjetaSensoresIR;
