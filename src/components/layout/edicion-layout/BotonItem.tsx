interface BotonItemProps {
    children: React.ReactNode;
    nombre: string;
}

function BotonItem({ children, nombre }: BotonItemProps) {
    return (
        <div className="scada-chip p-2 text-center text-[10px] scada-text-secondary">
            <div className="flex justify-center mb-1">{children}</div>
            {nombre}
        </div>
    );
}

export default BotonItem;