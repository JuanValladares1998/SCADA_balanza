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

export type TipoConexion = "energia" | "senal";

export type DatosNodoPeriferico = {
  nombre: string;
  tipoPeriferico: TipoPeriferico;
};

function obtenerIcono(tipoPeriferico: TipoPeriferico) {
  switch (tipoPeriferico) {
    case "balanza":
      return <img src={iconoBalanza} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    case "camara":
      return <img src={iconoCamara} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    case "letrero-led":
      return <img src={iconoLetrero} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    case "sensor":
      return <img src={iconoSensor} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    case "switch":
      return <img src={iconoSwitch} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    case "ups":
      return <img src={iconoUps} alt="Switch" className="h-[92px] w-[92px] object-contain" />;
    default:
      return null;
  }
}

function NodoPeriferico({ data, selected }: NodeProps<DatosNodoPeriferico>) {
  return (
    <div
      className={`w-32 h-32 scada-card flex flex-col items-center justify-center gap-1 text-center px-2 ${selected ? "ring-2 ring-emerald-400" : ""
        }`}
    >
      <Handle
        id="entrada-energia"
        type="target"
        position={Position.Left}
        className="!top-[28px] !w-3 !h-3 !border-2 !border-amber-700 !bg-amber-400 !rounded-full"
        title="Entrada de energia"
      >
        <span className="sr-only">Entrada de energia</span>
      </Handle>
      <Handle
        id="entrada-senal"
        type="target"
        position={Position.Left}
        className="!top-[52px] !w-3 !h-3 !border-2 !border-sky-700 !bg-sky-400 !rounded-full"
        title="Entrada de senal"
      >
        <span className="sr-only">Entrada de senal</span>
      </Handle>
      <Handle
        id="salida-energia"
        type="source"
        position={Position.Right}
        className="!top-[28px] !w-3 !h-3 !border-2 !border-amber-700 !bg-amber-400 !rounded-full"
        title="Salida de energia"
      >
        <span className="sr-only">Salida de energia</span>
      </Handle>
      <Handle
        id="salida-senal"
        type="source"
        position={Position.Right}
        className="!top-[52px] !w-3 !h-3 !border-2 !border-sky-700 !bg-sky-400 !rounded-full"
        title="Salida de senal"
      >
        <span className="sr-only">Salida de senal</span>
      </Handle>
      <div className="flex items-center justify-center">{obtenerIcono(data.tipoPeriferico)}</div>
      <div className="text-[11px] font-semibold scada-text-primary leading-tight">{data.nombre}</div>
    </div>
  );
}

export default NodoPeriferico;
