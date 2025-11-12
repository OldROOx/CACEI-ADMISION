// src/components/pages/RegistrarActividadPrepInvitada.jsx

import React from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación

const RegistrarActividadPrepInvitada = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Actividad de Preparatoria Invitada enviado.");
        // TODO: Implementar llamada a la API POST /api/actividades con multipart/form-data
        // Asegúrate de enviar Tipo: 'Invitada' y PrepID.
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
                        {/* Docente Responsable (Asumimos que las opciones vendrán de la API) */}
                        <FormField label="Docente Responsable" placeholder="Seleccione el docente" type="select" required={true}>
                            <option value="">-- Seleccione un docente --</option>
                            {/* TODO: Mapear docentes de la API GET /api/docentes */}
                        </FormField>

                        {/* Preparatoria Invitada (Debe ser un select con PrepID de la API) */}
                        <FormField label="Preparatoria Invitada" placeholder="Seleccione la preparatoria" type="select" required={true}>
                            <option value="">-- Seleccione una preparatoria --</option>
                            {/* TODO: Mapear preparatorias de la API GET /api/preparatorias */}
                        </FormField>

                        {/* PROYECTO/CARRERA PRESENTADA --- USO DE CATÁLOGO --- (Añadido para consistencia) */}
                        <FormField label="Proyecto/Carrera Presentada" placeholder="Seleccione la carrera principal" type="select" required={true} colSpan="col-span-2">
                            <option value="">-- Seleccione una carrera --</option>
                            {CARRERAS_OFERTADAS.map(carrera => (
                                <option key={carrera} value={carrera}>{carrera}</option>
                            ))}
                        </FormField>

                        <FormField label="Fecha de la Actividad" placeholder="dd/mm/aaaa" type="date" required={true} />
                        <FormField label="Hora de Inicio" placeholder="--:--" type="time" required={true} />
                        <FormField label="Duración" placeholder="Duración" type="text" required={true} />

                        <div className="col-span-2">
                            <FormField label="Número de Estudiantes Presentes" placeholder="Ej: 45" type="number" required={true} />
                        </div>
                    </div>
                </FormSection>

                {/* 2. SECCIÓN: CARRERAS PROMOVIDAS (Campo TEXT para la columna CarrerasPromovidas) */}
                <FormSection title="Carreras Promovidas" subtitle="Liste las carreras que se promovieron durante la actividad.">
                    <FormField label="" placeholder="Liste las carreras que se promovieron durante la actividad." type="textarea" />
                </FormSection>

                {/* 3. OBSERVACIONES Y RESULTADOS (Textarea) */}
                <FormSection title="Observaciones y Resultados" subtitle="Describa los resultados obtenidos, reacciones de los estudiantes, etc.">
                    <FormField label="" placeholder="Escriba aquí sus observaciones..." type="textarea" />
                </FormSection>

                {/* 4. EVIDENCIAS (File Input) */}
                <FormSection title="Evidencias (Opcional)" subtitle="Suba fotografías, listas de asistencia, o documentos relacionados con la actividad (PDF, Excel, JPG, PNG)">
                    <input
                        type="file"
                        name="evidencia"
                        className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                        accept=".pdf,.xls,.xlsx,image/png,image/jpeg"
                    />
                </FormSection>

                {/* Footer de formulario */}
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