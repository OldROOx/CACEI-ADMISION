import React, { useState, useEffect } from 'react';
import { FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras';

const API_BASE_URL = '/api';

const EditarEstudiante = ({ estudiante, PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    const [formData, setFormData] = useState({
        Nombre: '',
        Apellidos: '',
        Matricula: '',
        Correo: '',
        Telefono: '',
        PrepID: '',
        CarreraInteres: '',
        Municipio: '',
        EsAceptado: 'false',
        Notas: ''
    });

    const [preparatorias, setPreparatorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPreparatorias = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/preparatorias`);
                if (response.ok) {
                    const data = await response.json();
                    setPreparatorias(data);
                }
            } catch (error) {
                console.error('Error cargando preparatorias:', error);
                setErrorMessage('No se pudo cargar el catálogo de preparatorias.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreparatorias();
    }, []);

    // Cargar datos del estudiante cuando el componente se monta
    useEffect(() => {
        if (estudiante) {
            setFormData({
                Nombre: estudiante.Nombre || '',
                Apellidos: estudiante.Apellidos || '',
                Matricula: estudiante.Matricula || '',
                Correo: estudiante.Correo || '',
                Telefono: estudiante.Telefono || '',
                PrepID: estudiante.PrepID ? String(estudiante.PrepID) : '',
                CarreraInteres: estudiante.CarreraInteres || '',
                Municipio: estudiante.Municipio || '',
                EsAceptado: estudiante.EsAceptado ? 'true' : 'false',
                Notas: estudiante.Notas || ''
            });
        }
    }, [estudiante]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validación solo de campos REALMENTE obligatorios
        if (!formData.Nombre || !formData.Apellidos || !formData.Correo) {
            setErrorMessage('Por favor, complete todos los campos obligatorios: Nombre, Apellidos y Correo.');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.Correo)) {
            setErrorMessage('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        setIsSubmitting(true);

        try {
            const dataToSend = {
                Nombre: formData.Nombre,
                Apellidos: formData.Apellidos,
                Matricula: formData.Matricula || null,
                Correo: formData.Correo,
                Telefono: formData.Telefono || null,
                PrepID: formData.PrepID ? parseInt(formData.PrepID) : null,
                CarreraInteres: formData.CarreraInteres || null,
                Municipio: formData.Municipio || null,
                EsAceptado: formData.EsAceptado === 'true',
                Notas: formData.Notas || null,
            };

            const response = await fetch(`${API_BASE_URL}/estudiantes/${estudiante.EstudianteID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al actualizar estudiante. Código: ${response.status}`);
                setIsSubmitting(false);
            } else {
                // ✅ Mostrar mensaje de éxito
                setSuccessMessage(`✓ Estudiante ${formData.Nombre} ${formData.Apellidos} actualizado exitosamente`);

                // ✅ Cerrar el modal después de 1.5 segundos
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess();
                    }
                }, 1500);
            }

        } catch (error) {
            console.error('Error de conexión al actualizar estudiante:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
            setIsSubmitting(false);
        }
    };

    const disableForm = isLoading || isSubmitting;

    if (!estudiante) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <p className="text-center text-gray-500">No se ha seleccionado ningún estudiante.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Editar Estudiante"
                subtitle={`Modificar información de: ${estudiante.Nombre} ${estudiante.Apellidos}`}
            />

            {/* Notificación de éxito con animación */}
            {successMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-green-100 text-green-700 border-l-4 border-green-500 flex items-center animate-pulse">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{successMessage}</span>
                </div>
            )}

            {/* Notificación de error */}
            {errorMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700 border-l-4 border-red-500 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{errorMessage}</span>
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Cargando catálogo de Preparatorias...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormSection title="Información Personal" icon="👤">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre(s) *
                                </label>
                                <input
                                    type="text"
                                    name="Nombre"
                                    placeholder="Ingrese el nombre"
                                    value={formData.Nombre}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Apellidos *
                                </label>
                                <input
                                    type="text"
                                    name="Apellidos"
                                    placeholder="Ingrese los apellidos"
                                    value={formData.Apellidos}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Matrícula
                                </label>
                                <input
                                    type="text"
                                    name="Matricula"
                                    placeholder="Matrícula (opcional)"
                                    value={formData.Matricula}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="Correo"
                                    placeholder="estudiante@ejemplo.com"
                                    value={formData.Correo}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="Telefono"
                                    placeholder="(555) 123-4567"
                                    value={formData.Telefono}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Municipio
                                </label>
                                <input
                                    type="text"
                                    name="Municipio"
                                    placeholder="Ej: Tuxtla Gutiérrez"
                                    value={formData.Municipio}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Información Académica" icon="🎓">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Preparatoria de Procedencia
                                </label>
                                <select
                                    name="PrepID"
                                    value={formData.PrepID}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="">-- Seleccione una preparatoria --</option>
                                    {preparatorias.map(prep => (
                                        <option key={prep.PrepID} value={prep.PrepID}>
                                            {prep.Nombre} ({prep.Clave || 'N/A'})
                                        </option>
                                    ))}
                                    {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Carrera de Interés
                                </label>
                                <select
                                    name="CarreraInteres"
                                    value={formData.CarreraInteres}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="">-- Seleccione una carrera --</option>
                                    {CARRERAS_OFERTADAS.map(carrera => (
                                        <option key={carrera} value={carrera}>{carrera}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Estatus de Aceptación
                                </label>
                                <select
                                    name="EsAceptado"
                                    value={formData.EsAceptado}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="false">Prospecto/Preinscrito</option>
                                    <option value="true">Aceptado (Matriculado)</option>
                                </select>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Notas Adicionales">
                        <textarea
                            name="Notas"
                            rows="3"
                            placeholder="Comentarios sobre el estudiante, proceso de admisión, etc."
                            value={formData.Notas}
                            onChange={handleChange}
                            disabled={disableForm}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        />
                    </FormSection>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            {onSuccess && (
                                <SecondaryButtonComponent
                                    type="button"
                                    onClick={onSuccess}
                                    disabled={disableForm}
                                >
                                    Cancelar
                                </SecondaryButtonComponent>
                            )}
                            <PrimaryButtonComponent
                                type="submit"
                                disabled={disableForm || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando cambios...
                                    </>
                                ) : (
                                    '💾 Guardar Cambios'
                                )}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditarEstudiante;