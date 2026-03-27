import { useCallback, useMemo, useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactFlow, {
  Background,
  ConnectionLineType,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import AristaOrtogonalEditable, {
  type DatosAristaEditable,
} from "../components/layout/edicion-layout/AristaOrtogonalEditable";
import BotonItem from "../components/layout/edicion-layout/BotonItem";
import NodoPeriferico, {
  type DatosNodoPeriferico,
  type TipoConexion,
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
    icono: <BalanzaItem h={68} w={68} />,
    tipo: "entrada",
    tipoPeriferico: "balanza",
  },
  {
    nombre: "Camara",
    icono: <CamaraItem h={68} w={68} />,
    tipo: "entrada",
    tipoPeriferico: "camara",
  },
  {
    nombre: "Sensor",
    icono: <SensorItem h={68} w={68} />,
    tipo: "entrada",
    tipoPeriferico: "sensor",
  },
  {
    nombre: "Switch",
    icono: <SwitchItem h={68} w={68} />,
    tipo: "entrada",
    tipoPeriferico: "switch",
  },
  {
    nombre: "UPS",
    icono: <UpsItem h={68} w={68} />,
    tipo: "entrada",
    tipoPeriferico: "ups",
  },
  {
    nombre: "Letrero LED",
    icono: <LetreroItem h={68} w={68} />,
    tipo: "salida",
    tipoPeriferico: "letrero-led",
  },
];

const tiposNodo = {
  periferico: NodoPeriferico,
};

const tiposArista = {
  ortogonalEditable: AristaOrtogonalEditable,
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

const aristasIniciales: Edge<DatosAristaEditable>[] = [];

const coloresConexion: Record<TipoConexion, string> = {
  energia: "#f59e0b",
  senal: "#0ea5e9",
};

const etiquetasConexion: Record<TipoConexion, string> = {
  energia: "Energia",
  senal: "Senal",
};

function obtenerTipoConexionDesdeHandle(handleId?: string | null): TipoConexion | null {
  if (!handleId) return null;
  if (handleId.includes("energia")) return "energia";
  if (handleId.includes("senal")) return "senal";
  return null;
}

function PaginaDiagrama() {
  const contenedorReactFlowRef = useRef<HTMLDivElement | null>(null);
  const [instanciaReactFlow, setInstanciaReactFlow] = useState<ReactFlowInstance | null>(null);
  const [nodos, setNodos] = useState<Node<DatosNodoPeriferico>[]>(nodosIniciales);
  const [aristas, setAristas] = useState<Edge<DatosAristaEditable>[]>(aristasIniciales);
  const [nodoSeleccionado, setNodoSeleccionado] = useState<Node<DatosNodoPeriferico> | null>(null);
  const [aristaSeleccionada, setAristaSeleccionada] = useState<Edge<DatosAristaEditable> | null>(null);

  const manejarCambiarOffsetArista = useCallback((edgeId: string, nuevoOffsetX: number, nuevoOffsetY: number) => {
    setAristas((aristasActuales) =>
      aristasActuales.map((arista) =>
        arista.id === edgeId && arista.data
          ? ({
              ...arista,
              data: {
                ...arista.data,
                offsetX: nuevoOffsetX,
                offsetY: nuevoOffsetY,
              },
            } as Edge<DatosAristaEditable>)
          : arista,
      ),
    );

    setAristaSeleccionada((aristaActual) =>
      aristaActual?.id === edgeId && aristaActual.data
        ? ({
            ...aristaActual,
            data: {
              ...aristaActual.data,
              offsetX: nuevoOffsetX,
              offsetY: nuevoOffsetY,
            },
          } as Edge<DatosAristaEditable>)
        : aristaActual,
    );
  }, []);

  const aristasRender = useMemo(
    () =>
      aristas.map((arista) => ({
        ...arista,
        type: "ortogonalEditable",
        data: {
          ...arista.data,
          onCambiarOffset: manejarCambiarOffsetArista,
        },
      })),
    [aristas, manejarCambiarOffsetArista],
  );

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

  const manejarClickNodo = (_event: MouseEvent, nodo: Node<DatosNodoPeriferico>) => {
    setNodoSeleccionado(nodo);
    setAristaSeleccionada(null);
  };

  const manejarClickArista = (_event: MouseEvent, arista: Edge<DatosAristaEditable>) => {
    setAristaSeleccionada(arista);
    setNodoSeleccionado(null);
  };

  const manejarClickPanel = () => {
    setNodoSeleccionado(null);
    setAristaSeleccionada(null);
  };

  const manejarCambioAristas = (cambios: EdgeChange[]) => {
    setAristas((aristasActuales) => {
      const aristasActualizadas = applyEdgeChanges(cambios, aristasActuales);

      if (aristaSeleccionada) {
        const aristaActualizada = aristasActualizadas.find((arista) => arista.id === aristaSeleccionada.id) ?? null;
        setAristaSeleccionada(aristaActualizada);
      }

      return aristasActualizadas;
    });
  };

  const manejarConectar = (conexion: Connection) => {
    const tipoOrigen = obtenerTipoConexionDesdeHandle(conexion.sourceHandle);
    const tipoDestino = obtenerTipoConexionDesdeHandle(conexion.targetHandle);

    if (!tipoOrigen || !tipoDestino || tipoOrigen !== tipoDestino) {
      return;
    }

    setAristas((aristasActuales) =>
      addEdge(
        {
          ...conexion,
          id: `arista-${Date.now()}`,
          type: "ortogonalEditable",
          data: {
            tipoConexion: tipoOrigen,
            offsetX: 0,
            offsetY: 0,
          },
          label: etiquetasConexion[tipoOrigen],
          style: {
            stroke: coloresConexion[tipoOrigen],
            strokeWidth: 3,
          },
          labelStyle: {
            fill: coloresConexion[tipoOrigen],
            fontSize: 11,
            fontWeight: 600,
          },
        },
        aristasActuales,
      ),
    );
  };

  const manejarEliminarNodoSeleccionado = () => {
    if (!nodoSeleccionado) return;

    setNodos((nodosActuales) => nodosActuales.filter((nodo) => nodo.id !== nodoSeleccionado.id));
    setNodoSeleccionado(null);
  };

  const manejarEliminarAristaSeleccionada = () => {
    if (!aristaSeleccionada) return;

    setAristas((aristasActuales) => aristasActuales.filter((arista) => arista.id !== aristaSeleccionada.id));
    setAristaSeleccionada(null);
  };

  const manejarDuplicarNodoSeleccionado = () => {
    if (!nodoSeleccionado) return;

    const nodoDuplicado: Node<DatosNodoPeriferico> = {
      ...nodoSeleccionado,
      id: `${nodoSeleccionado.id}-copia-${Date.now()}`,
      position: {
        x: nodoSeleccionado.position.x + 40,
        y: nodoSeleccionado.position.y + 40,
      },
      selected: false,
      dragging: false,
      data: {
        ...nodoSeleccionado.data,
        nombre: `${nodoSeleccionado.data.nombre} copia`,
      },
    };

    setNodos((nodosActuales) => [...nodosActuales, nodoDuplicado]);
    setNodoSeleccionado(nodoDuplicado);
  };

  const manejarCentrarEnNodo = () => {
    if (!nodoSeleccionado || !instanciaReactFlow) return;

    instanciaReactFlow.setCenter(nodoSeleccionado.position.x + 40, nodoSeleccionado.position.y + 40, {
      zoom: 1.2,
      duration: 500,
    });
  };

  const manejarCentrarEnArista = () => {
    if (!aristaSeleccionada || !instanciaReactFlow) return;

    const nodoOrigen = nodos.find((nodo) => nodo.id === aristaSeleccionada.source);
    const nodoDestino = nodos.find((nodo) => nodo.id === aristaSeleccionada.target);

    if (!nodoOrigen || !nodoDestino) return;

    instanciaReactFlow.setCenter(
      (nodoOrigen.position.x + nodoDestino.position.x) / 2 + 40,
      (nodoOrigen.position.y + nodoDestino.position.y) / 2 + 40,
      { zoom: 1.1, duration: 500 },
    );
  };

  const manejarCambioNodos = (cambios: NodeChange[]) => {
    setNodos((nodosActuales) => {
      const nodosActualizados = applyNodeChanges(cambios, nodosActuales);

      if (nodoSeleccionado) {
        const nodoSeleccionadoActualizado = nodosActualizados.find((nodo) => nodo.id === nodoSeleccionado.id) ?? null;
        setNodoSeleccionado(nodoSeleccionadoActualizado);
      }

      return nodosActualizados;
    });
  };

  const actualizarNodoSeleccionado = (cambios: Partial<DatosNodoPeriferico>) => {
    if (!nodoSeleccionado) {
      return;
    }

    setNodos((nodosActuales) =>
      nodosActuales.map((nodo) =>
        nodo.id === nodoSeleccionado.id
          ? {
              ...nodo,
              data: {
                ...nodo.data,
                ...cambios,
              },
            }
          : nodo,
      ),
    );

    setNodoSeleccionado((nodoActual) =>
      nodoActual
        ? {
            ...nodoActual,
            data: {
              ...nodoActual.data,
              ...cambios,
            },
          }
        : null,
    );
  };

  return (
    <main className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-4">
      <header className="scada-card flex items-center justify-between p-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="scada-text-primary text-base font-bold">SCADA Designer</div>
          <div className="scada-divider h-5 w-px border-r" />
          <div className="scada-soft-box flex rounded p-1">
            <button className="scada-chip scada-chip-ok px-3 py-1 text-xs font-bold">EDICION</button>
            <button className="scada-text-secondary px-3 py-1 text-xs font-bold">RUNTIME</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="scada-chip scada-text-secondary px-3 py-1 text-xs font-semibold">
            Volver
          </Link>
          <button className="scada-chip scada-text-secondary px-3 py-1 text-xs font-semibold">Cancelar</button>
          <button className="scada-chip scada-chip-ok scada-text-ok px-3 py-1 text-xs font-semibold">
            Guardar Diagrama
          </button>
        </div>
      </header>

      <section className="flex min-h-0 flex-1 gap-3">
        <aside className="scada-card flex min-h-0 w-64 flex-col p-2 shadow-sm">
          <div className="scada-divider border-b p-2 text-[11px] font-semibold uppercase scada-text-secondary">
            Componentes
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-2">
            <div>
              <h3 className="scada-text-primary mb-2 text-xs font-bold">Sensores e Input</h3>
              <div className="grid grid-cols-2 gap-2">
                {itemsDisponibles
                  .filter((item) => item.tipo === "entrada")
                  .map((item) => (
                    <BotonItem key={item.nombre} nombre={item.nombre} onDragStart={manejarInicioArrastre(item)}>
                      {item.icono}
                    </BotonItem>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="scada-text-primary mb-2 text-xs font-bold">Senales y Salidas</h3>
              <div className="grid grid-cols-2 gap-2">
                {itemsDisponibles
                  .filter((item) => item.tipo === "salida")
                  .map((item) => (
                    <BotonItem key={item.nombre} nombre={item.nombre} onDragStart={manejarInicioArrastre(item)}>
                      {item.icono}
                    </BotonItem>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="scada-card relative flex-1 overflow-hidden shadow-sm">
          <div ref={contenedorReactFlowRef} className="h-full w-full" onDragOver={manejarDragOver} onDrop={manejarDrop}>
            <ReactFlow
              nodes={nodos}
              edges={aristasRender}
              nodeTypes={tiposNodo}
              edgeTypes={tiposArista}
              onInit={setInstanciaReactFlow}
              onNodesChange={manejarCambioNodos}
              onEdgesChange={manejarCambioAristas}
              onConnect={manejarConectar}
              onNodeClick={manejarClickNodo}
              onEdgeClick={manejarClickArista}
              onPaneClick={manejarClickPanel}
              isValidConnection={(conexion) => {
                const tipoOrigen = obtenerTipoConexionDesdeHandle(conexion.sourceHandle);
                const tipoDestino = obtenerTipoConexionDesdeHandle(conexion.targetHandle);

                return Boolean(
                  conexion.source &&
                    conexion.target &&
                    conexion.source !== conexion.target &&
                    tipoOrigen &&
                    tipoDestino &&
                    tipoOrigen === tipoDestino,
                );
              }}
              connectionLineType={ConnectionLineType.Step}
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

        <aside className="scada-card flex min-h-0 w-72 flex-col shadow-sm">
          <div className="scada-divider border-b p-3 text-[11px] font-semibold uppercase scada-text-secondary">
            Propiedades
          </div>

          <div className="scada-divider border-b border-t p-4">
            <div className="flex items-center gap-2">
              {nodoSeleccionado ? (
                <button
                  type="button"
                  onClick={manejarDuplicarNodoSeleccionado}
                  disabled={!nodoSeleccionado}
                  title="Duplicar nodo"
                  className="scada-chip scada-text-primary flex h-9 w-9 items-center justify-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <i className="ph ph-copy" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={nodoSeleccionado ? manejarCentrarEnNodo : manejarCentrarEnArista}
                disabled={!nodoSeleccionado && !aristaSeleccionada}
                title={nodoSeleccionado ? "Centrar en nodo" : "Centrar en arista"}
                className="scada-chip scada-text-primary flex h-9 w-9 items-center justify-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="ph ph-crosshair" />
              </button>
              <button
                type="button"
                onClick={nodoSeleccionado ? manejarEliminarNodoSeleccionado : manejarEliminarAristaSeleccionada}
                disabled={!nodoSeleccionado && !aristaSeleccionada}
                title={nodoSeleccionado ? "Eliminar nodo" : "Eliminar arista"}
                className="scada-chip scada-text-error flex h-9 w-9 items-center justify-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="ph ph-trash" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="scada-chip p-2">
              <div className="scada-text-primary text-sm font-bold">
                {nodoSeleccionado?.data.nombre ?? aristaSeleccionada?.id ?? "Sin seleccion"}
              </div>
              <div className="text-[10px] scada-text-secondary">ID: {nodoSeleccionado?.id ?? aristaSeleccionada?.id ?? "-"}</div>
              {aristaSeleccionada ? (
                <div
                  className="mt-2 inline-flex items-center gap-2 rounded-full px-2 py-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${coloresConexion[
                      (aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"
                    ]}22`,
                    color:
                      coloresConexion[(aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"],
                  }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        coloresConexion[
                          (aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"
                        ],
                    }}
                  />
                  {etiquetasConexion[(aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"]}
                </div>
              ) : null}
            </div>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Etiqueta Visual</span>
              <input
                type="text"
                value={nodoSeleccionado?.data.nombre ?? ""}
                className="scada-soft-box mt-1 block w-full px-2 py-1 text-sm outline-none"
                onChange={(event) => actualizarNodoSeleccionado({ nombre: event.target.value })}
                disabled={!nodoSeleccionado}
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Tipo de periferico</span>
              <select
                value={nodoSeleccionado?.data.tipoPeriferico ?? ""}
                className="scada-soft-box mt-1 block w-full px-2 py-1 text-sm"
                onChange={(event) =>
                  actualizarNodoSeleccionado({
                    tipoPeriferico: event.target.value as TipoPeriferico,
                  })
                }
                disabled={!nodoSeleccionado}
              >
                <option value="" disabled>
                  Selecciona un nodo
                </option>
                <option value="balanza">Balanza</option>
                <option value="camara">Camara</option>
                <option value="letrero-led">Letrero LED</option>
                <option value="sensor">Sensor</option>
                <option value="switch">Switch</option>
                <option value="ups">UPS</option>
              </select>
            </label>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PaginaDiagrama;
