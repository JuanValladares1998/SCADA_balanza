import React from "react";

interface ModalProps {
    visible: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ visible, title, onClose, children }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold leading-none p-2"
                    aria-label="Cerrar"
                >
                    &times;
                </button>
                {title && <h2 className="text-xl font-semibold mb-4 pr-8 border-b pb-2">{title}</h2>}
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
