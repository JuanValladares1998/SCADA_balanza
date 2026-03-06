
// Función de ayuda para formatear
export const formatearFechaParaInput = (fecha: Date): string => {
    // Ajustamos a la zona horaria local para que el ISO no se desfase
    const offset = fecha.getTimezoneOffset() * 60000;
    const localISOTime = new Date(fecha.getTime() - offset).toISOString();
    // Retornamos solo hasta los minutos: YYYY-MM-DDTHH:mm
    return localISOTime.slice(0, 16);
};