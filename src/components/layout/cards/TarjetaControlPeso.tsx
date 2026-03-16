import { Link } from "react-router-dom";

type PropiedadesTarjetaControlPeso = {
  pesoEntrada: number;
  pesoSalida: number;
};

function TarjetaControlPeso({ pesoEntrada, pesoSalida }: PropiedadesTarjetaControlPeso) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col justify-between">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Control de Peso</h2>

      <div className="grid grid-cols-2 text-center gap-3">
        <Link
          to="/balanza?balanza=bal-1"
          className="rounded-lg border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50"
        >
          <div className="text-sm scada-text-secondary mt-1">Primer Pesaje<br></br>(Entrada)</div>
        </Link>
        <Link
          to="/balanza?balanza=bal-1"
          className="rounded-lg border border-transparent p-2 text-5xl font-bold scada-text-primary transition hover:border-slate-200 hover:bg-slate-50"
        >
          {pesoEntrada.toLocaleString()} <span className="text-2xl scada-text-secondary">kg</span>
        </Link>
      </div>

      <div className="border-t scada-divider my-2" />

      <div className="grid grid-cols-2 text-center gap-3">
        <Link
          to="/balanza?balanza=bal-2"
          className="rounded-lg border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50"
        >
          <div className="text-sm scada-text-secondary mt-1">Segundo Pesaje<br></br>(Salida)</div>
        </Link>
        <Link
          to="/balanza?balanza=bal-2"
          className="rounded-lg border border-transparent p-2 text-5xl font-bold scada-text-primary transition hover:border-slate-200 hover:bg-slate-50"
        >
          {pesoSalida.toLocaleString()} <span className="text-2xl scada-text-secondary">kg</span>
        </Link>
      </div>

      <div className="border-t scada-divider my-2" />
    </article>
  );
}

export default TarjetaControlPeso;
