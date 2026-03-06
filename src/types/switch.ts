export enum PuertoEstado {
    UP = "UP",
    DOWN = "DOWN"
}

export enum AnilloEstado {
    HEALTHY = "Saludable",
    FAULT = "Falla"
}

export interface PuertoData {
    id: number;
    etiqueta: string;
    estado: PuertoEstado;
    esPoe: boolean;
    porWatts?: number;
    anchoBandaRxMbps: number;
    anchoBandaTxMbps: number;
    ratioError: number;
}

export interface SwitchEstado {
    // Información de Sistema
    conectado: boolean;
    horaInicio: string;     // Formato hh:mm:ss
    usoCpu: number;         // Porcentaje 0-100
    temperatura: number;

    // Energía Redundante
    pwr1Activo: boolean;    // Fuente principal CA
    pwr2Activo: boolean;    // Fuente DC redundante

    // Redundancia de Red
    modoRecundancia: "0-Ring" | "RSTP" | "None";
    anilloEstado: AnilloEstado;

    // Puertos
    puertosTotales: number;
    cuentaPuertosActivos: number;
    puertos: PuertoData[];

    // erroras Globales
    erroraGlobal: boolean;
}