// src/components/pages/RegistrarPreparatoria.jsx

import React, { useState } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { TIPOS_PREPARATORIA } from '../../data/Carreras'; // Importación

const API_BASE_URL = '/api';

const RegistrarPreparatoria = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // Estado inicial de los datos del formulario
    const [formData, setFormData] = useState({
        NombreInstitucion: '',
        ClaveInstitucion: '',
        TipoInstitucion: '',
        Direccion: '',
        Ciudad: '',
        Estado: '',
        CodigoPostal: '',
        Telefono: '',
        CorreoElectronico: '',
        Director: '',
        CoordinadorVinculacion: '',
        NotasAdicionales: ''
    });

    // Estados de la interfaz de usuario
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            NombreInstitucion: '',
            ClaveInstitucion: '',
            TipoInstitucion: '',
            Direccion: '',
            Ciudad: '',
            Estado: '',
            CodigoPostal: '',
            Telefono: '',
            CorreoElectronico: '',
            Director: '',
            CoordinadorVinculacion: '',
            NotasAdicionales: ''
        });
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);

        // 1. Validación de campos requeridos
        if (!formData.NombreInstitucion || !formData.TipoInstitucion || !formData.Direccion || !formData.Ciudad || !formData.Estado) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*).');
            setIsLoading(false);
            return;
        }

        // Mapeo de datos al formato esperado por el API (se asume minúsculas o camelCase en la API)
        const dataToSend = {
            nombre: formData.NombreInstitucion,
            cct: formData.ClaveInstitucion,
            tipo: formData.TipoInstitucion,
            direccion: formData.Direccion,
            ciudad: formData.Ciudad,
            estado: formData.Estado,
            cp: formData.CodigoPostal,
            telefono: formData.Telefono,
            correo: formData.CorreoElectronico,
            director: formData.Director,
            coordinadorVinculacion: formData.CoordinadorVinculacion,
            notas: formData.NotasAdicionales
        };

        try {
            // POST a /api/preparatorias
            const response = await fetch(`${API_BASE_URL}/preparatorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Manejo de errores específicos de la API
                setErrorMessage(responseData.message || responseData.error || `Error al registrar preparatoria. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Preparatoria "${formData.NombreInstitucion}" registrada exitosamente.`);
                resetForm();
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsLoading(false);
        }
    };

    const disableForm = isLoading;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Registrar Preparatoria"
                subtitle="Agregue una nueva preparatoria al catálogo de instituciones"
            />

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* 1. SECCIÓN: INFORMACIÓN DE LA PREPARATORIA */}
                <FormSection title="Información de la Preparatoria" icon="🏫" subtitle="Complete todos los campos requeridos para registrar la preparatoria">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Nombre de la Institución" name="NombreInstitucion" placeholder="Ej: CBTIS No. 45" required={true} value={formData.NombreInstitucion} onChange={handleChange} disabled={disableForm} />
                        <FormField label="Clave de la Institución (CCT)" name="ClaveInstitucion" placeholder="Ej: 14DCTO045K" value={formData.ClaveInstitucion} onChange={handleChange} disabled={disableForm} />

                        {/* USO DEL CATÁLOGO TIPOS_PREPARATORIA */}
                        <FormField label="Tipo de Institución" name="TipoInstitucion" type="select" required={true} colSpan="md:col-span-2" value={formData.TipoInstitucion} onChange={handleChange} disabled={disableForm}>
                            <option value="">-- Seleccione una opción (*) --</option>
                            {TIPOS_PREPARATORIA.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </FormField>

                    </div>
                </FormSection>

                {/* 2. SECCIÓN: INFORMACIÓN DE UBICACIÓN */}
                <FormSection title="Información de Ubicación" icon="📍">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Dirección" name="Direccion" placeholder="Calle, número, colonia" required={true} colSpan="md:col-span-2" value={formData.Direccion} onChange={handleChange} disabled={disableForm} />
                        <FormField label="Ciudad" name="Ciudad" placeholder="Ciudad" required={true} value={formData.Ciudad} onChange={handleChange} disabled={disableForm} />

                        {/* DEBEMOS ASUMIR UN CATÁLOGO O USAR HARDCODED PARA ESTADOS */}
                        <FormField label="Estado" name="Estado" placeholder="Seleccione el estado" type="select" required={true} value={formData.Estado} onChange={handleChange} disabled={disableForm}>
                            <option value="">-- Seleccione un estado (*) --</option>
                            <option>Chiapas</option>
                            <option>Oaxaca</option>
                            <option>Tabasco</option>
                            <option>Veracruz</option>
                            {/* Puedes expandir esta lista si es necesario */}
                        </FormField>
                        <FormField label="Código Postal" name="CodigoPostal" placeholder="12345" type="number" value={formData.CodigoPostal} onChange={handleChange} disabled={disableForm} />
                    </div>
                </FormSection>

                {/* 3. SECCIÓN: INFORMACIÓN DE CONTACTO */}
                <FormSection title="Información de Contacto" icon="📞">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Teléfono" name="Telefono" placeholder="(555) 123-4567" type="tel" value={formData.Telefono} onChange={handleChange} disabled={disableForm} />
                        <FormField label="Correo Electrónico" name="CorreoElectronico" placeholder="contacto@preparatoria.edu.mx" type="email" value={formData.CorreoElectronico} onChange={handleChange} disabled={disableForm} />
                        <FormField label="Director(a)" name="Director" placeholder="Nombre del director" value={formData.Director} onChange={handleChange} disabled={disableForm} />
                        <FormField label="Coordinador de Vinculación" name="CoordinadorVinculacion" placeholder="Nombre del coordinador" value={formData.CoordinadorVinculacion} onChange={handleChange} disabled={disableForm} />
                    </div>
                </FormSection>

                {/* 4. SECCIÓN: NOTAS ADICIONALES */}
                <FormSection title="Notas Adicionales" icon="📝">
                    <FormField
                        type="textarea"
                        name="NotasAdicionales"
                        label=""
                        placeholder="Información adicional sobre la preparatoria..."
                        value={formData.NotasAdicionales}
                        onChange={handleChange}
                        disabled={disableForm}
                    />
                </FormSection>

                {/* Footer del formulario */}
                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500 mb-4">
                        Los campos marcados con (*) son obligatorios. Esta información será utilizada para programar visitas de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm}>
                            Limpiar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit" disabled={disableForm || isLoading}>
                            {isLoading ? 'Registrando...' : 'Registrar Preparatoria'}
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrarPreparatoria;