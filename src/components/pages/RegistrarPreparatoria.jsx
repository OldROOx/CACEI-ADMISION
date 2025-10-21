import React from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';

const RegistrarPreparatoria = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Registrar Preparatoria enviado.");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Registrar Preparatoria"
                subtitle="Agregue una nueva preparatoria al catálogo de instituciones"
            />

            <form onSubmit={handleSubmit}>

                {/* 1. SECCIÓN: INFORMACIÓN DE LA PREPARATORIA */}
                <FormSection title="Información de la Preparatoria" icon="🏫" subtitle="Complete todos los campos requeridos para registrar la preparatoria">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Nombre de la Institución" placeholder="Ej: CBTIS No. 45" required={true} />
                        <FormField label="Clave de la Institución" placeholder="Ej: 14DCTO045K" />
                        <FormField label="Tipo de Institución" placeholder="Seleccione el tipo de institución" type="select" required={true} colSpan="md:col-span-2">
                            <option>Bachillerato General</option>
                            <option>Bachillerato Técnico</option>
                            <option>Telebachillerato</option>
                        </FormField>
                    </div>
                </FormSection>

                {/* 2. SECCIÓN: INFORMACIÓN DE UBICACIÓN */}
                <FormSection title="Información de Ubicación" icon="📍">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Dirección" placeholder="Calle, número, colonia" required={true} colSpan="md:col-span-2" />
                        <FormField label="Ciudad" placeholder="Ciudad" required={true} />
                        <FormField label="Estado" placeholder="Seleccione el estado" type="select" required={true}>
                            <option>Chiapas</option>
                            <option>Oaxaca</option>
                            <option>Tabasco</option>
                            <option>Veracruz</option>
                        </FormField>
                        <FormField label="Código Postal" placeholder="12345" type="number" />
                    </div>
                </FormSection>

                {/* 3. SECCIÓN: INFORMACIÓN DE CONTACTO */}
                <FormSection title="Información de Contacto" icon="📞">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Teléfono" placeholder="(555) 123-4567" type="tel" />
                        <FormField label="Correo Electrónico" placeholder="contacto@preparatoria.edu.mx" type="email" />
                        <FormField label="Director(a)" placeholder="Nombre del director" />
                        <FormField label="Coordinador de Vinculación" placeholder="Nombre del coordinador" />
                    </div>
                </FormSection>

                {/* 4. SECCIÓN: NOTAS ADICIONALES */}
                <FormSection title="Notas Adicionales" icon="📝">
                    <FormField
                        label=""
                        placeholder="Información adicional sobre la preparatoria..."
                        type="textarea"
                    />
                </FormSection>

                {/* Footer del formulario */}
                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500 mb-4">
                        Los campos marcados con (*) son obligatorios. Esta información será utilizada para programar visitas de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={() => console.log('Cancelar')}>
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit">
                            Registrar Preparatoria
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrarPreparatoria;