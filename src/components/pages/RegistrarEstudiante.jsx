import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación del catálogo local de carreras

const API_BASE_URL = '/api';

const RegistrarEstudiante = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // Estado inicial de los datos del formulario (alineados con la API)
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellidos: '',
        Matricula: '',
        Correo: '',
        Telefono: '',
        PreparatoriaID: '', // ID de la preparatoria de procedencia (viene de API)
        CarreraInteres: '', // Carrera de interés (viene del catálogo local)
        EsAceptado: 'false', // Si ya tiene estatus de aceptado
        NotasAdicionales: ''
    });

    // Estados de datos dinámicos y UI
    const [preparatorias, setPreparatorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de catálogos
    const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE CATÁLOGOS (PREPARATORIAS) ---
    useEffect(() => {
        const fetchPreparatorias = async () => {
            try {
                // Obtener preparatorias de /api/preparatorias
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
            Matricula: '',
            Correo: '',
            Telefono: '',
            PreparatoriaID: '',
            CarreraInteres: '',
            EsAceptado: 'false',
            NotasAdicionales: ''
        });
        setSuccessMessage('');
        setErrorMessage('');
    };

    // --- LÓGICA DE ENVÍO DE DATOS A LA API ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // 1. Validación de campos requeridos
        if (!formData.Nombre || !formData.Apellidos || !formData.Correo || !formData.PreparatoriaID || !formData.CarreraInteres) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*).');
            return;
        }

        setIsSubmitting(true);

        try {
            // Mapeo al formato esperado por la API (/api/estudiantes)
            const dataToSend = {
                nombre: formData.Nombre,
                apellidos: formData.Apellidos,
                matricula: formData.Matricula,
                correo: formData.Correo,
                telefono: formData.Telefono,
                preparatoriaId: formData.PreparatoriaID,
                carreraInteres: formData.CarreraInteres,
                esAceptado: formData.EsAceptado === 'true', // Convierte el string a booleano
                notas: formData.NotasAdicionales,
            };

            // POST a /api/estudiantes
            const response = await fetch(`${API_BASE_URL}/estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar estudiante. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Estudiante ${formData.Nombre} registrado exitosamente.`);
                resetForm();
            }

        } catch (error) {
            console.error('Error de conexión al registrar estudiante:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const disableForm = isLoading || isSubmitting;


    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Registrar Estudiante"
                subtitle="Capture los datos de un estudiante de nuevo ingreso o prospecto"
            />

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Cargando catálogo de Preparatorias...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormSection title="Información Personal" icon="👤">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Nombre(s)" name="Nombre" placeholder="Ingrese el nombre" required={true} value={formData.Nombre} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Apellidos" name="Apellidos" placeholder="Ingrese los apellidos" required={true} value={formData.Apellidos} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Matrícula" name="Matricula" placeholder="Matrícula (opcional)" value={formData.Matricula} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Correo Electrónico" name="Correo" placeholder="estudiante@ejemplo.com" type="email" required={true} value={formData.Correo} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Teléfono" name="Telefono" placeholder="(555) 123-4567" type="tel" value={formData.Telefono} onChange={handleChange} disabled={disableForm} />

                            {/* Selector de Preparatorias */}
                            <FormField label="Preparatoria de Procedencia" name="PreparatoriaID" type="select" required={true} value={formData.PreparatoriaID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una preparatoria (*) --</option>
                                {preparatorias.map(prep => (
                                    <option key={prep.id} value={prep.id}>
                                        {prep.Nombre} ({prep.CCT || 'N/A'})
                                    </option>
                                ))}
                                {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Información de Admisión" icon="🎓">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Selector de Carrera de Interés */}
                            <FormField label="Carrera de Interés" name="CarreraInteres" type="select" required={true} value={formData.CarreraInteres} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una carrera (*) --</option>
                                {CARRERAS_OFERTADAS.map(carrera => (
                                    <option key={carrera} value={carrera}>{carrera}</option>
                                ))}
                            </FormField>

                            <FormField label="Estatus de Aceptación" name="EsAceptado" type="select" required={true} value={formData.EsAceptado} onChange={handleChange} disabled={disableForm}>
                                <option value="false">Prospecto/Preinscrito</option>
                                <option value="true">Aceptado (Matriculado)</option>
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Notas Adicionales">
                        <FormField type="textarea" name="NotasAdicionales" placeholder="Comentarios sobre el estudiante, proceso de admisión, etc." value={formData.NotasAdicionales} onChange={handleChange} disabled={disableForm} />
                    </FormSection>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm}>
                                Limpiar
                            </SecondaryButtonComponent>
                            <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting}>
                                {isSubmitting ? 'Registrando...' : 'Registrar Estudiante'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrarEstudiante;