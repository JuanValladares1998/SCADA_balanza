function IRSensorsCard() {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-2">Monitoreo Sensores IR</h2>
      <div className="mb-3 p-2 rounded scada-chip scada-chip-ok flex items-center justify-between">
        <span className="text-xs font-semibold scada-text-ok uppercase tracking-wide">Estado de posicion</span>
        <span className="text-sm font-bold scada-text-ok">Camion alineado</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
        <div className="scada-soft-box p-2">
          <div className="scada-text-secondary">IR Entrada</div>
          <div className="mt-1 font-bold scada-text-ok">ACTIVO</div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="scada-text-secondary">IR Salida</div>
          <div className="mt-1 font-bold scada-text-ok">ACTIVO</div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="scada-text-secondary">IR Lateral Izq.</div>
          <div className="mt-1 font-bold scada-text-warning">FUERA DE RANGO</div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="scada-text-secondary">IR Lateral Der.</div>
          <div className="mt-1 font-bold scada-text-ok">ACTIVO</div>
        </div>
      </div>
    </article>
  );
}

export default IRSensorsCard;
