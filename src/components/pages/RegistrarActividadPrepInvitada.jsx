// src/components/pages/RegistrarActividadPrepInvitada.jsx

import React, { useState, useEffect } from 'react';
import { FormField, FormHeader, FormSection } from '../atoms/FormAtoms';
import { CARRERAS_OFERTADAS } from '../../data/Carreras'; // Importación

const API_BASE_URL = '/api';

const RegistrarActividadPrepInvitada = ({ PrimaryButtonComponent, SecondaryButtonComponent }) => {

    // --- ESTADO PARA LA DATA REAL ---
    const [docentes, setDocentes] = useState([]);
    const [preparatorias, setPreparatorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de catálogos
    const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario

    // Estado para datos del formulario
    const [formData, setFormData] = useState({
        Fecha: new Date().toISOString().split('T')[0],
        DocenteID: '', // ID del Docente
        PreparatoriaID: '', // ID de la Preparatoria
        HoraInicio: '',
        Duracion: '', // Se asume que esto es un texto descriptivo
        CarreraPrincipal: '', // Campo de selección simple
        EstudiantesAlcanzados: '', // Se inicializa como string para el input
        CarrerasPromovidasList: '', // Contenido del textarea
        Observaciones: ''
    });
    const [evidenciaFile, setEvidenciaFile] = useState(null);

    // Estados de mensaje
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE CATÁLOGOS AL MONTAR EL COMPONENTE ---
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
        setEvidenciaFile(null);
        setSuccessMessage('');
        setErrorMessage('');
        // Limpiar el input de archivo si es necesario, aunque resetForm lo gestiona
        document.querySelector('input[name="evidencia"]').value = '';
    };

    // --- LÓGICA DE ENVÍO DE DATOS A LA API (Multipart Form Data) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validación de campos
        if (!formData.DocenteID || !formData.PreparatoriaID || !formData.CarreraPrincipal || !formData.Fecha || !formData.EstudiantesAlcanzados || parseInt(formData.EstudiantesAlcanzados, 10) <= 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios (*) y asegúrese de que el número de estudiantes sea válido.');
            return;
        }

        setIsSubmitting(true);

        // Creamos FormData para incluir el archivo
        const formPayload = new FormData();

        // El nombre de la actividad se genera sintéticamente si no hay campo específico
        const prepName = preparatorias.find(p => p.id === formData.PreparatoriaID)?.Nombre || 'Preparatoria Desconocida';
        formPayload.append('nombre', `Actividad Invitada: ${prepName}`);

        // Establecer el tipo de actividad fijo
        formPayload.append('tipo', 'Invitada'); // O 'Preparatoria Invitada' según lo que espere tu API

        // Añadir campos del formulario.
        // NOTA: Se asume que el backend espera las propiedades en camelCase o snake_case como en la actividad anterior,
        // o mapea desde los nombres de campo del frontend:
        formPayload.append('fecha', formData.Fecha);
        formPayload.append('docenteId', formData.DocenteID); // Asumiendo que el API espera 'docenteId'
        formPayload.append('preparatoriaId', formData.PreparatoriaID); // Asumiendo que el API espera 'preparatoriaId'
        formPayload.append('estudiantesAlcanzados', formData.EstudiantesAlcanzados);

        // Carreras promovidas: Enviamos una lista de la carrera principal + el contenido del textarea
        const carreras = [formData.CarreraPrincipal];
        if (formData.CarrerasPromovidasList) {
            carreras.push(formData.CarrerasPromovidasList.split('\n').map(c => c.trim()).filter(Boolean).join(', '));
        }
        formPayload.append('carrerasPromovidas', carreras.join(', '));

        // Observaciones: Combinamos hora, duración y observaciones
        const observaciones = `Hora: ${formData.HoraInicio || 'N/A'}, Duración: ${formData.Duracion || 'N/A'}. \n\nObservaciones: ${formData.Observaciones}`;
        formPayload.append('observaciones', observaciones);

        // Añadir archivo de evidencia
        if (evidenciaFile) {
            // 'evidencia' es el nombre de campo que Multer debe esperar en el backend.
            formPayload.append('evidencia', evidenciaFile, evidenciaFile.name);
        }

        try {
            // El navegador se encarga de establecer el Content-Type correcto (multipart/form-data)
            const response = await fetch(`${API_BASE_URL}/actividades`, {
                method: 'POST',
                // NO incluyas 'Content-Type': 'multipart/form-data' aquí, deja que el navegador lo haga
                body: formPayload,
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || responseData.error || `Error al registrar actividad. Código: ${response.status}`);
            } else {
                setSuccessMessage(responseData.message || 'Actividad de Preparatoria Invitada registrada exitosamente.');
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
                title="Registrar Actividad de Promoción (Preparatoria Invitada)"
                subtitle="Registre una nueva actividad de promoción realizada"
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

                    {/* 1. SECCIÓN: INFORMACIÓN DE LA ACTIVIDAD */}
                    <FormSection title="Información de la Actividad" icon="📋" subtitle="Complete todos los campos requeridos para registrar la actividad">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Docente Responsable (DocenteID) */}
                            <FormField label="Docente Responsable" name="DocenteID" type="select" required={true} value={formData.DocenteID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione un docente (*) --</option>
                                {docentes.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.Nombre} {docente.Apellidos}
                                    </option>
                                ))}
                                {docentes.length === 0 && <option value="" disabled>No hay docentes registrados</option>}
                            </FormField>

                            {/* Preparatoria Invitada (PreparatoriaID) */}
                            <FormField label="Preparatoria Invitada" name="PreparatoriaID" type="select" required={true} value={formData.PreparatoriaID} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una preparatoria (*) --</option>
                                {preparatorias.map(prep => (
                                    <option key={prep.id} value={prep.id}>
                                        {prep.Nombre}
                                    </option>
                                ))}
                                {preparatorias.length === 0 && <option value="" disabled>No hay preparatorias registradas</option>}
                            </FormField>

                            {/* PROYECTO/CARRERA PRESENTADA --- USO DE CATÁLOGO --- */}
                            <FormField label="Carrera Principal Presentada" name="CarreraPrincipal" type="select" required={true} colSpan="col-span-2" value={formData.CarreraPrincipal} onChange={handleChange} disabled={disableForm}>
                                <option value="">-- Seleccione una carrera (*) --</option>
                                {CARRERAS_OFERTADAS.map(carrera => (
                                    <option key={carrera} value={carrera}>{carrera}</option>
                                ))}
                            </FormField>

                            <FormField label="Fecha de la Actividad" name="Fecha" type="date" required={true} value={formData.Fecha} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Hora de Inicio" name="HoraInicio" placeholder="Ej: 10:30 AM" type="text" required={true} value={formData.HoraInicio} onChange={handleChange} disabled={disableForm} />
                            <FormField label="Duración (Ej: 90 minutos)" name="Duracion" placeholder="Ej: 90 minutos" type="text" required={true} value={formData.Duracion} onChange={handleChange} disabled={disableForm} />

                            <div className="col-span-2">
                                <FormField label="Número de Estudiantes Presentes" name="EstudiantesAlcanzados" placeholder="Ej: 45" type="number" required={true} value={formData.EstudiantesAlcanzados} onChange={handleChange} disabled={disableForm} min="1" />
                            </div>
                        </div>
                    </FormSection>

                    {/* 2. SECCIÓN: CARRERAS PROMOVIDAS (Campo TEXT para la columna CarrerasPromovidas) */}
                    <FormSection title="Carreras Promovidas Secundarias" subtitle="Liste otras carreras que se promovieron (una por línea, opcional).">
                        <FormField label="" name="CarrerasPromovidasList" placeholder="Ej: Ingeniería en Sistemas Computacionales" type="textarea" value={formData.CarrerasPromovidasList} onChange={handleChange} disabled={disableForm} />
                    </FormSection>

                    {/* 3. OBSERVACIONES Y RESULTADOS (Textarea) */}
                    <FormSection title="Observaciones y Resultados" subtitle="Describa los resultados obtenidos, reacciones de los estudiantes, etc.">
                        <FormField label="" name="Observaciones" placeholder="Escriba aquí sus observaciones..." type="textarea" value={formData.Observaciones} onChange={handleChange} disabled={disableForm} />
                    </FormSection>

                    {/* 4. EVIDENCIAS (File Input) */}
                    <FormSection title="Evidencias (Opcional)" subtitle="Suba fotografías, listas de asistencia, o documentos relacionados con la actividad (PDF, Excel, JPG, PNG)">
                        <input
                            type="file"
                            name="evidencia"
                            onChange={handleFileChange}
                            disabled={disableForm}
                            className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                            accept=".pdf,.xls,.xlsx,image/png,image/jpeg"
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
                                {isSubmitting ? 'Registrando Recorrido...' : 'Registrar Recorrido'}
                            </PrimaryButtonComponent>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrarActividadPrepInvitada;