export enum CamaraModo {
    DAY = 'Día',
    NIGHT = 'Noche'
}

export interface LprEvento {
    plate: string;
    fiabilidad: number;             // 0-100%
    tiempoProcesamientoMs: number;  // Típicamente ~20ms
    timestamp: string;
    placaUrl?: string;              // Link a la captura de la placa
}

export interface CamaraEstado {
    // Conectividad y Disponibilidad
    conectado: boolean;
    tiempoInicio: number;
    numeroReinicio: number;
    horasAcumuladas: number;

    // Energía y Hardware
    fuentePoder: "PoE" | "24V" | "Backup" | "Dual";
    consumoEnergia: number;         // Consumo en Vatios
    temperatura: number;
    modoActual: CamaraModo;
    fps: number;                    // Frames por segundo analizados

    // KPIs de Inteligencia Artificial (Rendimiento LPR)
    cuentaPlacasDetectadas: number;
    ratioRespuestasExitosas: number; // % Índice de lectura
    ratioErrores: number;           // % No lecturas

    // Alertas
    ultimoEvento?: LprEvento;
    alertasInternas: string[];    // Códigos de error de Survision
}