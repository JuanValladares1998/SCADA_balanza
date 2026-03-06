import { Handle, Position, type NodeProps } from "reactflow";
import iconoSwitch from "../../../assets/imagenes/icono_switch_poe.png";
import iconoBalanza from "../../../assets/imagenes/icono_control_balanza.png";
import iconoCamara from "../../../assets/imagenes/icono_camara_survision.png";
import iconoLetrero from "../../../assets/imagenes/icono_cartel_LED.png";
import iconoUps from "../../../assets/imagenes/icono_ups.png";
import iconoSensor from "../../../assets/imagenes/icono_sensor_IR.png";

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
      return <img src={iconoBalanza} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
    case "camara":
      return <img src={iconoCamara} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
    case "letrero-led":
      return <img src={iconoLetrero} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
    case "sensor":
      return <img src={iconoSensor} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
    case "switch":
      return <img src={iconoSwitch} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
    case "ups":
      return <img src={iconoUps} alt="Switch" className="h-[34px] w-[34px] object-contain" />;
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
