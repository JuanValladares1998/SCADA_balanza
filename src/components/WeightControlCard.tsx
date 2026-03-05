function WeightControlCard() {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col justify-between">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Control de Peso</h2>

      <div className="text-center">
        <div className="text-5xl font-bold scada-text-primary">
          22,000 <span className="text-2xl scada-text-secondary">kg</span>
        </div>
        <div className="text-sm scada-text-secondary mt-1">Primer Pesaje (Entrada)</div>
      </div>

      <div className="border-t scada-divider my-2" />

      <div className="text-center">
        <div className="text-3xl font-bold scada-text-primary">
          10,000 <span className="text-xl scada-text-secondary">kg</span>
        </div>
        <div className="text-sm scada-text-secondary mt-1">Segundo Pesaje (Salida)</div>
      </div>

      <div className="border-t scada-divider my-2" />
    </article>
  );
}

export default WeightControlCard;
