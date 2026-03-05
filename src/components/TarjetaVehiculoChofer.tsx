type PropiedadesTarjetaVehiculoChofer = {
  placa: string;
  chofer: string;
};

function TarjetaVehiculoChofer({ placa, chofer }: PropiedadesTarjetaVehiculoChofer) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Datos del Vehiculo y Chofer</h2>

      <div className="flex gap-4">
        <div className="w-1/2 scada-soft-box flex items-center justify-center h-32">
          <i className="ph ph-camera text-4xl scada-text-secondary" />
        </div>
        <div className="w-1/2 flex flex-col gap-3 justify-center">
          <div>
            <label className="text-xs scada-text-secondary font-semibold uppercase">Placa</label>
            <div className="scada-soft-box px-2 py-1 font-mono text-lg font-bold">{placa}</div>
          </div>
          <div>
            <label className="text-xs scada-text-secondary font-semibold uppercase">Chofer</label>
            <div className="text-sm font-semibold scada-text-primary">{chofer}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TarjetaVehiculoChofer;
