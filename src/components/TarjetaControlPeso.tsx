type PropiedadesTarjetaControlPeso = {
  pesoEntrada: number;
  pesoSalida: number;
};

function TarjetaControlPeso({ pesoEntrada, pesoSalida }: PropiedadesTarjetaControlPeso) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col justify-between">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Control de Peso</h2>

      <div className="grid grid-cols-2 text-center">
        <div className="text-sm scada-text-secondary mt-1">Primer Pesaje<br></br>(Entrada)</div>
        <div className="text-5xl font-bold scada-text-primary">
          {pesoEntrada.toLocaleString()} <span className="text-2xl scada-text-secondary">kg</span>
        </div>
      </div>

      <div className="border-t scada-divider my-2" />

      <div className="grid grid-cols-2 text-center">
        <div className="text-sm scada-text-secondary mt-1">Segundo Pesaje<br></br>(Salida)</div>
        <div className="text-5xl font-bold scada-text-primary">
          {pesoSalida.toLocaleString()} <span className="text-2xl scada-text-secondary">kg</span>
        </div>
      </div>

      <div className="border-t scada-divider my-2" />
    </article>
  );
}

export default TarjetaControlPeso;
