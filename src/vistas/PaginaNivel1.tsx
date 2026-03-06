import TarjetaAlertas from "../components/layout/cards/TarjetaAlertas";
import TarjetaContenedorVertical from "../components/layout/cards/TarjetaContenedorVertical";
import TarjetaMonitoreoGeneral from "../components/layout/cards/TarjetaMonitoreoGeneral";
import BalanzaItem from "../components/layout/edicion-layout/item-perifericos/BalanzaItem";
import CamaraItem from "../components/layout/edicion-layout/item-perifericos/CamaraItem";
import SensorItem from "../components/layout/edicion-layout/item-perifericos/SensorItem";
import SwitchItem from "../components/layout/edicion-layout/item-perifericos/SwitchItem";
import UpsItem from "../components/layout/edicion-layout/item-perifericos/UpsItem";
import type { Estado } from "../types/Estado";

type ElementoMonitoreo = {
    nombre: string;
    valor: string | number;
    estado: Estado;
};

function PaginaNivel1() {
    const balanzas: ElementoMonitoreo[] = [
        { nombre: "Balanza principal", valor: "24,580 kg", estado: "ok" },
        { nombre: "Balanza patio", valor: "18,420 kg", estado: "ok" },
        { nombre: "Balanza secundaria", valor: "Fuera de linea", estado: "alerta" },
        { nombre: "Balanza despacho", valor: "Error lectura", estado: "error" },
    ];

    const camaras: ElementoMonitoreo[] = [
        { nombre: "Camara LPR 1", valor: "Online", estado: "ok" },
        { nombre: "Camara LPR 2", valor: "Online", estado: "ok" },
        { nombre: "Camara patio", valor: "Latencia alta", estado: "alerta" },
        { nombre: "Camara salida", valor: "Sin video", estado: "error" },
    ];

    const sensores: ElementoMonitoreo[] = [
        { nombre: "Sensor IR entrada", valor: "Activo", estado: "ok" },
        { nombre: "Sensor IR salida", valor: "Activo", estado: "ok" },
        { nombre: "Sensor lateral izq.", valor: "Intermitente", estado: "alerta" },
        { nombre: "Sensor lateral der.", valor: "Desconectado", estado: "error" },
    ];

    const switches: ElementoMonitoreo[] = [
        { nombre: "Switch industrial 1", valor: "8/8 puertos", estado: "ok" },
        { nombre: "Switch industrial 2", valor: "7/8 puertos", estado: "alerta" },
        { nombre: "Switch control", valor: "6/8 puertos", estado: "alerta" },
        { nombre: "Switch respaldo", valor: "Sin enlace", estado: "error" },
    ];

    const equiposUps: ElementoMonitoreo[] = [
        { nombre: "UPS balanza", valor: "98%", estado: "ok" },
        { nombre: "UPS red", valor: "76%", estado: "ok" },
        { nombre: "UPS cabina", valor: "42%", estado: "alerta" },
        { nombre: "UPS respaldo", valor: "Bateria baja", estado: "error" },
    ];

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
                </div>
            </header>

            <section className="grid grid-cols-12 grid-rows-[1fr_1fr] gap-4 h-full">
                <TarjetaAlertas
                    alertas={[
                        { id: 1, estado: "error", titulo: "Alerta 1", descripcion: "Sensor de Entrada Desconectado", hora: "08:00 AM" },
                        { id: 2, estado: "alerta", titulo: "Alerta 2", descripcion: "Peso Excede Limite Permitido", hora: "08:05 AM" },
                        { id: 3, estado: "ok", titulo: "Alerta 3", descripcion: "Calibracion Exitosa", hora: "08:10 AM" },
                    ]}
                />

                <TarjetaContenedorVertical titulo="Control Balanza" icono={<BalanzaItem />}>
                    {balanzas.map((balanza) => (
                        <TarjetaMonitoreoGeneral key={balanza.nombre} {...balanza} />
                    ))}
                </TarjetaContenedorVertical>

                <TarjetaContenedorVertical titulo="Control Camaras" icono={<CamaraItem />}>
                    {camaras.map((camara) => (
                        <TarjetaMonitoreoGeneral key={camara.nombre} {...camara} />
                    ))}
                </TarjetaContenedorVertical>

                <TarjetaContenedorVertical titulo="Control Sensores" icono={<SensorItem />}>
                    {sensores.map((sensor) => (
                        <TarjetaMonitoreoGeneral key={sensor.nombre} {...sensor} />
                    ))}
                </TarjetaContenedorVertical>

                <TarjetaContenedorVertical titulo="Control Switch" icono={<SwitchItem />}>
                    {switches.map((switchItem) => (
                        <TarjetaMonitoreoGeneral key={switchItem.nombre} {...switchItem} />
                    ))}
                </TarjetaContenedorVertical>

                <TarjetaContenedorVertical titulo="Control UPS" icono={<UpsItem/>}>
                    {equiposUps.map((ups) => (
                        <TarjetaMonitoreoGeneral key={ups.nombre} {...ups} />
                    ))}
                </TarjetaContenedorVertical>
            </section>
        </main>
    );
}

export default PaginaNivel1;
