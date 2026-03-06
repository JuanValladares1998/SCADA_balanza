import { Link } from "react-router-dom";
import SensorItem from "../components/layout/edicion-layout/item-perifericos/SensorItem";
import BalanzaItem from "../components/layout/edicion-layout/item-perifericos/BalanzaItem";
import CamaraItem from "../components/layout/edicion-layout/item-perifericos/CamaraItem";
import LetreroItem from "../components/layout/edicion-layout/item-perifericos/LetreroItem";
import SwitchItem from "../components/layout/edicion-layout/item-perifericos/SwitchItem";
import UpsItem from "../components/layout/edicion-layout/item-perifericos/UpsItem";
import BotonItem from "../components/layout/edicion-layout/BotonItem";

function PaginaDiagrama() {
  return (
    <main className="p-4 h-screen flex flex-col gap-3">
      <header className="scada-card shadow-sm p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold text-base scada-text-primary">SCADA Designer</div>
          <div className="h-5 w-px border-r scada-divider" />
          <div className="flex p-1 rounded scada-soft-box">
            <button className="px-3 py-1 text-xs font-bold scada-chip scada-chip-ok">EDICION</button>
            <button className="px-3 py-1 text-xs font-bold scada-text-secondary">RUNTIME</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="px-3 py-1 text-xs font-semibold scada-chip scada-text-secondary">
            Volver
          </Link>
          <button className="px-3 py-1 text-xs font-semibold scada-chip scada-text-secondary">Cancelar</button>
          <button className="px-3 py-1 text-xs font-semibold scada-chip scada-chip-ok scada-text-ok">Guardar Diagrama</button>
        </div>
      </header>

      <section className="flex-1 min-h-0 flex gap-3">
        <aside className="w-64 scada-card shadow-sm p-2 flex flex-col min-h-0">
          <div className="p-2 text-[11px] font-semibold uppercase scada-text-secondary border-b scada-divider">Componentes</div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold scada-text-primary mb-2">Sensores e Input</h3>
              <div className="grid grid-cols-2 gap-2">
                <BotonItem nombre="Balanza">
                  <BalanzaItem h={68} w={68} />
                </BotonItem>
                <BotonItem nombre="Camara">
                  <CamaraItem h={68} w={68} />
                </BotonItem>
                <BotonItem nombre="Letrero">
                  <LetreroItem h={68} w={68} />
                </BotonItem>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold scada-text-primary mb-2">Señales y Salidas</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="scada-chip p-2 text-center text-[10px] scada-text-secondary">
                  <div className="flex justify-center mb-1"><SwitchItem h={68} w={68} /></div>
                  Switch
                </div>
                <div className="scada-chip p-2 text-center text-[10px] scada-text-secondary">
                  <div className="flex justify-center mb-1"><LetreroItem h={68} w={68} /></div>
                  Letrero LED
                </div>
                <div className="scada-chip p-2 text-center text-[10px] scada-text-secondary">
                  <div className="flex justify-center mb-1"><UpsItem h={68} w={68} /></div>
                  UPS
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 scada-card shadow-sm relative overflow-hidden flex items-center justify-center">
          <div className="engineering-grid absolute inset-0 opacity-40" />

          <div className="relative w-[600px] h-[400px] border-2 border-dashed scada-divider rounded flex items-center justify-center">
            <span className="scada-text-secondary text-sm">Area de Trabajo (React Flow)</span>

            <div className="absolute top-20 left-20 w-36 scada-card border-2 border-emerald-400 rounded p-2 flex flex-col items-center z-20">
              <div className="w-3 h-3 rounded-full bg-emerald-500 absolute -top-1.5" />
              <div><BalanzaItem h={68} w={68} /></div>
              <span className="text-xs font-bold mt-1 scada-text-primary">Bascula #1</span>
              <div className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-1.5" />
            </div>
          </div>
        </section>

        <aside className="w-72 scada-card shadow-sm flex flex-col min-h-0">
          <div className="p-3 text-[11px] font-semibold uppercase scada-text-secondary border-b scada-divider">Propiedades</div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="scada-chip p-2">
              <div className="text-sm font-bold scada-text-primary">Bascula #1</div>
              <div className="text-[10px] scada-text-secondary">ID: node_8472</div>
            </div>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Etiqueta Visual</span>
              <input
                type="text"
                defaultValue="Bascula Entrada"
                className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Variable de Peso (Tag)</span>
              <select className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm">
                <option>PLC1.Analog.Weight_In</option>
                <option>PLC1.Analog.Weight_Out</option>
                <option>Sin Asignar</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Variable de Estado</span>
              <select className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm">
                <option>PLC1.Status.Scale_Ready</option>
                <option>PLC1.Status.Scale_Error</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[10px] font-semibold scada-text-secondary">Max (kg)</span>
                <input type="number" defaultValue="45000" className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm" />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold scada-text-secondary">Min (kg)</span>
                <input type="number" defaultValue="0" className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm" />
              </label>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PaginaDiagrama;
