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
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Contenedor del contenido del modal */}
            <div className="bg-transparent rounded-xl max-w-4xl w-full">
                {/* Aquí se renderizará el formulario que pasemos */}
                {children}
            </div>
        </div>
    );
};

export default Modal;