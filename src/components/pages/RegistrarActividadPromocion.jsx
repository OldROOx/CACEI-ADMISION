import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación del catálogo local

const API_BASE_URL = '/api'; // Usamos el proxy configurado en vite.config.js

const RegistrarActividadPromocion = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    // Estado inicial de los datos del formulario (alineados con la API)
    const [formData, setFormData] = useState({
        // ELIMINADO: NombreActividad
        Tipo: 'Promoción General',
        Fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        DocenteID: '', // ID del Docente seleccionado
        PreparatoriaID: '', // ID de la Preparatoria seleccionada
        EstudiantesAlcanzados: 1, // VALOR INICIAL DEFENSIVO
        CarrerasPromovidas: [], // Array de carreras seleccionadas
        Observaciones: ''
    });

    // Estados de datos dinámicos y UI
    const [docentes, setDocentes] = useState([]);
    const [preparatorias, setPreparatorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE CATÁLOGOS AL MONTAR EL COMPONENTE ---
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [docentesRes, preparatoriasRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/docentes`), //
                    fetch(`${API_BASE_URL}/preparatorias`) //
                ]);

                if (docentesRes.ok) {
                    setDocentes(await docentesRes.json());
                }

                if (preparatoriasRes.ok) {
                    setPreparatorias(await preparatoriasRes.json());
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
        } else if (name === 'EstudiantesAlcanzados') {
            // Se asegura que el valor sea un número (0 si está vacío o es inválido)
            const numValue = (value === '' || isNaN(parseInt(value, 10))) ? 0 : parseInt(value, 10);
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            Tipo: 'Promoción General',
            Fecha: new Date().toISOString().split('T')[0],
            DocenteID: '',
            PreparatoriaID: '',
            EstudiantesAlcanzados: 1, // Reset a 1
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

        // --- VALIDACIÓN EXPLÍCITA Y GRANULAR (SIN EL CAMPO NOMBRE) ---

        if (formData.DocenteID === '') {
            setErrorMessage('Debe seleccionar un "Docente Responsable" (*).');
            return;
        }

        if (formData.PreparatoriaID === '') {
            setErrorMessage('Debe seleccionar una "Preparatoria Visitada" (*).');
            return;
        }

        if (formData.CarrerasPromovidas.length === 0) {
            setErrorMessage('Debe seleccionar al menos una "Carrera Promovida" (*).');
            return;
        }

        if (formData.EstudiantesAlcanzados <= 0) {
            setErrorMessage('El número de estudiantes alcanzados debe ser mayor a 0.');
            return;
        }
        // --- FIN DE LA VALIDACIÓN ---

        setIsSubmitting(true);

        try {
            // Mapeo al formato RESTful de la API (usando los nombres de campos de tu controlador)
            const dataToSend = {
                // Enviamos un nombre por defecto ya que el campo de texto fue eliminado del formulario
                NombreActividad: 'Actividad de Promoción Registrada',
                Tipo: formData.Tipo,
                Fecha: formData.Fecha,
                DocenteID: formData.DocenteID,
                PreparatoriaID: formData.PreparatoriaID,
                EstudiantesAlcanzados: formData.EstudiantesAlcanzados,
                CarrerasPromovidas: formData.CarrerasPromovidas.join(','),
                Observaciones: formData.Observaciones,
            };

            const response = await fetch(`${API_BASE_URL}/actividades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Actividad registrada exitosamente.`);
                resetForm();
                // Cerrar el modal después de un breve retraso
                setTimeout(onSuccess, 1500);
            }

        } catch (error) {
            console.error('Error de conexión al enviar actividad:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            {/* CAMPO DE NOMBRE/TÍTULO ELIMINADO */}

                            <FormField label="Tipo de Actividad" name="Tipo" type="select" required={true} value={formData.Tipo} onChange={handleChange} disabled={true}>
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
                                {preparatorias.map(prep => (
                                    <option key={prep.id} value={prep.id}>
                                        {prep.Nombre} ({prep.CCT || 'N/A'})
                                    </option>
                                ))}
                                {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
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
                            {/* Botón "Limpiar" */}
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm}>
                                Limpiar
                            </SecondaryButtonComponent>
                            {/* Botón "Cerrar" (llama a onSuccess) */}
                            <SecondaryButtonComponent type="button" onClick={onSuccess} disabled={disableForm}>
                                Cerrar
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