import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';

const API_BASE_URL = '/api';

const SubirEvidencia = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    // --- ESTADOS DE LA APLICACIÓN ---
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- ESTADOS DE DATA DE LA API ---
    const [clasesDisponibles, setClasesDisponibles] = useState([]);
    const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);

    // --- ESTADO DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        EstudianteID: '',
        ClaseID: '',
        Tipo: 'Tarea',
        Comentarios: ''
    });
    const [evidenciaFile, setEvidenciaFile] = useState(null);

    // --- LÓGICA DE CARGA DE CATÁLOGOS ---
    useEffect(() => {
        const fetchCatalogs = async () => {
            setLoading(true);
            try {
                // Obtener Estudiantes y Clases para selects
                const [estudiantesRes, clasesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/estudiantes`),
                    fetch(`${API_BASE_URL}/clases`)
                ]);

                if (estudiantesRes.ok) {
                    const data = await estudiantesRes.json();
                    setEstudiantesDisponibles(data);
                }

                if (clasesRes.ok) {
                    const data = await clasesRes.json();
                    // Mapear para el select
                    const mappedClases = data
                        .map(c => ({
                            id: c.id,
                            display: `${c.nombre || c.materia || 'Clase sin nombre'} (${new Date(c.fecha || Date.now()).toLocaleDateString()})`,
                            // Aseguramos que los IDs de docente estén disponibles
                            docenteId: c.docenteId || c.DocenteID
                        }));
                    setClasesDisponibles(mappedClases);
                }

            } catch (error) {
                console.error('Error cargando catálogos:', error);
                setErrorMessage('No se pudieron cargar los catálogos de Estudiantes o Clases.');
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);


    // --- MANEJADORES DE ESTADO ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setEvidenciaFile(e.target.files[0] || null);
    };

    const resetForm = () => {
        setFormData({
            EstudianteID: '',
            ClaseID: '',
            Tipo: 'Tarea',
            Comentarios: ''
        });
        setEvidenciaFile(null);
        setSuccessMessage('');
        setErrorMessage('');
        // Limpiar el input de archivo
        const fileInput = document.querySelector('input[name="archivoEvidencia"]');
        if (fileInput) fileInput.value = '';
    };

    // --- LÓGICA DE ENVÍO DE DATOS (Multipart Form Data) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // 1. Validación de campos requeridos
        if (!formData.EstudianteID || !formData.ClaseID || !evidenciaFile) {
            setErrorMessage('Por favor, seleccione el estudiante, la clase y suba un archivo de evidencia (*).');
            return;
        }

        setIsSubmitting(true);

        // Crear FormData para incluir el archivo
        const formPayload = new FormData();

        // Obtenemos el docente ID de la clase seleccionada
        const claseSeleccionada = clasesDisponibles.find(c => c.id === formData.ClaseID);

        // Mapeo de campos del formulario
        formPayload.append('estudianteId', formData.EstudianteID);
        formPayload.append('claseId', formData.ClaseID);
        formPayload.append('docenteId', claseSeleccionada.docenteId); // Necesario para la API
        formPayload.append('tipo', formData.Tipo);
        formPayload.append('comentarios', formData.Comentarios);

        // Añadir el archivo
        // El nombre de campo "evidencia" es el que debe coincidir con el backend Multer
        formPayload.append('archivoEvidencia', evidenciaFile, evidenciaFile.name);

        try {
            // POST a /api/evidencias
            const response = await fetch(`${API_BASE_URL}/evidencias`, {
                method: 'POST',
                // NO incluir Content-Type, FormData lo maneja automáticamente
                body: formPayload,
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al subir evidencia. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Evidencia subida exitosamente para la clase.`);
                // Notifica al padre (ClasesCurso.jsx) para que recargue la lista
                setTimeout(onSuccess, 1500);
            }

        } catch (error) {
            console.error('Error de conexión al enviar evidencia:', error);
            setErrorMessage('Error de conexión con el servidor. Asegúrese de que la API esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const disableForm = isLoading || isSubmitting;

    // Mensajes comunes para ambas fases
    const renderMessages = () => (
        (successMessage || errorMessage) && (
            <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {successMessage || errorMessage}
            </div>
        )
    );

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Subir Evidencia de Nivelación"
                subtitle="Adjunte archivos de tarea, examen o proyecto de un estudiante."
            />

            {renderMessages()}

            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Cargando catálogos de Clases y Estudiantes...</div>
            ) : (
                <form onSubmit={handleSubmit}>

                    {/* 1. SECCIÓN: INFORMACIÓN DE LA EVIDENCIA */}
                    <FormSection title="Asignación y Tipo" icon="📎">
                        <div className="grid grid-cols-1 gap-6">

                            {/* Selector de Estudiantes */}
                            <FormField label="Estudiante" name="EstudianteID" type="select" required={true} value={formData.EstudianteID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione un estudiante (*) --</option>
                                {estudiantesDisponibles.map(est => (
                                    <option key={est.id} value={est.id}>
                                        {est.Nombre} {est.Apellidos} ({est.Matricula || 'N/A'})
                                    </option>
                                ))}
                            </FormField>

                            {/* Selector de Clases */}
                            <FormField label="Clase de Nivelación" name="ClaseID" type="select" required={true} value={formData.ClaseID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una clase programada (*) --</option>
                                {clasesDisponibles.map(clase => (
                                    <option key={clase.id} value={clase.id}>
                                        {clase.display}
                                    </option>
                                ))}
                            </FormField>

                            <FormField label="Tipo de Evidencia" name="Tipo" type="select" required={true} value={formData.Tipo} onChange={handleChange} disabled={disableForm}>
                                <option value="Tarea">Tarea</option>
                                <option value="Examen">Examen</option>
                                <option value="Proyecto">Proyecto</option>
                                <option value="Otro">Otro</option>
                            </FormField>
                        </div>
                    </FormSection>

                    {/* 2. SECCIÓN: ARCHIVO */}
                    <FormSection title="Archivo a Subir" icon="⬆️" subtitle="Seleccione el archivo (PDF, Imagen, etc.).">
                        <input
                            type="file"
                            name="archivoEvidencia"
                            onChange={handleFileChange}
                            disabled={disableForm}
                            required={false} // El required se maneja en el handleSubmit para mejor UX
                            className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                            accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                        />
                        <p className="text-xs text-gray-500 mt-2">Máximo 1 archivo. Este campo es obligatorio.</p>
                    </FormSection>

                    {/* 3. SECCIÓN: COMENTARIOS */}
                    <FormSection title="Comentarios (Opcional)" icon="💬">
                        <FormField
                            type="textarea"
                            name="Comentarios"
                            placeholder="Notas sobre el contenido de la evidencia, observaciones de revisión, etc."
                            value={formData.Comentarios}
                            onChange={handleChange}
                            disabled={disableForm}
                        />
                    </FormSection>


                    {/* Footer del formulario */}
                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm || isSubmitting}>
                                Limpiar
                            </SecondaryButtonComponent>
                            <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting || !formData.ClaseID || !formData.EstudianteID || !evidenciaFile}>
                                {isSubmitting ? 'Subiendo...' : 'Subir Evidencia'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SubirEvidencia;