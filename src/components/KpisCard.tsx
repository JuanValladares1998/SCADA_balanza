function KpisCard() {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-2">KPIs del Proceso</h2>

      <div className="flex-1 grid grid-cols-2 gap-2 content-center">
        <div className="scada-soft-box p-2">
          <div className="text-[11px] scada-text-secondary leading-tight">N. ingresos a balanza</div>
          <div className="text-2xl font-bold scada-text-primary mt-1">126</div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="text-[11px] scada-text-secondary leading-tight">T. operativo prom. / pesaje</div>
          <div className="text-2xl font-bold scada-text-primary mt-1">
            7.8 <span className="text-sm scada-text-secondary">min</span>
          </div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="text-[11px] scada-text-secondary leading-tight">Peso total procesado</div>
          <div className="text-2xl font-bold scada-text-primary mt-1">
            1,842 <span className="text-sm scada-text-secondary">t</span>
          </div>
        </div>
        <div className="scada-soft-box p-2">
          <div className="text-[11px] scada-text-secondary leading-tight">Eficiencia operativa</div>
          <div className="text-2xl font-bold scada-text-ok mt-1">
            94.6 <span className="text-sm scada-text-secondary">%</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default KpisCard;
