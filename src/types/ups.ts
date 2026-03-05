export enum UpsModo {
    ONLINE = "En línea",
    BATTERY = "En batería",
    BYPASS = "Bypass",
    FAULT = "Falla"
}

export enum BateriaEstado {
    NORMAL = "Normal",
    LOW = "Baja",
    DEPLETED = "Agotada"
}

export interface UpsEstado {
    // Operación General
    modo: UpsModo;
    porcentajeCarga: number; // 0-100%
    autonomiaMinutos: number;
    temperaturaInterna: number;

    // Entrada (Red Eléctrica)
    voltajeEntrada: number;
    frecuenciaEntrada: number;

    // Salida (Hacia la Balanza/PC)
    voltajeSalida: number;
    frecuenciaSalida: number;

    // Batería
    nivelBateria: number; // SoC (0-100%)
    estadoBateria: BateriaEstado;

    // Alertas Digitales
    sobrecargaAlarma: boolean;
    falloInterno: boolean;
}

export interface UpsEvento {
    id: string,
    timestamp: string; // ISO Date string
    evento: string; // Ej: "Cambio de Modo", "Alarma de Sobrecarga", etc.
    descripcion: string;
    duracionSegunods?: number; // Opcional, duración del evento si aplica   
}