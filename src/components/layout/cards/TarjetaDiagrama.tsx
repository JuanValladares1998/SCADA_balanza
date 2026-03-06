import { Link } from "react-router-dom";

function TarjetaDiagrama() {
  return (
    <article className="col-span-6 scada-card shadow-sm p-4 flex flex-col relative">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-2 absolute top-4 left-4 z-10 w-[95%]">
        <Link to="/diagrama-editar">
          Diagrama del Sistema y Sensores
        </Link>
      </h2>

      <div className="engineering-grid w-full h-full rounded border scada-divider flex items-center justify-center mt-8">
        <div className="text-center scada-text-secondary">
          <i className="ph ph-truck text-6xl mb-2" />
          <p className="text-sm">[ Visualizacion SVG Interactiva del Camion ]</p>
          <p className="text-xs">Sensores de Posicion Activos</p>
        </div>
      </div>
    </article>
  );
}

export default TarjetaDiagrama;
