import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
// Se asume que PrimaryButtonComponent y SecondaryButtonComponent se pasan como props
// import PrimaryButton from '../atoms/PrimaryButton';
// import SecondaryButton from '../atoms/SecondaryButton';

const API_BASE_URL = '/api';

const TomarAsistencia = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    // --- ESTADOS DE LA APLICACIÓN ---
    const [step, setStep] = useState(1); // 1: Selección de Clase, 2: Registro de Asistencia
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- ESTADOS DE DATA DE LA API ---
    const [clasesDisponibles, setClasesDisponibles] = useState([]);
    const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);
    const [selectedClase, setSelectedClase] = useState(null);

    // --- ESTADO DEL FORMULARIO ---
    const [claseId, setClaseId] = useState('');
    // Almacena la asistencia: { [estudianteId]: true/false }
    const [asistencia, setAsistencia] = useState({});


    // --- FASE 1: CARGA INICIAL DE CLASES PROGRAMADAS ---
    useEffect(() => {
        const fetchClases = async () => {
            setLoading(true);
            try {
                // Obtener clases desde /api/clases
                const response = await fetch(`${API_BASE_URL}/clases`);
                if (response.ok) {
                    const data = await response.json();
                    // Mapear y filtrar clases programadas
                    const programadas = data
                        .map(c => ({
                            id: c.id,
                            Titulo: c.nombre || c.materia || 'Clase sin título',
                            Fecha: new Date(c.fecha).toLocaleDateString() || 'N/A',
                            estado: c.estado || 'Programada',
                            capacidad: c.capacidad || 0,
                            inscritos: c.inscritos || 0,
                            docenteId: c.docenteId || c.DocenteID, // Asegura que el ID del docente esté disponible
                            // Propiedad combinada para el select
                            display: `${c.nombre || c.materia} (${new Date(c.fecha).toLocaleDateString()}) - Cupo: ${c.inscritos || 0}/${c.capacidad || 0}`
                        }))
                        .filter(c => c.estado === 'Programada');

                    setClasesDisponibles(programadas);
                }
            } catch (error) {
                console.error('Error cargando clases:', error);
                setErrorMessage('Error al cargar la lista de clases programadas.');
            } finally {
                setLoading(false);
            }
        };

        fetchClases();
    }, []);

    // --- LÓGICA DE AVANCE DE FASE: CARGAR ESTUDIANTES AL SELECCIONAR CLASE ---
    const handleNextStep = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (!claseId) {
            setErrorMessage('Debe seleccionar una clase.');
            setLoading(false);
            return;
        }

        const claseEncontrada = clasesDisponibles.find(c => c.id === claseId);
        if (!claseEncontrada) {
            setErrorMessage('Clase no encontrada.');
            setLoading(false);
            return;
        }

        try {
            // Asume endpoint /api/clases/:id/estudiantes para obtener inscritos
            const response = await fetch(`${API_BASE_URL}/clases/${claseId}/estudiantes`);
            if (!response.ok) {
                // Si el endpoint no existe o falla, asumimos que devuelve un error o lista vacía
                if (response.status === 404) {
                    throw new Error('Endpoint de estudiantes no disponible. Asistencia no puede ser registrada.');
                }
                throw new Error('Error al obtener la lista de estudiantes inscritos.');
            }
            const data = await response.json();

            setEstudiantesInscritos(data);

            // Inicializar la asistencia a 'Presente' (true) por defecto
            const initialAsistencia = data.reduce((acc, estudiante) => {
                acc[estudiante.id] = true;
                return acc;
            }, {});

            setAsistencia(initialAsistencia);
            setSelectedClase(claseEncontrada);
            setStep(2); // Avanzar a la fase de registro

        } catch (error) {
            console.error('Error cargando estudiantes:', error);
            setErrorMessage(error.message || 'No se pudieron cargar los estudiantes para esta clase.');
        } finally {
            setLoading(false);
        }
    };

    // --- FASE 2: MANEJO DE ASISTENCIA Y ENVÍO ---
    const handleToggleAsistencia = (estudianteId) => {
        setAsistencia(prev => ({
            ...prev,
            [estudianteId]: !prev[estudianteId]
        }));
    };

    const handleRegistroAsistencia = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsSubmitting(true);

        // Obtener solo los IDs de los estudiantes presentes
        const presentes = Object.keys(asistencia).filter(id => asistencia[id]);

        if (presentes.length === 0) {
            setErrorMessage('Debe haber al menos un estudiante presente para registrar la asistencia.');
            setIsSubmitting(false);
            return;
        }

        const dataToSend = {
            claseId: selectedClase.id,
            fechaRegistro: new Date().toISOString().split('T')[0], // Fecha de hoy
            docenteId: selectedClase.docenteId,
            estudiantesPresentes: presentes, // Lista de IDs de presentes
        };

        try {
            // POST a /api/asistencia
            const response = await fetch(`${API_BASE_URL}/asistencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar asistencia. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Asistencia para "${selectedClase.Titulo}" registrada exitosamente.`);
                // Notifica al componente padre y cierra el modal
                setTimeout(onSuccess, 1500); // Dar tiempo para ver el mensaje
            }

        } catch (error) {
            console.error('Error de conexión al enviar asistencia:', error);
            setErrorMessage('Error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDERIZADO DE FASES ---

    // Mensajes comunes para ambas fases
    const renderMessages = () => (
        (successMessage || errorMessage) && (
            <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {successMessage || errorMessage}
            </div>
        )
    );

    const disableForm = isLoading || isSubmitting;

    const renderFase1 = () => (
        <form onSubmit={handleNextStep}>
            <FormHeader
                title="Tomar Asistencia (Fase 1: Clase)"
                subtitle="Seleccione la clase programada para registrar su asistencia."
            />
            {renderMessages()}

            <FormSection title="Clase Programada" icon="📖">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando clases...</p>
                ) : (
                    <FormField
                        label="Clase Programada"
                        name="ClaseID"
                        type="select"
                        required={true}
                        value={claseId}
                        onChange={(e) => setClaseId(e.target.value)}
                        disabled={disableForm}
                    >
                        <option value="">-- Seleccione una clase programada (*) --</option>
                        {clasesDisponibles.map(clase => (
                            <option key={clase.id} value={clase.id}>
                                {clase.display}
                            </option>
                        ))}
                        {clasesDisponibles.length === 0 && <option value="" disabled>No hay clases programadas disponibles</option>}
                    </FormField>
                )}
            </FormSection>

            <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
                <SecondaryButtonComponent type="button" onClick={onSuccess} disabled={disableForm}>
                    Cerrar
                </SecondaryButtonComponent>
                <PrimaryButtonComponent type="submit" disabled={disableForm || !claseId || clasesDisponibles.length === 0}>
                    {loading ? 'Cargando...' : 'Continuar al Registro'}
                </PrimaryButtonComponent>
            </div>
        </form>
    );

    const renderFase2 = () => (
        <form onSubmit={handleRegistroAsistencia}>
            <FormHeader
                title="Tomar Asistencia (Fase 2: Estudiantes)"
                subtitle={`Clase: ${selectedClase?.Titulo} (${selectedClase?.Fecha})`}
            />
            {renderMessages()}

            <FormSection title="Lista de Estudiantes Inscritos" icon="🧑‍🎓" subtitle="Marque los estudiantes presentes y envíe el registro.">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando lista de estudiantes...</p>
                ) : estudiantesInscritos.length === 0 ? (
                    <p className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm">
                        Esta clase no tiene estudiantes inscritos. No se puede tomar asistencia.
                    </p>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {estudiantesInscritos.map(estudiante => (
                            <div key={estudiante.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-800">
                                    {estudiante.Nombre} {estudiante.Apellidos}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleToggleAsistencia(estudiante.id)}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-150 ${
                                        asistencia[estudiante.id]
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                                    }`}
                                >
                                    {asistencia[estudiante.id] ? 'PRESENTE' : 'AUSENTE'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </FormSection>

            <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
                <SecondaryButtonComponent type="button" onClick={() => setStep(1)} disabled={disableForm || isSubmitting}>
                    Volver a Clases
                </SecondaryButtonComponent>
                <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting || estudiantesInscritos.length === 0}>
                    {isSubmitting ? 'Guardando Asistencia...' : 'Registrar Asistencia'}
                </PrimaryButtonComponent>
            </div>
        </form>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            {step === 1 ? renderFase1() : renderFase2()}
        </div>
    );
};

export default TomarAsistencia;