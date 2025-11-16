import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras';

const API_BASE_URL = '/api';

const RegistrarActividadPrepInvitada = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    const [formData, setFormData] = useState({
        Fecha: new Date().toISOString().split('T')[0],
        DocenteID: '',
        PreparatoriaID: '',
        HoraInicio: '',
        Duracion: '',
        CarreraPrincipal: '',
        EstudiantesAlcanzados: '',
        CarrerasPromovidasList: '',
        Observaciones: ''
    });

    const [evidenciaFiles, setEvidenciaFiles] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [preparatorias, setPreparatorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [docentesRes, preparatoriasRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/docentes`),
                    fetch(`${API_BASE_URL}/preparatorias`)
                ]);

                if (docentesRes.ok) setDocentes(await docentesRes.json());
                if (preparatoriasRes.ok) setPreparatorias(await preparatoriasRes.json());

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            Fecha: new Date().toISOString().split('T')[0],
            DocenteID: '',
            PreparatoriaID: '',
            HoraInicio: '',
            Duracion: '',
            CarreraPrincipal: '',
            EstudiantesAlcanzados: '',
            CarrerasPromovidasList: '',
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

        if (!formData.DocenteID || !formData.PreparatoriaID || !formData.CarreraPrincipal || !formData.Fecha || !formData.EstudiantesAlcanzados || parseInt(formData.EstudiantesAlcanzados, 10) <= 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*) y asegúrese de que el número de estudiantes sea válido.');
            return;
        }

        setIsSubmitting(true);

        const formPayload = new FormData();

        const prepName = preparatorias.find(p => p.PrepID === parseInt(formData.PreparatoriaID))?.Nombre || 'Preparatoria Desconocida';

        formPayload.append('Tipo', 'Invitada');
        formPayload.append('Fecha', formData.Fecha);
        formPayload.append('DocenteID', formData.DocenteID);
        formPayload.append('PreparatoriaID', formData.PreparatoriaID);
        formPayload.append('EstudiantesAlcanzados', formData.EstudiantesAlcanzados);

        const carreras = [formData.CarreraPrincipal];
        if (formData.CarrerasPromovidasList) {
            carreras.push(formData.CarrerasPromovidasList.split('\n').map(c => c.trim()).filter(Boolean).join(', '));
        }
        formPayload.append('CarrerasPromovidas', carreras.join(', '));

        const observaciones = `Hora: ${formData.HoraInicio || 'N/A'}, Duración: ${formData.Duracion || 'N/A'}. \n\nObservaciones: ${formData.Observaciones}`;
        formPayload.append('Observaciones', observaciones);

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
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad. Código: ${response.status}`);
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
                title="Registrar Actividad de Promoción (Preparatoria Invitada)"
                subtitle="Registre una actividad cuando una preparatoria visita su institución"
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

                    <FormSection title="Información de la Actividad" icon="📋" subtitle="Complete todos los campos requeridos para registrar la actividad">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                                    Preparatoria Invitada *
                                </label>
                                <select
                                    name="PreparatoriaID"
                                    value={formData.PreparatoriaID}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="">-- Seleccione una preparatoria (*) --</option>
                                    {preparatorias.map(prep => (
                                        <option key={prep.PrepID} value={prep.PrepID}>
                                            {prep.Nombre}
                                        </option>
                                    ))}
                                    {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Carrera Principal Presentada *
                                </label>
                                <select
                                    name="CarreraPrincipal"
                                    value={formData.CarreraPrincipal}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="">-- Seleccione una carrera (*) --</option>
                                    {CARRERAS_OFERTADAS.map(carrera => (
                                        <option key={carrera} value={carrera}>{carrera}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha de la Actividad *
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
                                    Hora de Inicio *
                                </label>
                                <input
                                    type="text"
                                    name="HoraInicio"
                                    placeholder="Ej: 10:30 AM"
                                    value={formData.HoraInicio}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Duración *
                                </label>
                                <input
                                    type="text"
                                    name="Duracion"
                                    placeholder="Ej: 90 minutos"
                                    value={formData.Duracion}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Número de Estudiantes Presentes *
                                </label>
                                <input
                                    type="number"
                                    name="EstudiantesAlcanzados"
                                    placeholder="Ej: 45"
                                    value={formData.EstudiantesAlcanzados}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Carreras Promovidas Secundarias" subtitle="Liste otras carreras que se promovieron (una por línea, opcional).">
                        <textarea
                            name="CarrerasPromovidasList"
                            rows="3"
                            placeholder="Ej: Ingeniería en Sistemas Computacionales"
                            value={formData.CarrerasPromovidasList}
                            onChange={handleChange}
                            disabled={disableForm}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        />
                    </FormSection>

                    <FormSection title="Observaciones y Resultados" subtitle="Describa los resultados obtenidos, reacciones de los estudiantes, etc.">
                        <textarea
                            name="Observaciones"
                            rows="3"
                            placeholder="Escriba aquí sus observaciones..."
                            value={formData.Observaciones}
                            onChange={handleChange}
                            disabled={disableForm}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        />
                    </FormSection>

                    <FormSection title="Evidencias (Opcional)" icon="📎" subtitle="Adjunte fotos, documentos o archivos Excel (máximo 5 archivos, 10MB cada uno)">
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
                                {isSubmitting ? 'Registrando Actividad...' : 'Registrar Actividad'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrarActividadPrepInvitada;