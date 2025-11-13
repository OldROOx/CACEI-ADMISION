import React, { useState } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { DEPARTAMENTOS_DOCENTES, CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación de opciones

// Define la URL base para usar el proxy de Vite (resuelve a http://localhost:3000/api)
const API_BASE_URL = '/api';

const RegistrarTutor = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // Estado inicial de los datos del formulario (alineados con la API)
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellidos: '',
        Correo: '',
        Telefono: '',
        CedulaProfesional: '',
        Especialidad: '',
        Departamento: '',
        AniosExperiencia: 0,
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
            Nombre: '',
            Apellidos: '',
            Correo: '',
            Telefono: '',
            CedulaProfesional: '',
            Especialidad: '',
            Departamento: '',
            AniosExperiencia: 0,
            NotasAdicionales: ''
        });
        // Limpiar mensajes después de resetear
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);

        // 1. Validación de campos requeridos (básica)
        if (!formData.Nombre || !formData.Apellidos || !formData.Correo || !formData.Especialidad || !formData.Departamento) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*).');
            setIsLoading(false);
            return;
        }

        try {
            // CAMBIO CLAVE: Usa la ruta relativa con la constante para que el proxy funcione.
            const response = await fetch(`${API_BASE_URL}/docentes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El cuerpo del formulario se envía como JSON a la API
                body: JSON.stringify(formData),
            });

            // Parsear la respuesta (incluye mensajes de éxito o error detallados de la API)
            const data = await response.json();

            if (!response.ok) {
                // Manejo de errores (usa el mensaje de la API si está disponible, si no, uno genérico)
                setErrorMessage(data.message || data.error || `Error al registrar docente. Código: ${response.status}`);
            } else {
                // Registro exitoso
                setSuccessMessage(data.message || 'Docente registrado exitosamente.');
                resetForm();
            }

        } catch (error) {
            console.error('Error en la conexión o la petición:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo y sea accesible.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Registrar Docente"
                subtitle="Registre un nuevo docente para actividades de promoción"
            />

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FormSection title="Información del Docente" icon="🧑‍🏫" subtitle="Complete todos los campos requeridos para registrar al docente">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Nombre(s)" name="Nombre" placeholder="Ingrese el nombre" required={true} value={formData.Nombre} onChange={handleChange} />
                        <FormField label="Apellidos" name="Apellidos" placeholder="Ingrese los apellidos" required={true} value={formData.Apellidos} onChange={handleChange} />
                        <FormField label="Correo Electrónico" name="Correo" placeholder="docente@institucion.edu" type="email" required={true} value={formData.Correo} onChange={handleChange} />
                        <FormField label="Teléfono" name="Telefono" placeholder="(555) 123-4567" type="tel" value={formData.Telefono} onChange={handleChange} />
                        <FormField label="Cédula Profesional" name="CedulaProfesional" placeholder="Número de cédula" value={formData.CedulaProfesional} onChange={handleChange} />

                        {/* USO DE CARRERAS_OFERTADAS */}
                        <FormField label="Especialidad" name="Especialidad" placeholder="Seleccione la especialidad" type="select" required={true} value={formData.Especialidad} onChange={handleChange}>
                            <option value="">-- Seleccione una opción --</option>
                            {CARRERAS_OFERTADAS.map(carrera => (
                                <option key={carrera} value={carrera}>{carrera}</option>
                            ))}
                        </FormField>

                        {/* USO DE DEPARTAMENTOS_DOCENTES */}
                        <FormField label="Departamento" name="Departamento" placeholder="Seleccione el departamento" type="select" required={true} value={formData.Departamento} onChange={handleChange}>
                            <option value="">-- Seleccione una opción --</option>
                            {DEPARTAMENTOS_DOCENTES.map(depto => (
                                <option key={depto} value={depto}>{depto}</option>
                            ))}
                        </FormField>

                        <FormField label="Años de Experiencia" name="AniosExperiencia" placeholder="Años de experiencia docente" type="number" value={formData.AniosExperiencia} onChange={handleChange} />
                    </div>
                </FormSection>

                <FormSection title="Notas Adicionales">
                    <FormField type="textarea" name="NotasAdicionales" placeholder="Información adicional sobre el docente" value={formData.NotasAdicionales} onChange={handleChange} />
                </FormSection>

                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500 mb-4">
                        Los campos marcados con (*) son obligatorios. La información será utilizada para asignar actividades de promoción.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={resetForm} disabled={isLoading}>
                            Limpiar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit" disabled={isLoading}>
                            {isLoading ? 'Registrando...' : 'Registrar Docente'}
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrarTutor;