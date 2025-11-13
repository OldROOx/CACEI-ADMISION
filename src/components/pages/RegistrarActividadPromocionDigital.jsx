// src/components/pages/RegistrarActividadPromocionDigital.jsx

import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación

const API_BASE_URL = '/api';

const RegistrarActividadPromocionDigital = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // --- ESTADO PARA LA DATA REAL Y CATÁLOGOS ---
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de catálogos
    const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario

    // Estado para datos del formulario
    const [formData, setFormData] = useState({
        NombreActividad: '',
        Fecha: new Date().toISOString().split('T')[0],
        DocenteID: '', // ID del Docente seleccionado
        Plataforma: '',
        URL: '', // Enlace de la evidencia digital
        EstudiantesAlcanzados: '',
        CarrerasPromovidas: [], // Array de carreras seleccionadas
        Observaciones: ''
    });
    const [evidenciaFile, setEvidenciaFile] = useState(null); // Para el input de archivo

    // Estados de mensaje
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    // --- LÓGICA DE CARGA DE CATÁLOGOS AL MONTAR EL COMPONENTE ---
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                // Obtener docentes de /api/docentes
                const docentesRes = await fetch(`${API_BASE_URL}/docentes`);

                if (docentesRes.ok) {
                    const data = await docentesRes.json();
                    setDocentes(data);
                }

            } catch (error) {
                console.error('Error cargando catálogo de Docentes:', error);
                setErrorMessage('No se pudieron cargar los datos de Docentes desde la API.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    // --- MANEJADORES DE ESTADO ---
    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;

        if (name === 'CarrerasPromovidas' && type === 'select-multiple') {
            const values = Array.from(selectedOptions).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: values
            }));
        } else {
            const finalValue = name === 'EstudiantesAlcanzados' ? parseInt(value, 10) : value;

            setFormData(prev => ({
                ...prev,
                [name]: finalValue
            }));
        }
    };

    const handleFileChange = (e) => {
        setEvidenciaFile(e.target.files[0] || null);
    };

    const resetForm = () => {
        setFormData({
            NombreActividad: '',
            Fecha: new Date().toISOString().split('T')[0],
            DocenteID: '',
            Plataforma: '',
            URL: '',
            EstudiantesAlcanzados: '',
            CarrerasPromovidas: [],
            Observaciones: ''
        });
        setEvidenciaFile(null);
        setSuccessMessage('');
        setErrorMessage('');
        // Limpiar el input de archivo
        document.querySelector('input[name="evidencia"]').value = '';
    };

    // --- LÓGICA DE ENVÍO DE DATOS A LA API (Multipart Form Data) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // 1. Validación de campos requeridos
        if (!formData.NombreActividad || !formData.DocenteID || !formData.Plataforma || !formData.URL || !formData.Fecha || formData.EstudiantesAlcanzados <= 0 || formData.CarrerasPromovidas.length === 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*) y asegúrese de que el número de estudiantes sea válido.');
            return;
        }

        setIsSubmitting(true);

        // Crear FormData para enviar datos y archivo
        const formPayload = new FormData();

        // Fijo para Promoción Digital
        formPayload.append('tipo', 'Promoción Digital');

        // Mapeo de campos del formulario
        formPayload.append('nombre', formData.NombreActividad);
        formPayload.append('fecha', formData.Fecha);
        formPayload.append('docenteId', formData.DocenteID);
        formPayload.append('plataforma', formData.Plataforma);
        formPayload.append('url', formData.URL);
        formPayload.append('estudiantesAlcanzados', formData.EstudiantesAlcanzados);

        // Carreras promovidas (el array debe ser stringificado o unido con un delimitador para FormData)
        formPayload.append('carrerasPromovidas', formData.CarrerasPromovidas.join(', '));
        formPayload.append('observaciones', formData.Observaciones);

        // No se envía preparatoriaId, ya que es digital

        // Añadir archivo de evidencia
        if (evidenciaFile) {
            formPayload.append('evidencia', evidenciaFile, evidenciaFile.name);
        }

        try {
            // POST a /api/actividades con multipart/form-data
            const response = await fetch(`${API_BASE_URL}/actividades`, {
                method: 'POST',
                // No es necesario Content-Type, FormData lo maneja automáticamente
                body: formPayload,
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad digital. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || `Actividad digital "${formData.NombreActividad}" registrada exitosamente.`);
                resetForm();
            }

        } catch (error) {
            console.error('Error de conexión al enviar actividad:', error);
            setErrorMessage('Error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const disableForm = isLoading || isSubmitting;


    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <FormHeader
                title="Registrar Actividad de Promoción Digital"
                subtitle="Registre una actividad de promoción realizada en plataformas digitales."
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

                    {/* 1. SECCIÓN: INFORMACIÓN DE LA ACTIVIDAD */}
                    <FormSection title="Información de la Actividad" icon="💻" subtitle="Complete los detalles del evento digital">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <FormField label="Nombre/Título de la Actividad" name="NombreActividad" placeholder="Ej: Webinar sobre Ingeniería" required={true} value={formData.NombreActividad} onChange={handleChange} disabled={disableForm} colSpan="md:col-span-2" />

                            <FormField label="Docente Responsable" name="DocenteID" type="select" required={true} value={formData.DocenteID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione un docente (*) --</option>
                                {docentes.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.Nombre} {docente.Apellidos}
                                    </option>
                                ))}
                                {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                            </FormField>

                            <FormField label="Plataforma Utilizada" name="Plataforma" placeholder="Ej: Zoom, TikTok, YouTube" required={true} value={formData.Plataforma} onChange={handleChange} disabled={disableForm} />

                            <FormField label="Fecha de Realización" name="Fecha" type="date" required={true} value={formData.Fecha} onChange={handleChange} disabled={disableForm} />

                            <FormField label="URL de Evidencia Digital" name="URL" placeholder="Ej: https://link.al.video/o/reporte" required={true} type="url" value={formData.URL} onChange={handleChange} disabled={disableForm} />

                            <div className="col-span-2">
                                <FormField label="Número de Estudiantes Alcanzados" name="EstudiantesAlcanzados" placeholder="Ej: 150" type="number" required={true} value={formData.EstudiantesAlcanzados} onChange={handleChange} disabled={disableForm} min="1" />
                            </div>
                        </div>
                    </FormSection>

                    {/* 2. SECCIÓN: CARRERAS PROMOVIDAS */}
                    <FormSection title="Carreras Promovidas" icon="🎓" subtitle="Seleccione las carreras que fueron objeto de promoción en el evento.">
                        {/* Selector Múltiple de Carreras */}
                        <FormField label="" name="CarrerasPromovidas" type="select-multiple" required={true} value={formData.CarrerasPromovidas} onChange={handleChange} size="4" disabled={disableForm}>
                            {CARRERAS_OFERTADAS.map(carrera => (
                                <option key={carrera} value={carrera}>{carrera}</option>
                            ))}
                        </FormField>
                    </FormSection>

                    {/* 3. OBSERVACIONES Y EVIDENCIAS */}
                    <FormSection title="Observaciones y Evidencias" icon="📝" subtitle="Información adicional y archivo de soporte (si aplica)">
                        <FormField label="Observaciones" name="Observaciones" placeholder="Detalles adicionales sobre la dinámica o los resultados..." type="textarea" value={formData.Observaciones} onChange={handleChange} disabled={disableForm} />

                        {/* 4. EVIDENCIAS (File Input) */}
                        <label className="block text-sm font-medium text-gray-700 mt-4">Archivo de Soporte (Opcional)</label>
                        <input
                            type="file"
                            name="evidencia"
                            onChange={handleFileChange}
                            disabled={disableForm}
                            className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-purple-50 file:text-purple-700
                                        hover:file:bg-purple-100"
                            accept=".pdf,image/png,image/jpeg"
                        />
                    </FormSection>

                    {/* Footer de formulario */}
                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-red-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm || isSubmitting}>
                                Limpiar
                            </SecondaryButtonComponent>
                            <PrimaryButtonComponent type="submit" disabled={disableForm || isSubmitting}>
                                {isSubmitting ? 'Guardando Actividad...' : 'Registrar Actividad Digital'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrarActividadPromocionDigital;