// src/components/pages/RegistrarActividadPrepInvitada.jsx

import React from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';

const RegistrarActividadPrepInvitada = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Actividad de Preparatoria Invitada enviado.");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Registrar Actividad de Promoción (Preparatoria Invitada)"
                subtitle="Registre una nueva actividad de promoción realizada"
            />

            <form onSubmit={handleSubmit}>

                {/* 1. SECCIÓN: INFORMACIÓN DE LA ACTIVIDAD */}
                <FormSection title="Información de la Actividad" icon="📋" subtitle="Complete todos los campos requeridos para registrar la actividad">
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Docente Responsable" placeholder="Seleccione el docente" type="select" required={true} />
                        <FormField label="Preparatoria Invitada" placeholder="Nombre de la preparatoria" type="text" required={true} />

                        <FormField label="Fecha de la Actividad" placeholder="dd/mm/aaaa" type="date" required={true} />
                        <FormField label="Hora de Inicio" placeholder="--:--" type="time" required={true} />
                        <FormField label="Duración" placeholder="Duración" type="text" required={true} />

                        <div className="col-span-2">
                            <FormField label="Número de Estudiantes Presentes" placeholder="Ej: 45" type="number" required={true} />
                        </div>
                    </div>
                </FormSection>

                {/* 2. SECCIÓN: CARRERAS PROMOVIDAS */}
                <FormSection title="Carreras Promovidas" subtitle="Liste las carreras que se promovieron durante la actividad.">
                    <FormField label="" placeholder="Liste las carreras que se promovieron durante la actividad." />
                </FormSection>

                {/* 3. OBSERVACIONES Y RESULTADOS (Textarea) */}
                <FormSection title="Observaciones y Resultados" subtitle="Describa los resultados obtenidos, reacciones de los estudiantes, etc.">
                    <FormField label="" placeholder="Escriba aquí sus observaciones..." type="textarea" />
                </FormSection>

                {/* 4. EVIDENCIAS (Opcional - File Input) */}
                <FormSection title="Evidencias (Opcional)" subtitle="Suba fotografías, listas de asistencia, o documentos relacionados con la actividad">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-800">Seleccionar archivo</span> Ningún archivo seleccionado
                    </p>
                    <button type="button" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm flex-shrink-0">
                        <span className="mr-1">☁️</span> Subir Material Utilizado
                    </button>
                </FormSection>

                {/* Footer de formulario - FIX ESLINT: Uso explícito de los componentes */}
                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-red-500 mb-4">
                        Los campos marcados con (*) son obligatorios. Esta información será utilizada para generar reportes de efectividad de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={() => console.log('Cancelar')}>
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit">
                            Registrar Recorrido
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrarActividadPrepInvitada;