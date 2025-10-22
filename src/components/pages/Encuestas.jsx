import React from 'react';

const Encuestas = () => {
    // IMPORTANTE: Reemplaza esta URL con el enlace "Embed HTML" de tu propio Google Form.
    // Asegúrate de que la URL termine en `?embedded=true` para una mejor integración.
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe2_S_4_z_2b-c-d_e-f_g_h-i-j_k-l_m-n_o-p_q/viewform?embedded=true";

    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Encuestas</h1>
                <p className="text-gray-500 mt-1">Creación de Encuestas</p>
            </div>

            {/* Contenedor del Iframe */}
            <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <iframe
                    src={googleFormUrl}
                    width="100%"
                    height="600" // Puedes ajustar la altura según tus necesidades
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    title="Google Form Encuesta"
                    style={{ borderRadius: '0.75rem' }} // Coincide con el rounded-xl del contenedor
                >
                    Cargando…
                </iframe>
            </div>
        </div>
    );
};

export default Encuestas;