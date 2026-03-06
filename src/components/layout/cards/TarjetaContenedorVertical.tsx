import type { ReactNode } from "react";

type PropiedadesTarjetaContenedorVertical = {
  titulo: string;
  children: ReactNode;
  className?: string;
  icono: React.ReactNode;
};

function TarjetaContenedorVertical({
  titulo,
  children,
  className = "col-span-3",
  icono
}: PropiedadesTarjetaContenedorVertical) {
  return (
    <article className={`${className} scada-card shadow-sm p-4 flex flex-col overflow-hidden`}>
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-3 flex justify-between">{titulo}{icono}</h2>

      <div className="flex-1 overflow-y-auto scada-scroll pr-1 flex flex-col gap-2">
        {children}
      </div>
    </article>
  );
}

export default TarjetaContenedorVertical;
