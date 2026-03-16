import { Link } from "react-router-dom";

type PropiedadesTarjetaVehiculoChofer = {
  placa: string;
  chofer: string;
  camaraId: string;
};

function TarjetaVehiculoChofer({ placa, chofer, camaraId }: PropiedadesTarjetaVehiculoChofer) {
  return (
    <Link
      to={`/camara-lpr?camara=${camaraId}`}
      className="col-span-3 scada-card shadow-sm p-4 block transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Datos del Vehiculo y Chofer</h2>

      <div className="flex flex-col gap-4">
        <div className="w-full h-44 scada-soft-box flex items-center justify-center">
          <i className="ph ph-camera text-4xl scada-text-secondary" />
        </div>
        <div className="w-full grid grid-cols-2 gap-3 justify-center">
          <div>
            <label className="text-xs scada-text-secondary font-semibold uppercase">Placa</label>
            <div className="scada-soft-box px-2 py-1 font-mono text-lg font-bold">{placa}</div>
          </div>
          <div>
            <label className="text-xs scada-text-secondary font-semibold uppercase">Chofer</label>
            <div className="scada-soft-box px-2 py-1 font-mono text-lg font-bold">{chofer}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TarjetaVehiculoChofer;
