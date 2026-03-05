import { Link } from "react-router-dom";
import SensorItem from "../components/layout/edicion-layout/item-perifericos/SensorItem";
import BalanzaItem from "../components/layout/edicion-layout/item-perifericos/BalanzaItem";
import CamaraItem from "../components/layout/edicion-layout/item-perifericos/CamaraItem";
import LetreroItem from "../components/layout/edicion-layout/item-perifericos/LetreroItem";
import SwitchItem from "../components/layout/edicion-layout/item-perifericos/SwitchItem";
import UpsItem from "../components/layout/edicion-layout/item-perifericos/UpsItem";

function PaginaDiagrama() {
    return (
        <main className="p-4 h-screen flex flex-col gap-4">
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold scada-text-primary tracking-tight">
                    Sistema SCADA: Control de Pesaje
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm scada-text-secondary">
                        Estado del Sistema: <span className="scada-text-ok font-bold">ONLINE</span>
                    </div>
                    {/* <nav className="flex items-center gap-2 text-sm">
            <Link className="scada-text-primary font-semibold hover:underline" to="/dashboard">
              Dashboard
            </Link>
            <span className="scada-text-secondary">|</span>
            <Link className="scada-text-secondary hover:underline" to="/alertas">
              Alertas
            </Link>
          </nav> */}
                </div>
            </header>

            <article className="col-span-6 scada-card shadow-sm p-4 flex flex-col relative h-full">
                <h2 className="text-sm font-semibold scada-title p-2 rounded mb-2 absolute top-4 left-4 z-10 w-[98%] flex gap-2 items-center">
                    <Link to="/dashboard" className="px-2 py-1 rounded scada-chip flex items-center justify-between">
                        Volver
                    </Link>
                    <div>
                        Diagrama del Sistema y Sensores
                    </div>
                </h2>

                <div className="engineering-grid w-full h-full rounded border scada-divider flex items-center justify-center mt-8">
                    <SensorItem />
                    <BalanzaItem />
                    <CamaraItem />
                    <LetreroItem />
                    <SwitchItem />
                    <UpsItem />
                    {/* <div className="text-center scada-text-secondary">
                        <p className="text-sm">[ Visualizacion SVG Interactiva del Camion ]</p>
                        <p className="text-xs">Sensores de Posicion Activos</p>
                    </div> */}
                </div>
            </article>
        </main>
    );
}

export default PaginaDiagrama;