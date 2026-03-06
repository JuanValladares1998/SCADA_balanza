import { Handle, Position, type NodeProps } from "reactflow";
import BalanzaItem from "./item-perifericos/BalanzaItem";
import CamaraItem from "./item-perifericos/CamaraItem";
import LetreroItem from "./item-perifericos/LetreroItem";
import SensorItem from "./item-perifericos/SensorItem";
import SwitchItem from "./item-perifericos/SwitchItem";
import UpsItem from "./item-perifericos/UpsItem";

export type TipoPeriferico =
  | "balanza"
  | "camara"
  | "letrero-led"
  | "sensor"
  | "switch"
  | "ups";

export type DatosNodoPeriferico = {
  nombre: string;
  tipoPeriferico: TipoPeriferico;
};

function obtenerIcono(tipoPeriferico: TipoPeriferico) {
  switch (tipoPeriferico) {
    case "balanza":
      return <BalanzaItem h={34} w={34} colorClass="text-slate-700" />;
    case "camara":
      return <CamaraItem h={34} w={34} colorClass="text-slate-700" />;
    case "letrero-led":
      return <LetreroItem h={34} w={34} colorClass="text-slate-700" />;
    case "sensor":
      return <SensorItem h={34} w={34} colorClass="text-slate-700" />;
    case "switch":
      return <SwitchItem h={34} w={34} colorClass="text-slate-700" />;
    case "ups":
      return <UpsItem h={34} w={34} colorClass="text-slate-700" />;
    default:
      return null;
  }
}

function NodoPeriferico({ data, selected }: NodeProps<DatosNodoPeriferico>) {
  return (
    <div
      className={`w-20 h-20 scada-card flex flex-col items-center justify-center gap-1 text-center px-2 ${selected ? "ring-2 ring-emerald-400" : ""
        }`}
    >
      <Handle
        id="entrada"
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !flex !items-center !justify-center !border-2 !border-slate-500 !bg-slate-100 !rounded-full"
        title="entrada"
      >
        <i className="ph-fill ph-caret-circle-right text-[10px] text-slate-600 pointer-events-none"></i>
      </Handle>
      <Handle
        id="salida"
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !flex !items-center !justify-center !border-2 !border-slate-500 !bg-slate-100 !rounded-full"
        title="entrada"
      >
        <i className="ph-fill ph-caret-circle-right text-[10px] text-slate-600 pointer-events-none"></i>
      </Handle>
      <div className="flex items-center justify-center">{obtenerIcono(data.tipoPeriferico)}</div>
      <div className="text-[11px] font-semibold scada-text-primary leading-tight">{data.nombre}</div>
    </div>
  );
}

export default NodoPeriferico;
