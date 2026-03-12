import type { DragEvent, ReactNode } from "react";

interface BotonItemProps {
  children: ReactNode;
  nombre: string;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
}

function BotonItem({ children, nombre, onDragStart }: BotonItemProps) {
  return (
    <div
      className="scada-chip p-2 text-center text-[10px] scada-text-secondary cursor-grab active:cursor-grabbing"
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
    >
      <div className="mb-1 flex justify-center">{children}</div>
      {nombre}
    </div>
  );
}

export default BotonItem;
