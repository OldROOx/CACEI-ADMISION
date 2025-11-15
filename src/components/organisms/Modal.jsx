// src/components/organisms/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    // Si el modal no está abierto, no renderiza nada.
    if (!isOpen) {
        return null;
    }

    // Maneja el clic en el fondo para cerrar el modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        // CAMBIO: Usamos bg-white bg-opacity-10. Esto deja la página de dashboard casi totalmente visible.
        <div
            className="fixed inset-0 bg-white bg-opacity-10 z-50 flex justify-center items-start p-4 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            {/* Contenedor del contenido del modal */}
            {/* my-10: Añade margen vertical para que el contenido no se pegue a los bordes */}
            <div className="bg-transparent rounded-xl max-w-4xl w-full my-10">
                {children}
            </div>
        </div>
    );
};

export default Modal;