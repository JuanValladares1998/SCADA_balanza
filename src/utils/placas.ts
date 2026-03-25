export const formatearPlaca = (placa: string): string => {
    if (!placa) return "-";
    const limpia = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (limpia.length <= 3) {
        return limpia;
    } else if (limpia.length <= 5) {
        return `${limpia.slice(0, 2)}-${limpia.slice(3)}`;
    } else {
        return `${limpia.slice(0, 3)}-${limpia.slice(3)}`;
    }
}