// src/components/pages/RegistrarActividadPromocionDigital.jsx

import React from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';

const RegistrarActividadPromocionDigital = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Actividad de Promoción Digital enviado.");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Registrar Actividad de Promoción Digital"
                subtitle="Registre una nueva actividad de promoción realizada"
            />

            <form onSubmit={handleSubmit}>

                {/* ... (Secciones 1-4 sin cambios) ... */}

                {/* 1. SECCIÓN: INFORMACIÓN DE LA ACTIVIDAD */}
                <FormSection title="Información de la Actividad" icon="📋" subtitle="Complete todos los campos requeridos para registrar la actividad">
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Docente Responsable" placeholder="Seleccione el docente" type="select" required={true} />
                        <FormField label="Proyectos Presentados" placeholder="Ej: Ingeniería en Sistemas Computacionales" type="text" required={true} />

                        <FormField label="Fecha de Promoción" placeholder="dd/mm/aaaa" type="date" required={true} />
                        <FormField label="Hora de Inicio" placeholder="--:--" type="time" required={true} />
                        <FormField label="Duración" placeholder="Duración" type="text" required={true} />

                        <div className="col-span-2">
                            <FormField label="Número de Estudiantes Alcanzados" placeholder="Ej: 45" type="number" required={true} />
                        </div>
                    </div>
                </FormSection>

                {/* 2. CARRERAS PROMOVIDAS */}
                <FormSection title="Carreras Promovidas" subtitle="Liste las carreras que se promovieron durante la actividad.">
                    <FormField label="" placeholder="Liste las carreras que se promovieron durante la actividad." />
                </FormSection>

                {/* 3. MATERIAL UTILIZADO */}
                <FormSection title="Material Utilizado" subtitle="Describa el material didáctico, tecnológico o de apoyo utilizado">
                    <div className="flex items-end space-x-4">
                        <input type="text" placeholder="Descripción del material" className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm p-2" />
                        <button type="button" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm flex-shrink-0">
                            <span className="mr-1">☁️</span> Subir Material Utilizado
                        </button>
                    </div>
                </FormSection>

                {/* 4. OBSERVACIONES Y RESULTADOS (Textarea) */}
                <FormSection title="Observaciones y Resultados" subtitle="Describa los resultados obtenidos, reacciones de los estudiantes, etc.">
                    <FormField label="" placeholder="Escriba aquí sus observaciones..." type="textarea" />
                </FormSection>

                {/* 5. EVIDENCIAS (Opcional - File Input) --- MODIFICADA --- */}
                <FormSection title="Evidencias (Opcional)" subtitle="Suba fotografías, listas de asistencia, o documentos relacionados con la actividad (PDF, Excel, JPG, PNG)">
                    <input
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                        accept=".pdf,.xls,.xlsx,image/png,image/jpeg"
                    />
                </FormSection>

                {/* Footer de formulario (sin cambios) */}
                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-red-500 mb-4">
                        Los campos marcados con (*) son obligatorios. Esta información será utilizada para generar reportes de efectividad de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={() => console.log('Cancelar')}>
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit">
                            Registrar Promoción
                        </PrimaryButtonComponent>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default RegistrarActividadPromocionDigital;