import TarjetaAlertas from "../components/layout/cards/TarjetaAlertas";
import TarjetaGraficoAlertas from "../components/layout/cards/TarjetaGraficoAlertas";
import TarjetaResumenAlertas from "../components/layout/cards/TarjetaResumenAlertas";
import type { Estado } from "../types/Estado";

type AlertaSistema = {
    id: number;
    estado: Estado;
    titulo: string;
    descripcion: string;
    hora: string;
    atendida: boolean;
};

type PuntoGraficoAlerta = {
    etiqueta: string;
    total: number;
};

const horasBase = [
    "08:00:00",
    "08:15:00",
    "08:30:00",
    "08:45:00",
    "09:00:00",
    "09:15:00",
    "09:30:00",
    "09:45:00",
    "10:00:00",
    "10:15:00",
    "10:30:00",
    "10:45:00",
    "11:00:00",
    "11:15:00",
    "11:30:00",
    "11:45:00",
    "12:00:00",
    "12:15:00",
    "12:30:00",
    "12:45:00",
];

function crearAlertas(estado: Estado, titulos: string[], descripciones: string[], idInicial: number): AlertaSistema[] {
    return Array.from({ length: 20 }, (_, indice) => ({
        id: idInicial + indice,
        estado,
        titulo: titulos[indice % titulos.length],
        descripcion: descripciones[indice % descripciones.length],
        hora: `2026-03-21T${horasBase[indice]}`,
        atendida: indice % 3 !== 0,
    }));
}

function crearDatosGrafico(base: number, variacion: number): PuntoGraficoAlerta[] {
    return horasBase.map((hora, indice) => ({
        etiqueta: hora.slice(0, 5),
        total: base + (indice % 5) + Math.floor(indice / variacion),
    }));
}

function crearAcumuladoPorTipo(alertas: AlertaSistema[]) {
    const acumulado = new Map<string, { tipo: string; total: number; color: string }>();

    alertas.forEach((alerta) => {
        const existente = acumulado.get(alerta.titulo);
        const color = alerta.estado === "ok" ? "#10b981" : alerta.estado === "alerta" ? "#f59e0b" : "#dc6b74";

        if (existente) {
            existente.total += 1;
            return;
        }

        acumulado.set(alerta.titulo, {
            tipo: alerta.titulo,
            total: 1,
            color,
        });
    });

    return Array.from(acumulado.values()).sort((a, b) => b.total - a.total || a.tipo.localeCompare(b.tipo));
}

function PaginaNivel1() {
    const alertasOk = crearAlertas(
        "ok",
        [
            "Sistema OK",
            "Comunicacion estable",
            "Calibracion validada",
            "Pesaje sincronizado",
            "Lectura de sensores correcta",
            "UPS en rango nominal",
        ],
        [
            "Operacion estable y sin incidencias.",
            "Los enlaces de red operan sin perdida.",
            "La balanza principal mantiene tolerancia correcta.",
            "El flujo de pesaje se encuentra sincronizado.",
            "Todos los sensores reportan dentro del margen esperado.",
            "La alimentacion de respaldo se mantiene estable.",
        ],
        1,
    );

    const alertasAlerta = crearAlertas(
        "alerta",
        [
            "Sistema en alerta",
            "Latencia elevada",
            "Carga UPS en observacion",
            "Variacion en pesaje",
            "Camara con baja luz",
            "Temperatura elevada",
        ],
        [
            "Se detecto una condicion que requiere revision.",
            "La camara de patio responde por encima del umbral.",
            "La UPS de cabina opera con bateria reducida.",
            "La balanza presenta oscilacion moderada.",
            "La imagen pierde nitidez en condiciones actuales.",
            "El gabinete supera el nivel recomendado.",
        ],
        101,
    );

    const alertasError = crearAlertas(
        "error",
        [
            "Sistema en error",
            "Sensor desconectado",
            "Perdida de video",
            "Switch sin enlace",
            "UPS en falla",
            "PLC sin respuesta",
        ],
        [
            "Hay una falla activa que afecta la operacion.",
            "El sensor lateral derecho no reporta telemetria.",
            "La camara de salida quedo sin transmision.",
            "El equipo de red dejo de reportar enlace fisico.",
            "La unidad de respaldo entro en condicion de falla.",
            "No se obtiene respuesta del controlador principal.",
        ],
        201,
    );

    const graficoOk = crearDatosGrafico(4, 4);
    const graficoAlerta = crearDatosGrafico(2, 5);
    const graficoError = crearDatosGrafico(1, 6);
    const todasLasAlertas = [...alertasError, ...alertasAlerta, ...alertasOk];
    const alertasAtendidas = todasLasAlertas.filter((alerta) => alerta.atendida).length;
    const alertasPendientes = todasLasAlertas.length - alertasAtendidas;
    const acumuladoPorTipo = crearAcumuladoPorTipo(alertasError);

    return (
        <main className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4">
            <header className="mb-2 flex shrink-0 items-center justify-between">
                <h1 className="text-2xl font-bold scada-text-primary tracking-tight">
                    Control de Pesaje
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm scada-text-secondary">
                        Estado del Sistema: <span className="scada-text-ok font-bold">ONLINE</span>
                    </div>
                </div>
            </header>

            <section className="grid min-h-0 flex-1 grid-cols-2 auto-rows-fr gap-4">
                <div className="grid min-h-0 grid-cols-2 gap-4">
                    <TarjetaAlertas titulo="Layouts Errores" alertas={alertasError} />
                    <TarjetaGraficoAlertas titulo="Gráfico Errores" estado="error" datos={graficoError} />
                </div>
                <TarjetaResumenAlertas
                    atendidas={alertasAtendidas}
                    pendientes={alertasPendientes}
                    acumuladoPorTipo={acumuladoPorTipo}
                />
                <div className="grid min-h-0 grid-cols-2 gap-4">
                    <TarjetaAlertas titulo="Layouts Alertas" alertas={alertasAlerta} />
                    <TarjetaGraficoAlertas titulo="Gráfico Alertas" estado="alerta" datos={graficoAlerta} />
                </div>
                <div className="grid min-h-0 grid-cols-2 gap-4">
                    <TarjetaAlertas titulo="Layouts Notificaciones" alertas={alertasOk} />
                    <TarjetaGraficoAlertas titulo="Gráfico Notificaciones" estado="ok" datos={graficoOk} />
                </div>
            </section>
        </main>
    );
}

export default PaginaNivel1;
