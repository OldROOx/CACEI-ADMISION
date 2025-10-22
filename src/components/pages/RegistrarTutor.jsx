import React from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';

const RegistrarTutor = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Registrar Tutor/Docente enviado.");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Registrar Docente"
                subtitle="Registre un nuevo docente para actividades de promoción"
            />
            <form onSubmit={handleSubmit}>
                <FormSection title="Información del Docente" icon="🧑‍🏫" subtitle="Complete todos los campos requeridos para registrar al docente">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Nombre(s)" placeholder="Ingrese el nombre" required={true} />
                        <FormField label="Apellidos" placeholder="Ingrese los apellidos" required={true} />
                        <FormField label="Correo Electrónico" placeholder="docente@institucion.edu" type="email" required={true} />
                        <FormField label="Teléfono" placeholder="(555) 123-4567" type="tel" />
                        <FormField label="Cédula Profesional" placeholder="Número de cédula" />
                        <FormField label="Especialidad" placeholder="Seleccione la especialidad" type="select" required={true}>
                            <option>Sistemas Computacionales</option>
                            <option>Mecatrónica</option>
                            <option>Industrial</option>
                        </FormField>
                        <FormField label="Departamento" placeholder="Seleccione el departamento" type="select" required={true}>
                            <option>Ciencias Básicas</option>
                            <option>Ciencias de la Ingeniería</option>
                        </FormField>
                        <FormField label="Años de Experiencia" placeholder="Años de experiencia docente" type="number" />
                    </div>
                </FormSection>

                <FormSection title="Notas Adicionales">
                    <FormField type="textarea" placeholder="Información adicional sobre el docente" />
                </FormSection>

                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500 mb-4">
                        Los campos marcados con (*) son obligatorios. La información será utilizada para asignar actividades de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={() => console.log('Cancelar')}>
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit">
                            Registrar Docente
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrarTutor;