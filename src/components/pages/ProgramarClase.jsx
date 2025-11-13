import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
// Asumo que tienes los componentes de botón pasados como props o disponibles globalmente
// Importa tus botones si no vienen por props:
// import PrimaryButton from '../atoms/PrimaryButton';
// import SecondaryButton from '../atoms/SecondaryButton';


const API_BASE_URL = '/api';

// Placeholder para las materias de nivelación (ajusta o importa tu catálogo real)
const MATERIAS_NIVELACION = [
    'Matemáticas Básicas',
    'Física Elemental',
    'Habilidades Digitales',
    'Lectura y Redacción',
    'Lógica de Programación'
];


const ProgramarClase = ({ PrimaryButtonComponent, SecondaryButtonComponent, closeModal }) => {

    // Estado inicial de los datos del formulario (alineados con la API)
    const [formData, setFormData] = useState({
        Nombre: '',
        Materia: '', // Titulo de la clase (Ej: Matemáticas Básicas)
        DocenteID: '', // ID del Docente
        FechaInicio: new Date().toISOString().split('T')[0], // Fecha actual
        HoraInicio: '08:00',
        HoraFin: '10:00',
        Capacidad: 25,
        Ubicacion: 'Salón 101 / En línea',
        Notas: ''
    });

    // Estados de datos dinámicos y UI
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de catálogos
    const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE CATÁLOGOS (DOCENTES) ---
    useEffect(() => {
        const fetchDocentes = async () => {
            try {
                // Obtener docentes de /api/docentes
                const response = await fetch(`${API_BASE_URL}/docentes`);
                if (response.ok) {
                    const data = await response.json();
                    setDocentes(data);
                }
            } catch (error) {
                console.error('Error cargando docentes:', error);
                setErrorMessage('No se pudo cargar el catálogo de docentes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocentes();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'Capacidad' ? parseInt(value, 10) : value
        }));
    };

    const resetForm = () => {
        setFormData({
            Nombre: '',
            Materia: '',
            DocenteID: '',
            FechaInicio: new Date().toISOString().split('T')[0],
            HoraInicio: '08:00',
            HoraFin: '10:00',
            Capacidad: 25,
            Ubicacion: 'Salón 101 / En línea',
            Notas: ''
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
        if (!formData.Nombre || !formData.Materia || !formData.DocenteID || !formData.FechaInicio || formData.Capacidad <= 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*).');
            return;
        }

        setIsSubmitting(true);

        try {
            // Mapeo al formato esperado por la API (/api/clases)
            const dataToSend = {
                nombre: formData.Nombre,
                materia: formData.Materia,
                docenteId: formData.DocenteID,
                fecha: formData.FechaInicio,
                horaInicio: formData.HoraInicio,
                horaFin: formData.HoraFin,
                capacidad: formData.Capacidad,
                ubicacion: formData.Ubicacion,
                notas: formData.Notas,
                estado: 'Programada' // Estado inicial
            };

            // POST a /api/clases
            const response = await fetch(`${API_BASE_URL}/clases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al programar la clase. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Clase de "${formData.Nombre}" programada exitosamente.`);
                resetForm();
                // Opcional: Llamar a una función de actualización si se pasa como prop
                // if (onSuccess) onSuccess();
            }

        } catch (error) {
            console.error('Error de conexión al programar clase:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const disableForm = isLoading || isSubmitting;


    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Programar Nueva Clase de Nivelación"
                subtitle="Defina los parámetros para una nueva sesión de inducción/nivelación."
            />

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Cargando catálogo de Docentes...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormSection title="Detalles de la Clase" icon="📚">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <FormField label="Título de la Clase" name="Nombre" placeholder="Ej: Introducción a Cálculo" required={true} value={formData.Nombre} onChange={handleChange} disabled={disableForm} colSpan="md:col-span-2" />

                            <FormField label="Materia" name="Materia" type="select" required={true} value={formData.Materia} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una materia (*) --</option>
                                {MATERIAS_NIVELACION.map(materia => (
                                    <option key={materia} value={materia}>{materia}</option>
                                ))}
                            </FormField>

                            {/* Docente Responsable (DocenteID) */}
                            <FormField label="Docente Asignado" name="DocenteID" type="select" required={true} value={formData.DocenteID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione un docente (*) --</option>
                                {docentes.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.Nombre} {docente.Apellidos}
                                    </option>
                                ))}
                                {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                            </FormField>

                            <FormField label="Fecha" name="FechaInicio" type="date" required={true} value={formData.FechaInicio} onChange={handleChange} disabled={disableForm} />

                            <FormField label="Hora de Inicio" name="HoraInicio" placeholder="Ej: 08:00" type="time" required={true} value={formData.HoraInicio} onChange={handleChange} disabled={disableForm} />

                            <FormField label="Hora de Finalización" name="HoraFin" placeholder="Ej: 10:00" type="time" required={true} value={formData.HoraFin} onChange={handleChange} disabled={disableForm} />

                            <FormField label="Capacidad de Estudiantes" name="Capacidad" placeholder="Máximo de alumnos" type="number" required={true} value={formData.Capacidad} onChange={handleChange} disabled={disableForm} min="1" />

                            <FormField label="Ubicación / Plataforma" name="Ubicacion" placeholder="Salón B-201 o Zoom/Meet Link" required={true} colSpan="md:col-span-2" value={formData.Ubicacion} onChange={handleChange} disabled={disableForm} />

                            <FormField type="textarea" label="Notas Adicionales" name="Notas" placeholder="Comentarios sobre el material, requisitos especiales, etc." colSpan="md:col-span-2" value={formData.Notas} onChange={handleChange} disabled={disableForm} />
                        </div>
                    </FormSection>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            {/* Uso un botón de limpiar para mantener los valores por defecto */}
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm || isSubmitting}>
                                Limpiar
                            </SecondaryButtonComponent>
                            <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting}>
                                {isSubmitting ? 'Programando...' : 'Programar Clase'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProgramarClase;