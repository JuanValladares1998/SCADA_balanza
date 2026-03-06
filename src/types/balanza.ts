export type UnidadPeso = 'kg' | 't';

export interface CeldaDiagnostico {
    id: number;
    cargaPorcentaje: number;
    voltajeMV: number; // Milivoltios
    temperaturaInterna: number;
    integra: boolean; // True si el sello hermético está OK
}

export interface BalanzaEstado {
    // Datos Principales
    pesoBruto: number;
    unidad: UnidadPeso;
    esEstable: boolean; // Motion indicator

    // Estados Digitales
    estaEnCero: boolean;
    tieneTara: boolean;
    sobrecargaerrora: boolean;

    // Salud del Sistema
    redPDXSaludable: boolean;
    codigoError?: string; // Si no hay error, es undefined o string vacío
    temperaturaGabinete: number;

    // Detalle por Celdas (Array de objetos)
    celdas: CeldaDiagnostico[];
}

// Ejemplo de respuesta de la API para el estado general
export interface BalanzaApiResponse {
    ultimaActualizacion: string; // ISO Date string
    data: BalanzaEstado;
}