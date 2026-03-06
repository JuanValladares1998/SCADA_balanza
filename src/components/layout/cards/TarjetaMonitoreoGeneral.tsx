import type { Estado } from "../../../types/Estado";

type PropiedadesTarjetaMonitoreoGeneral = {
  nombre: string;
  valor: string | number;
  estado: Estado;
};

function TarjetaMonitoreoGeneral({
  nombre,
  valor,
  estado,
}: PropiedadesTarjetaMonitoreoGeneral) {

  return (
    <article className="scada-soft-box px-3 py-2 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-4 w-4 rounded-full border bg-status-${estado}`} />
        <div className="min-w-0">
          <div className="text-xs font-semibold scada-text-primary truncate">{nombre}</div>
          <div className={`text-[11px] scada-text-${estado} capitalize`}>{estado}</div>
        </div>
      </div>

      <div className="text-md font-medium scada-text-primary whitespace-nowrap">{valor}</div>
    </article>
  );
}

export default TarjetaMonitoreoGeneral;
