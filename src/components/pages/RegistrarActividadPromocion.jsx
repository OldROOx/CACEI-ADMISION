import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras';

const API_BASE_URL = '/api';

const RegistrarActividadPromocion = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {

    const [formData, setFormData] = useState({
        Tipo: 'Visitada',
        Fecha: new Date().toISOString().split('T')[0],
        DocenteID: '',
        PreparatoriaID: '',
        EstudiantesAlcanzados: 1,
        CarrerasPromovidas: [],
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
            Tipo: 'Visitada',
            Fecha: new Date().toISOString().split('T')[0],
            DocenteID: '',
            PreparatoriaID: '',
            EstudiantesAlcanzados: 1,
            CarrerasPromovidas: [],
            Observaciones: ''
        });
        setEvidenciaFiles([]);
        // Limpiar input de archivos
        const fileInput = document.querySelector('input[name="evidencias"]');
        if (fileInput) fileInput.value = '';
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

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

        setIsSubmitting(true);

        try {
            // ✅ CAMBIO: Usar FormData para enviar archivos
            const formPayload = new FormData();
            formPayload.append('Tipo', formData.Tipo);
            formPayload.append('Fecha', formData.Fecha);
            formPayload.append('DocenteID', formData.DocenteID);
            formPayload.append('PreparatoriaID', formData.PreparatoriaID);
            formPayload.append('EstudiantesAlcanzados', formData.EstudiantesAlcanzados.toString());
            formPayload.append('CarrerasPromovidas', formData.CarrerasPromovidas.join(','));
            formPayload.append('Observaciones', formData.Observaciones);

            // Agregar todos los archivos
            evidenciaFiles.forEach((file) => {
                formPayload.append('evidencias', file);
            });

            const response = await fetch(`${API_BASE_URL}/actividades`, {
                method: 'POST',
                // ✅ NO incluir Content-Type, FormData lo maneja automáticamente
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
                title="Registrar Actividad de Promoción (Visita a Preparatoria)"
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

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipo de Actividad *
                                </label>
                                <select
                                    name="Tipo"
                                    value={formData.Tipo}
                                    onChange={handleChange}
                                    disabled={true}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="Visitada">Promoción General (Presencial)</option>
                                </select>
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
                                            {docente.Nombre} {docente.Apellidos} ({docente.Especialidad})
                                        </option>
                                    ))}
                                    {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Preparatoria Visitada *
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
                                            {prep.Nombre} ({prep.Clave || 'N/A'})
                                        </option>
                                    ))}
                                    {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Estudiantes Alcanzados *
                                </label>
                                <input
                                    type="number"
                                    name="EstudiantesAlcanzados"
                                    placeholder="Número de estudiantes en la sesión"
                                    value={formData.EstudiantesAlcanzados}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                            </div>

                        </div>
                    </FormSection>

                    <FormSection title="Detalles de Promoción" icon="🎓" subtitle="Carreras y observaciones del evento">

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Carreras Promovidas * (mantén Ctrl/Cmd para seleccionar varias)
                            </label>
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
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Observaciones
                            </label>
                            <textarea
                                name="Observaciones"
                                rows="3"
                                placeholder="Detalles de la interacción, preguntas frecuentes, etc."
                                value={formData.Observaciones}
                                onChange={handleChange}
                                disabled={disableForm}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>
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
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
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
                        <p className="text-xs text-gray-500 mb-4">
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <SecondaryButtonComponent type="button" onClick={resetForm} disabled={disableForm}>
                                Limpiar
                            </SecondaryButtonComponent>
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