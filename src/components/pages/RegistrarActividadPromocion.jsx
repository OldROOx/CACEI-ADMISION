import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación de opciones

// Define la URL base para usar el proxy de Vite
const API_BASE_URL = '/api';

const RegistrarActividadPromocion = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // Estado inicial de los datos del formulario (alineados con la API)
    const [formData, setFormData] = useState({
        NombreActividad: '',
        Tipo: 'Promoción General',
        Fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        DocenteID: '', // ID del Docente seleccionado
        PreparatoriaID: '', // ID de la Preparatoria seleccionada (null si es digital)
        EstudiantesAlcanzados: 0,
        CarrerasPromovidas: [], // Array de carreras seleccionadas
        Observaciones: ''
    });

    // Estados de la interfaz de usuario y datos dinámicos
    const [docentes, setDocentes] = useState([]); // Ahora cargados de la API
    const [preparatorias, setPreparatorias] = useState([]); // Ahora cargadas de la API
    const [isLoading, setIsLoading] = useState(true); // Inicialmente cargando los catálogos
    const [isSubmitting, setIsSubmitting] = useState(false); // Para el envío del formulario
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE CATÁLOGOS AL MONTAR EL COMPONENTE ---
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [docentesRes, preparatoriasRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/docentes`), // Ruta para Docentes
                    fetch(`${API_BASE_URL}/preparatorias`) // Ruta para Preparatorias
                ]);

                if (docentesRes.ok) {
                    const data = await docentesRes.json();
                    setDocentes(data);
                }

                if (preparatoriasRes.ok) {
                    const data = await preparatoriasRes.json();
                    setPreparatorias(data);
                }

            } catch (error) {
                console.error('Error cargando catálogos:', error);
                setErrorMessage('No se pudieron cargar los datos de Docentes o Preparatorias desde la API.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatalogs();
    }, []);


    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;

        if (name === 'CarrerasPromovidas' && type === 'select-multiple') {
            const values = Array.from(selectedOptions).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: values
            }));
        } else {
            // Convierte el valor a número si el campo es EstudiantesAlcanzados
            const finalValue = name === 'EstudiantesAlcanzados' ? parseInt(value, 10) : value;

            setFormData(prev => ({
                ...prev,
                [name]: finalValue
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            NombreActividad: '',
            Tipo: 'Promoción General',
            Fecha: new Date().toISOString().split('T')[0],
            DocenteID: '',
            PreparatoriaID: '',
            EstudiantesAlcanzados: 0,
            CarrerasPromovidas: [],
            Observaciones: ''
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
        if (!formData.NombreActividad || !formData.DocenteID || formData.EstudiantesAlcanzados <= 0 || formData.CarrerasPromovidas.length === 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*) y asegúrese de que el número de estudiantes sea mayor a 0.');
            return;
        }

        setIsSubmitting(true);

        try {
            // El API espera una estructura que incluya los IDs y la lista de carreras
            const dataToSend = {
                nombre: formData.NombreActividad,
                tipo: formData.Tipo,
                fecha: formData.Fecha,
                docenteId: formData.DocenteID,
                preparatoriaId: formData.PreparatoriaID,
                estudiantesAlcanzados: formData.EstudiantesAlcanzados,
                carrerasPromovidas: formData.CarrerasPromovidas,
                observaciones: formData.Observaciones,
            };

            const response = await fetch(`${API_BASE_URL}/actividades`, { // POST a /api/actividades
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Manejo de errores detallados de la API
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Actividad "${formData.NombreActividad}" registrada exitosamente.`);
                resetForm();
            }

        } catch (error) {
            console.error('Error de conexión al enviar actividad:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filtrar preparatorias para excluir la opción de Promoción Digital (si la hubiera, este formulario es para presencial)
    const filteredPreparatorias = preparatorias.filter(p => p.id !== null);
    const disableForm = isLoading || isSubmitting;


    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Registrar Actividad de Promoción (General)"
                subtitle="Capture los detalles de una visita presencial a preparatoria."
            />

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Cargando catálogos de Docentes y Preparatorias...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormSection title="Detalles de la Actividad" icon="📝" subtitle="Información básica sobre la actividad realizada">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Nombre/Título de la Actividad" name="NombreActividad" placeholder="Ej: Visita al CBTIS 145" required={true} value={formData.NombreActividad} onChange={handleChange} disabled={disableForm} />

                            <FormField label="Tipo de Actividad" name="Tipo" type="select" required={true} value={formData.Tipo} onChange={handleChange} disabled={true}>
                                {/* Valor fijo para este formulario específico */}
                                <option value="Promoción General">Promoción General (Presencial)</option>
                            </FormField>

                            <FormField label="Fecha de Realización" name="Fecha" type="date" required={true} value={formData.Fecha} onChange={handleChange} disabled={disableForm} />

                            {/* Selector de Docentes (DocenteID) */}
                            <FormField label="Docente Responsable" name="DocenteID" type="select" required={true} value={formData.DocenteID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione un docente (*) --</option>
                                {docentes.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.Nombre} {docente.Apellidos} ({docente.Especialidad})
                                    </option>
                                ))}
                                {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                            </FormField>

                            {/* Selector de Preparatorias (PreparatoriaID) */}
                            <FormField label="Preparatoria Visitada" name="PreparatoriaID" type="select" required={true} value={formData.PreparatoriaID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una preparatoria (*) --</option>
                                {filteredPreparatorias.map(prep => (
                                    <option key={prep.id} value={prep.id}>
                                        {prep.Nombre} ({prep.CCT || 'N/A'})
                                    </option>
                                ))}
                                {filteredPreparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                            </FormField>

                            <FormField label="Estudiantes Alcanzados" name="EstudiantesAlcanzados" placeholder="Número de estudiantes en la sesión" type="number" required={true} value={formData.EstudiantesAlcanzados} onChange={handleChange} disabled={disableForm} min="1" />

                        </div>
                    </FormSection>

                    <FormSection title="Detalles de Promoción" icon="🎓" subtitle="Carreras y observaciones del evento">
                        {/* Selector Múltiple de Carreras */}
                        <FormField label="Carreras Promovidas" name="CarrerasPromovidas" type="select-multiple" required={true} value={formData.CarrerasPromovidas} onChange={handleChange} size="4" disabled={disableForm}>
                            {CARRERAS_OFERTADAS.map(carrera => (
                                <option key={carrera} value={carrera}>{carrera}</option>
                            ))}
                        </FormField>

                        <FormField type="textarea" label="Observaciones" name="Observaciones" placeholder="Detalles de la interacción, preguntas frecuentes, etc." value={formData.Observaciones} onChange={handleChange} disabled={disableForm} />
                    </FormSection>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm || isSubmitting}>
                                Limpiar
                            </SecondaryButtonComponent>
                            <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting}>
                                {isSubmitting ? 'Guardando Actividad...' : 'Registrar Actividad'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrarActividadPromocion;