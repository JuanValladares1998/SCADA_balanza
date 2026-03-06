export enum EstadoAlineamiento {
    OPTIMO = 'OK',
    ATENUADO = 'Atenuado',
    DESALINEADO = 'Desalineado'
}

export interface Sensor {
    id: string;                                 // Ejem: "IR_ENTRADA_FRONT", "IR_SALIDA_REAR"
    etiqueta: string;                           // Descripción para el operador

    // Detección Principal
    interrumpido: boolean;                      // Estado de detección (Haces interrumpidos)

    // Seguridad y Diagnóstico
    tapaActiva: boolean;                        // Alerta de sabotaje o apertura de tapa
    voltaje: number;                            // Tensión de alimentación (10-30 VDC)
    intensidadSenal: number;                    // Tensión analógica de alineación (Monitor Output)
    estadoAlineamiento: EstadoAlineamiento;

    // Estadísticas (Calculadas por el SCADA o PLC)
    cuentaActivacion: number;
    ratioFalsaerrora: number;                   // Porcentaje calculado

    // Entorno
    temperatura?: number;                       // Opcional, si hay sensor externo
}

/**
 * Representa el estado de posicionamiento en la báscula
 * usando un conjunto de sensores IR.
 */
export interface PosicionamientoVehiculo {
    sensorDelantero: Sensor;
    sensorTrasero: Sensor;
    vehiculoCentrado: boolean; // Lógica: Front && Rear están despejados o según regla de negocio
}