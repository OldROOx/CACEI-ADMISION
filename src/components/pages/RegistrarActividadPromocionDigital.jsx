import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras';

const API_BASE_URL = '/api';

const RegistrarActividadPromocionDigital = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    const [formData, setFormData] = useState({
        NombreActividad: '',
        Fecha: new Date().toISOString().split('T')[0],
        DocenteID: '',
        Plataforma: '',
        URL: '',
        EstudiantesAlcanzados: '',
        CarrerasPromovidas: [],
        Observaciones: ''
    });

    const [evidenciaFiles, setEvidenciaFiles] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
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

    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;

        if (name === 'CarrerasPromovidas' && type === 'select-multiple') {
            const values = Array.from(selectedOptions).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: values
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            setErrorMessage('Máximo 5 archivos permitidos.');
            e.target.value = '';
            return;
        }
        setEvidenciaFiles(files);
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
        setEvidenciaFiles([]);
        const fileInput = document.querySelector('input[name="evidencias"]');
        if (fileInput) fileInput.value = '';
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!formData.NombreActividad || !formData.DocenteID || !formData.Plataforma || !formData.URL || !formData.Fecha || parseInt(formData.EstudiantesAlcanzados) <= 0 || formData.CarrerasPromovidas.length === 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*) y asegúrese de que el número de estudiantes sea válido.');
            return;
        }

        setIsSubmitting(true);

        const formPayload = new FormData();

        formPayload.append('Tipo', 'Digital');
        formPayload.append('Fecha', formData.Fecha);
        formPayload.append('DocenteID', formData.DocenteID);
        formPayload.append('EstudiantesAlcanzados', formData.EstudiantesAlcanzados);
        formPayload.append('CarrerasPromovidas', formData.CarrerasPromovidas.join(', '));

        const observacionesCompletas = `Plataforma: ${formData.Plataforma} | URL: ${formData.URL}\n\n${formData.Observaciones}`;
        formPayload.append('Observaciones', observacionesCompletas);

        evidenciaFiles.forEach((file) => {
            formPayload.append('evidencias', file);
        });

        try {
            const response = await fetch(`${API_BASE_URL}/actividades`, {
                method: 'POST',
                body: formPayload,
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad digital. Código: ${response.status}`);
            } else {
                const archivosMsg = responseData.totalArchivos > 0
                    ? ` (${responseData.totalArchivos} archivo${responseData.totalArchivos > 1 ? 's' : ''} adjunto${responseData.totalArchivos > 1 ? 's' : ''})`
                    : '';
                setSuccessMessage(`${responseData.message}${archivosMsg}`);
                resetForm();
                if (onSuccess) setTimeout(onSuccess, 1500);
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

                    <FormSection title="Información de la Actividad" icon="💻" subtitle="Complete los detalles del evento digital">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre/Título de la Actividad *
                                </label>
                                <input
                                    type="text"
                                    name="NombreActividad"
                                    placeholder="Ej: Webinar sobre Ingeniería"
                                    value={formData.NombreActividad}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Docente Responsable *
                                </label>
                                <select
                                    name="DocenteID"
                                    value={formData.DocenteID}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="">-- Seleccione un docente (*) --</option>
                                    {docentes.map(docente => (
                                        <option key={docente.DocenteID} value={docente.DocenteID}>
                                            {docente.Nombre} {docente.Apellidos}
                                        </option>
                                    ))}
                                    {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Plataforma Utilizada *
                                </label>
                                <input
                                    type="text"
                                    name="Plataforma"
                                    placeholder="Ej: Zoom, TikTok, YouTube"
                                    value={formData.Plataforma}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha de Realización *
                                </label>
                                <input
                                    type="date"
                                    name="Fecha"
                                    value={formData.Fecha}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    URL de Evidencia Digital *
                                </label>
                                <input
                                    type="url"
                                    name="URL"
                                    placeholder="Ej: https://link.al.video/o/reporte"
                                    value={formData.URL}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Número de Estudiantes Alcanzados *
                                </label>
                                <input
                                    type="number"
                                    name="EstudiantesAlcanzados"
                                    placeholder="Ej: 150"
                                    value={formData.EstudiantesAlcanzados}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Carreras Promovidas" icon="🎓" subtitle="Seleccione las carreras que fueron objeto de promoción en el evento.">
                        <select
                            name="CarrerasPromovidas"
                            multiple
                            value={formData.CarrerasPromovidas}
                            onChange={handleChange}
                            size="4"
                            disabled={disableForm}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                        >
                            {CARRERAS_OFERTADAS.map(carrera => (
                                <option key={carrera} value={carrera}>{carrera}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Mantén Ctrl/Cmd para seleccionar varias</p>
                    </FormSection>

                    <FormSection title="Observaciones y Evidencias" icon="📝" subtitle="Información adicional y archivo de soporte (si aplica)">
                        <textarea
                            name="Observaciones"
                            rows="3"
                            placeholder="Detalles adicionales sobre la dinámica o los resultados..."
                            value={formData.Observaciones}
                            onChange={handleChange}
                            disabled={disableForm}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-4">Archivos de Soporte (Opcional)</label>
                        <input
                            type="file"
                            name="evidencias"
                            multiple
                            onChange={handleFileChange}
                            disabled={disableForm}
                            accept=".pdf,.xls,.xlsx,.doc,.docx,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                            className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-purple-50 file:text-purple-700
                                        hover:file:bg-purple-100"
                        />
                        {evidenciaFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p className="font-medium">Archivos seleccionados ({evidenciaFiles.length}/5):</p>
                                <ul className="list-disc list-inside mt-1">
                                    {evidenciaFiles.map((file, index) => (
                                        <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </FormSection>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-red-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm || isSubmitting}>
                                Limpiar
                            </SecondaryButtonComponent>
                            {onSuccess && (
                                <SecondaryButtonComponent type="button" onClick={onSuccess} disabled={disableForm}>
                                    Cerrar
                                </SecondaryButtonComponent>
                            )}
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