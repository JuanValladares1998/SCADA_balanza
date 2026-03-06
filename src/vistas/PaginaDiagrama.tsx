import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import BotonItem from "../components/layout/edicion-layout/BotonItem";
import NodoPeriferico, {
  type DatosNodoPeriferico,
  type TipoPeriferico,
} from "../components/layout/edicion-layout/NodoPeriferico";
import BalanzaItem from "../components/layout/edicion-layout/item-perifericos/BalanzaItem";
import CamaraItem from "../components/layout/edicion-layout/item-perifericos/CamaraItem";
import LetreroItem from "../components/layout/edicion-layout/item-perifericos/LetreroItem";
import SensorItem from "../components/layout/edicion-layout/item-perifericos/SensorItem";
import SwitchItem from "../components/layout/edicion-layout/item-perifericos/SwitchItem";
import UpsItem from "../components/layout/edicion-layout/item-perifericos/UpsItem";

type ItemDisponible = {
  nombre: string;
  icono: ReactNode;
  tipo: "entrada" | "salida";
  tipoPeriferico: TipoPeriferico;
};

const itemsDisponibles: ItemDisponible[] = [
  {
    nombre: "Balanza",
    icono: <BalanzaItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "entrada",
    tipoPeriferico: "balanza",
  },
  {
    nombre: "Camara",
    icono: <CamaraItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "entrada",
    tipoPeriferico: "camara",
  },
  {
    nombre: "Letrero LED",
    icono: <LetreroItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "salida",
    tipoPeriferico: "letrero-led",
  },
  {
    nombre: "Sensor",
    icono: <SensorItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "entrada",
    tipoPeriferico: "sensor",
  },
  {
    nombre: "Switch",
    icono: <SwitchItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "entrada",
    tipoPeriferico: "switch",
  },
  {
    nombre: "Ups",
    icono: <UpsItem h={68} w={68} colorClass="text-slate-700" />,
    tipo: "entrada",
    tipoPeriferico: "ups",
  },
];

const tiposNodo = {
  periferico: NodoPeriferico,
};

const nodosIniciales: Node<DatosNodoPeriferico>[] = [
  {
    id: "nodo-prueba",
    position: { x: 220, y: 140 },
    type: "periferico",
    data: {
      nombre: "Nodo de prueba",
      tipoPeriferico: "balanza",
    },
  },
];

function PaginaDiagrama() {
  const contenedorReactFlowRef = useRef<HTMLDivElement | null>(null);
  const [instanciaReactFlow, setInstanciaReactFlow] = useState<ReactFlowInstance | null>(null);
  const [nodos, setNodos] = useState<Node<DatosNodoPeriferico>[]>(nodosIniciales);

  const manejarInicioArrastre = (item: ItemDisponible) => (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        nombre: item.nombre,
        tipo: item.tipo,
        tipoPeriferico: item.tipoPeriferico,
      }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const manejarDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const manejarDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!instanciaReactFlow || !contenedorReactFlowRef.current) {
      return;
    }

    const itemSerializado = event.dataTransfer.getData("application/reactflow");

    if (!itemSerializado) {
      return;
    }

    const item: Pick<ItemDisponible, "nombre" | "tipo" | "tipoPeriferico"> = JSON.parse(itemSerializado);
    const posicion = instanciaReactFlow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const nuevoNodo: Node<DatosNodoPeriferico> = {
      id: `${item.tipoPeriferico}-${Date.now()}`,
      position: posicion,
      type: "periferico",
      data: {
        nombre: item.nombre,
        tipoPeriferico: item.tipoPeriferico,
      },
    };

    setNodos((nodosActuales) => [...nodosActuales, nuevoNodo]);
  };

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
          <button className="px-3 py-1 text-xs font-semibold scada-chip scada-chip-ok scada-text-ok">
            Guardar Diagrama
          </button>
        </div>
      </header>

      <section className="flex-1 min-h-0 flex gap-3">
        <aside className="w-64 scada-card shadow-sm p-2 flex flex-col min-h-0">
          <div className="p-2 text-[11px] font-semibold uppercase scada-text-secondary border-b scada-divider">
            Componentes
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold scada-text-primary mb-2">Sensores e Input</h3>
              <div className="grid grid-cols-2 gap-2">
                {itemsDisponibles
                  .filter((item) => item.tipo === "entrada")
                  .map((item) => (
                    <BotonItem
                      key={item.nombre}
                      nombre={item.nombre}
                      onDragStart={manejarInicioArrastre(item)}
                    >
                      {item.icono}
                    </BotonItem>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold scada-text-primary mb-2">Senales y Salidas</h3>
              <div className="grid grid-cols-2 gap-2">
                {itemsDisponibles
                  .filter((item) => item.tipo === "salida")
                  .map((item) => (
                    <BotonItem
                      key={item.nombre}
                      nombre={item.nombre}
                      onDragStart={manejarInicioArrastre(item)}
                    >
                      {item.icono}
                    </BotonItem>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 scada-card shadow-sm relative overflow-hidden">
          <div
            ref={contenedorReactFlowRef}
            className="h-full w-full"
            onDragOver={manejarDragOver}
            onDrop={manejarDrop}
          >
            <ReactFlow
              nodes={nodos}
              nodeTypes={tiposNodo}
              onInit={setInstanciaReactFlow}
              fitView
              minZoom={0.5}
              maxZoom={1.8}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} color="#cbd5e1" />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </section>

        <aside className="w-72 scada-card shadow-sm flex flex-col min-h-0">
          <div className="p-3 text-[11px] font-semibold uppercase scada-text-secondary border-b scada-divider">
            Propiedades
          </div>

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
                <input
                  type="number"
                  defaultValue="45000"
                  className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold scada-text-secondary">Min (kg)</span>
                <input
                  type="number"
                  defaultValue="0"
                  className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm"
                />
              </label>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PaginaDiagrama;
