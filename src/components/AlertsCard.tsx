function AlertsCard() {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-3">Alertas del Sistema</h2>

      <div className="flex-1 overflow-y-auto scada-scroll pr-1 space-y-2">
        <div className="flex items-start gap-3 p-2 scada-alert scada-alert-alarm">
          <i className="ph-fill ph-warning-circle scada-text-alarm text-xl mt-0.5" />
          <div>
            <div className="text-sm font-bold scada-text-alarm">Alerta 1</div>
            <div className="text-xs scada-text-alarm">Sensor de Entrada Desconectado</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 scada-alert scada-alert-warning">
          <i className="ph-fill ph-warning scada-text-warning text-xl mt-0.5" />
          <div>
            <div className="text-sm font-bold scada-text-warning">Alerta 2</div>
            <div className="text-xs scada-text-warning">Peso Excede Limite Permitido</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 scada-alert scada-alert-ok opacity-60">
          <i className="ph-fill ph-info scada-text-ok text-xl mt-0.5" />
          <div>
            <div className="text-sm font-bold scada-text-ok">Alerta 3</div>
            <div className="text-xs scada-text-ok">Calibracion Exitosa (08:00 AM)</div>
          </div>
        </div>
        <div className="p-2 text-xs scada-text-secondary text-center">... mas alertas ...</div>
      </div>
    </article>
  );
}

export default AlertsCard;
