import { type PointerEvent as ReactPointerEvent } from "react";
import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from "reactflow";

import type { TipoConexion } from "./NodoPeriferico";

export type DatosAristaEditable = {
  tipoConexion: TipoConexion;
  offsetX?: number;
  offsetY?: number;
  onCambiarOffset?: (edgeId: string, nuevoOffsetX: number, nuevoOffsetY: number) => void;
};

function construirRutaOrtogonal(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  offsetX: number,
  offsetY: number,
) {
  const centroBaseX = (sourceX + targetX) / 2;
  const centroBaseY = (sourceY + targetY) / 2;
  const centroX = centroBaseX + offsetX;
  const centroY = centroBaseY + offsetY;

  return {
    path: `M ${sourceX} ${sourceY} L ${centroX} ${sourceY} L ${centroX} ${centroY} L ${targetX} ${centroY} L ${targetX} ${targetY}`,
    centroX,
    centroY,
  };
}

function AristaOrtogonalEditable({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  markerEnd,
  style,
  label,
  data,
}: EdgeProps<DatosAristaEditable>) {
  const offsetX = data?.offsetX ?? 0;
  const offsetY = data?.offsetY ?? 0;
  const { path, centroX, centroY } = construirRutaOrtogonal(
    sourceX,
    sourceY,
    targetX,
    targetY,
    offsetX,
    offsetY,
  );

  const manejarPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inicioX = event.clientX;
    const inicioY = event.clientY;
    const offsetXInicial = offsetX;
    const offsetYInicial = offsetY;

    const manejarPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - inicioX;
      const deltaY = moveEvent.clientY - inicioY;
      data?.onCambiarOffset?.(id, offsetXInicial + deltaX, offsetYInicial + deltaY);
    };

    const manejarPointerUp = () => {
      window.removeEventListener("pointermove", manejarPointerMove);
      window.removeEventListener("pointerup", manejarPointerUp);
    };

    window.addEventListener("pointermove", manejarPointerMove);
    window.addEventListener("pointerup", manejarPointerUp);
  };

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <button
          type="button"
          className="nodrag nopan absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: centroX,
            top: centroY,
            cursor: "move",
            pointerEvents: "all",
            zIndex: 20,
            backgroundColor: "transparent",
          }}
          onPointerDown={manejarPointerDown}
          title="Mover cable"
        />
        {label ? (
          <div
            className="nodrag nopan absolute -translate-x-1/2 -translate-y-[150%] rounded-full px-1.5 py-px text-[9px] font-semibold shadow-sm"
            style={{
              left: centroX,
              top: centroY,
              color: style?.stroke as string,
              backgroundColor: "#ffffff",
              border: `1px solid ${style?.stroke as string}33`,
              pointerEvents: "none",
            }}
          >
            {label === "Senal" ? "Señal" : "Energía"}
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  );
}

export default AristaOrtogonalEditable;
