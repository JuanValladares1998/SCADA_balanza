import { useCallback, useMemo, useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionLineType,
  Controls,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import iconoSwitch from "../assets/imagenes/icono_switch_poe.png";
import iconoBalanza from "../assets/imagenes/icono_control_balanza.png";
import iconoCamara from "../assets/imagenes/icono_camara_survision.png";
import iconoLetrero from "../assets/imagenes/icono_cartel_LED.png";
import iconoUps from "../assets/imagenes/icono_ups.png";
import iconoSensor from "../assets/imagenes/icono_sensor_IR.png";

import BotonItem from "../components/layout/edicion-layout/BotonItem";
import AristaOrtogonalEditable, {
  type DatosAristaEditable,
} from "../components/layout/edicion-layout/AristaOrtogonalEditable";
import NodoPeriferico, {
  type DatosNodoPeriferico,
  type TipoConexion,
  type TipoPeriferico,
} from "../components/layout/edicion-layout/NodoPeriferico";

type ItemDisponible = {
  nombre: string;
  icono: ReactNode;
  tipo: "entrada" | "salida";
  tipoPeriferico: TipoPeriferico;
};

const itemsDisponibles: ItemDisponible[] = [
  {
    nombre: "Balanza",
    icono: <img src={iconoBalanza} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "entrada",
    tipoPeriferico: "balanza",
  },
  {
    nombre: "Camara",
    icono: <img src={iconoCamara} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "entrada",
    tipoPeriferico: "camara",
  },
  {
    nombre: "Letrero LED",
    icono: <img src={iconoLetrero} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "salida",
    tipoPeriferico: "letrero-led",
  },
  {
    nombre: "Sensor",
    icono: <img src={iconoSensor} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "entrada",
    tipoPeriferico: "sensor",
  },
  {
    nombre: "Switch",
    icono: <img src={iconoSwitch} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "entrada",
    tipoPeriferico: "switch",
  },
  {
    nombre: "Ups",
    icono: <img src={iconoUps} alt="Switch" className="h-[68px] w-[68px] object-contain" />,
    tipo: "entrada",
    tipoPeriferico: "ups",
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

  const manejarCambiarOffsetArista = useCallback((
    edgeId: string,
    nuevoOffsetX: number,
    nuevoOffsetY: number,
  ) => {
    setAristas((aristasActuales) =>
      aristasActuales.map((arista) =>
        arista.id === edgeId
          ? {
              ...arista,
              data: {
                ...arista.data,
                offsetX: nuevoOffsetX,
                offsetY: nuevoOffsetY,
              },
            } as Edge<DatosAristaEditable>
          : arista,
      ),
    );

    setAristaSeleccionada((aristaActual) =>
      aristaActual?.id === edgeId
        ? {
            ...aristaActual,
            data: {
              ...aristaActual.data,
              offsetX: nuevoOffsetX,
              offsetY: nuevoOffsetY,
            },
          } as Edge<DatosAristaEditable>
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
        const aristaActualizada =
          aristasActualizadas.find((arista) => arista.id === aristaSeleccionada.id) ?? null;
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

    setNodos((nodosActuales) =>
      nodosActuales.filter((nodo) => nodo.id !== nodoSeleccionado.id),
    );
    setNodoSeleccionado(null);
  };

  const manejarEliminarAristaSeleccionada = () => {
    if (!aristaSeleccionada) return;

    setAristas((aristasActuales) =>
      aristasActuales.filter((arista) => arista.id !== aristaSeleccionada.id),
    );
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

    instanciaReactFlow.setCenter(
      nodoSeleccionado.position.x + 40,
      nodoSeleccionado.position.y + 40,
      { zoom: 1.2, duration: 500 },
    );
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
        const nodoSeleccionadoActualizado =
          nodosActualizados.find((nodo) => nodo.id === nodoSeleccionado.id) ?? null;

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

        <aside className="w-72 scada-card shadow-sm flex flex-col min-h-0">
          <div className="p-3 text-[11px] font-semibold uppercase scada-text-secondary border-b scada-divider">
            Propiedades
          </div>

          <div className="p-4 border-t scada-divider border-b">
            <div className="flex items-center gap-2">
              {nodoSeleccionado ? (
                <button
                  type="button"
                  onClick={manejarDuplicarNodoSeleccionado}
                  disabled={!nodoSeleccionado}
                  title="Duplicar nodo"
                  className="h-9 w-9 flex items-center justify-center text-sm font-semibold scada-chip scada-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="ph ph-copy" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={nodoSeleccionado ? manejarCentrarEnNodo : manejarCentrarEnArista}
                disabled={!nodoSeleccionado && !aristaSeleccionada}
                title={nodoSeleccionado ? "Centrar en nodo" : "Centrar en arista"}
                className="h-9 w-9 flex items-center justify-center text-sm font-semibold scada-chip scada-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="ph ph-crosshair" />
              </button>
              <button
                type="button"
                onClick={nodoSeleccionado ? manejarEliminarNodoSeleccionado : manejarEliminarAristaSeleccionada}
                disabled={!nodoSeleccionado && !aristaSeleccionada}
                title={nodoSeleccionado ? "Eliminar nodo" : "Eliminar arista"}
                className="h-9 w-9 flex items-center justify-center text-sm font-semibold scada-chip scada-text-error disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="ph ph-trash" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="scada-chip p-2">
              <div className="text-sm font-bold scada-text-primary">
                {nodoSeleccionado?.data.nombre ?? aristaSeleccionada?.id ?? "Sin seleccion"}
              </div>
              <div className="text-[10px] scada-text-secondary">
                ID: {nodoSeleccionado?.id ?? aristaSeleccionada?.id ?? "-"}
              </div>
              {aristaSeleccionada ? (
                <div
                  className="mt-2 inline-flex items-center gap-2 rounded-full px-2 py-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${coloresConexion[
                      (aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"
                    ]}22`,
                    color:
                      coloresConexion[
                        (aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"
                      ],
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
                  {etiquetasConexion[
                    (aristaSeleccionada.data?.tipoConexion as TipoConexion | undefined) ?? "senal"
                  ]}
                </div>
              ) : null}
            </div>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Etiqueta Visual</span>
              <input
                type="text"
                value={nodoSeleccionado?.data.nombre ?? ""}
                className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm outline-none"
                onChange={(event) => actualizarNodoSeleccionado({ nombre: event.target.value })}
                disabled={!nodoSeleccionado}
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Tipo de periférico</span>
              <select
                value={nodoSeleccionado?.data.tipoPeriferico ?? ""}
                className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm"
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

            {/* <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Variable de Peso (Tag)</span>
              <select className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm" disabled={!nodoSeleccionado}>
                <option>PLC1.Analog.Weight_In</option>
                <option>PLC1.Analog.Weight_Out</option>
                <option>Sin Asignar</option>
              </select>
            </label> */}

            {/* <label className="block">
              <span className="text-xs font-semibold scada-text-secondary">Variable de Estado</span>
              <select className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm" disabled={!nodoSeleccionado}>
                <option>PLC1.Status.Scale_Ready</option>
                <option>PLC1.Status.Scale_Error</option>
              </select>
            </label> */}

            {/* <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[10px] font-semibold scada-text-secondary">Max (kg)</span>
                <input
                  type="number"
                  defaultValue="45000"
                  className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm"
                  disabled={!nodoSeleccionado}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold scada-text-secondary">Min (kg)</span>
                <input
                  type="number"
                  defaultValue="0"
                  className="mt-1 block w-full scada-soft-box px-2 py-1 text-sm"
                  disabled={!nodoSeleccionado}
                />
              </label>
            </div> */}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PaginaDiagrama;
