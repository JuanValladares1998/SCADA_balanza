import { useState, useMemo } from "react";
import { formatearFechaParaInput } from "../../../utils/fechas";
import type { Estado } from "../../../types/Estado";

type AlertaSistema = {
  id: number;
  estado: Estado;
  titulo: string;
  descripcion: string;
  hora: string;
};

type PropiedadesTarjetaAlertas = {
  alertas: AlertaSistema[];
};

function formatearFechaHora(valor?: string) {
  if (!valor) {
    return "Sin fecha";
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return fecha.toLocaleString();
}

function TarjetaAlertas({ alertas }: PropiedadesTarjetaAlertas) {

  const ahora = new Date();
  const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000); // Sumamos 1 hora en ms

  const [desde, setDesde] = useState(formatearFechaParaInput(ahora));
  const [hasta, setHasta] = useState(formatearFechaParaInput(unaHoraDespues));

  const [rangoAplicado, setRangoAplicado] = useState<{ desde: string; hasta: string } | null>(null);

  const alertasFiltradas = useMemo(() => {
    if (!rangoAplicado) {
      return alertas;
    }

    return alertas.filter((alerta) => {
      if (!alerta.hora) {
        return true;
      }

      const fechaAlerta = new Date(alerta.hora).getTime();
      const fechaDesde = new Date(rangoAplicado.desde).getTime();
      const fechaHasta = new Date(rangoAplicado.hasta).getTime();

      return fechaAlerta >= fechaDesde && fechaAlerta <= fechaHasta;
    });
  }, [alertas, rangoAplicado]);

  const manejarAplicarFiltro = () => {
    setRangoAplicado({ desde, hasta });
  };

  const manejarQuitarFiltro = () => {
    setRangoAplicado(null);
  };

  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col overflow-hidden relative">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-3">
        Alertas del Sistema {rangoAplicado ? `(${alertasFiltradas.length})` : null}
      </h2>

      <details className="mb-3 relative z-20">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold scada-text-primary scada-soft-box p-2">
          <span>Filtro por fecha y hora</span>
          <i className="ph ph-caret-down text-sm scada-text-secondary" />
        </summary>

        <div className="absolute left-0 right-0 top-full mt-2 grid grid-cols-1 gap-2 scada-soft-box p-3 shadow-sm max-h-72 overflow-y-auto scada-scroll">
          <label className="block">
            <span className="text-[11px] font-semibold scada-text-secondary">Desde</span>
            <input
              type="datetime-local"
              className="mt-1 block w-full scada-soft-box px-2 py-1 text-xs outline-none"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold scada-text-secondary">Hasta</span>
            <input
              type="datetime-local"
              className="mt-1 block w-full scada-soft-box px-2 py-1 text-xs outline-none"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </label>

          <div className="mt-1 flex gap-2">
            <button
              onClick={manejarAplicarFiltro}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold scada-chip scada-text-${rangoAplicado ? "secondary" : "primary"} transition-all`}
              disabled={rangoAplicado ? true : false}
            >
              Aplicar filtro
            </button>
            <button
              onClick={manejarQuitarFiltro}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold scada-chip scada-text-${rangoAplicado ? "primary" : "secondary"} transition-all`}
              disabled={rangoAplicado ? false : true}
            >
              Quitar filtro
            </button>
          </div>
        </div>
      </details>

      <div className="flex-1 overflow-y-auto scada-scroll pr-1 space-y-2">
        {alertasFiltradas.length > 0 ? (
          alertasFiltradas.map((alerta) => (
            <div
              key={alerta.id}
              className={`flex items-start gap-3 p-2 scada-alert scada-alert-${alerta.estado}`}
            >
              <i
                className={`ph-fill ph-${alerta.estado === "error"
                  ? "alerta-circle"
                  : alerta.estado === "alerta"
                    ? "alerta"
                    : "info"
                  } scada-text-${alerta.estado} text-xl mt-0.5`}
              />
              <div>
                <div className={`text-sm font-bold scada-text-${alerta.estado}`}>
                  {alerta.titulo}
                </div>
                <div className={`text-xs scada-text-${alerta.estado}`}>
                  {alerta.descripcion}
                </div>
                <div className="text-[10px] opacity-70 mt-1">
                  {formatearFechaHora(alerta.hora)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-xs scada-text-secondary text-center italic">
            No hay alertas en este rango.
          </div>
        )}
      </div>
    </article>
  );
}

export default TarjetaAlertas;
