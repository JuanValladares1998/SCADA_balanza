import React from "react";

interface ModalDetalleProps {
    title: string;
    data: Record<string, any> | null;
    visible: boolean;
    onClose: () => void;
}

const ModalDetalle: React.FC<ModalDetalleProps> = ({ title, data, visible, onClose }) => {
    if (!visible || !data) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            {/* Añadimos "relative" al contenedor del modal */}
            <div className="relative bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl">

                {/* Botón de cerrar (Icono X) */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold leading-none p-2"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4 pr-8 border-b pb-2">{title}</h2>

                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="divide-y divide-gray-100">
                        {Object.entries(data).map(([key, value]) => (
                            <li key={key} className="py-2 flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-semibold text-gray-600 text-sm uppercase tracking-wider">{key}</span>
                                <span className="text-gray-900 break-words sm:ml-4 text-right">
                                    {value !== null && value !== undefined ? String(value) : "-"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalle;