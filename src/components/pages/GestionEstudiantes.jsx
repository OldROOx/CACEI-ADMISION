import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import StatCard from '../atoms/StatCard';
import Modal from '../organisms/Modal';
import RegistrarEstudiante from './RegistrarEstudiante';
import EditarEstudiante from './EditarEstudiante';

const API_BASE_URL = '/api';

const GestionEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para modales
    const [isModalRegistroOpen, setIsModalRegistroOpen] = useState(false);
    const [isModalCargaOpen, setIsModalCargaOpen] = useState(false);
    const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

    // Estado para carga masiva
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchEstudiantes = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes`);
            if (!response.ok) throw new Error('Error al cargar estudiantes');

            const data = await response.json();
            setEstudiantes(data);

            // Calcular estadísticas
            const total = data.length;
            const aceptados = data.filter(e => e.EsAceptado).length;
            const municipios = [...new Set(data.map(e => e.Municipio).filter(Boolean))].length;
            const preparatorias = [...new Set(data.map(e => e.PrepID).filter(Boolean))].length;

            setStatsData([
                { value: total, label: 'Total Estudiantes', color: 'bg-indigo-500' },
                { value: aceptados, label: 'Aceptados', color: 'bg-green-500' },
                { value: municipios, label: 'Municipios', color: 'bg-blue-500' },
                { value: preparatorias, label: 'Preparatorias', color: 'bg-purple-500' },
            ]);

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar estudiantes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const handleFileChange = (e) => {
        setArchivoExcel(e.target.files[0] || null);
    };

    const handleCargaMasiva = async () => {
        if (!archivoExcel) {
            setErrorMessage('Debe seleccionar un archivo Excel.');
            return;
        }

        setIsUploading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('archivoExcel', archivoExcel);

        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/carga-masiva`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error en la carga masiva.');
            } else {
                setSuccessMessage(data.message);
                setArchivoExcel(null);
                document.querySelector('input[name="archivoExcel"]').value = '';
                fetchEstudiantes();
                setTimeout(() => setIsModalCargaOpen(false), 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        } finally {
            setIsUploading(false);
        }
    };

    const descargarPlantilla = () => {
        const plantillaURL = '/plantilla-estudiantes.xlsx';
        const link = document.createElement('a');
        link.href = plantillaURL;
        link.download = 'plantilla-estudiantes.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditarEstudiante = (estudiante) => {
        setEstudianteSeleccionado(estudiante);
        setIsModalEditarOpen(true);
    };

    const handleEliminarEstudiante = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este estudiante?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error al eliminar estudiante.');
            } else {
                setSuccessMessage(data.message || 'Estudiante eliminado exitosamente.');
                fetchEstudiantes();
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <FormHeader
                        title="Gestión de Estudiantes"
                        subtitle="Administre el registro de estudiantes de forma individual o masiva"
                        showBack={false}
                    />
                    <div className="flex space-x-2">
                        <SecondaryButton onClick={() => setIsModalCargaOpen(true)}>
                            📤 Carga Masiva
                        </SecondaryButton>
                        <PrimaryButton onClick={() => setIsModalRegistroOpen(true)}>
                            + Registrar Estudiante
                        </PrimaryButton>
                    </div>
                </div>

                {(successMessage || errorMessage) && (
                    <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {successMessage || errorMessage}
                    </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <p className="text-center text-gray-500 col-span-full">Cargando estadísticas...</p>
                    ) : (
                        statsData.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                        ))
                    )}
                </div>

                {/* Lista de Estudiantes */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Estudiantes Registrados</h3>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <span className="mr-2">📤</span>
                            Exportar
                        </button>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando estudiantes...</p>
                        ) : estudiantes.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay estudiantes registrados.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Completo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preparatoria</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Municipio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {estudiantes.map((est) => (
                                    <tr key={est.EstudianteID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {est.Matricula || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {est.Nombre} {est.Apellidos}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {est.Correo}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {est.PreparatoriaNombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {est.Municipio || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {est.CarreraInteres || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    est.EsAceptado
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {est.EsAceptado ? 'Aceptado' : 'Prospecto'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleEditarEstudiante(est)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleEliminarEstudiante(est.EstudianteID)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Registro Manual */}
            <Modal isOpen={isModalRegistroOpen} onClose={() => setIsModalRegistroOpen(false)}>
                <RegistrarEstudiante
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={() => {
                        setIsModalRegistroOpen(false);
                        fetchEstudiantes();
                    }}
                />
            </Modal>

            {/* Modal Editar Estudiante */}
            <Modal isOpen={isModalEditarOpen} onClose={() => setIsModalEditarOpen(false)}>
                <EditarEstudiante
                    estudiante={estudianteSeleccionado}
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={() => {
                        setIsModalEditarOpen(false);
                        setEstudianteSeleccionado(null);
                        fetchEstudiantes();
                    }}
                />
            </Modal>

            {/* Modal Carga Masiva */}
            <Modal isOpen={isModalCargaOpen} onClose={() => setIsModalCargaOpen(false)}>
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <FormHeader
                        title="Carga Masiva de Estudiantes"
                        subtitle="Suba un archivo Excel con la información de múltiples estudiantes"
                    />

                    {(successMessage || errorMessage) && (
                        <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {successMessage || errorMessage}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Instrucciones */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">📋 Instrucciones para el archivo Excel:</h4>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li><strong>Columnas obligatorias:</strong> Nombre, Apellidos, Correo</li>
                                <li><strong>Columnas opcionales:</strong> Matricula, Telefono, Preparatoria, CarreraInteres, Municipio, EsAceptado, Notas</li>
                                <li>La columna "Preparatoria" debe contener el nombre exacto de la preparatoria registrada</li>
                                <li>La columna "EsAceptado" debe contener "SI" o "NO"</li>
                                <li>No incluya encabezados adicionales ni filas vacías al inicio</li>
                            </ul>
                        </div>

                        {/* Botón Descargar Plantilla */}
                        <div className="flex justify-center">
                            <button
                                onClick={descargarPlantilla}
                                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                <span className="mr-2">📥</span>
                                Descargar Plantilla Excel
                            </button>
                        </div>

                        {/* Input de archivo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar archivo Excel *
                            </label>
                            <input
                                type="file"
                                name="archivoExcel"
                                onChange={handleFileChange}
                                accept=".xls,.xlsx"
                                className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-lg file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                            />
                            {archivoExcel && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Archivo seleccionado: <strong>{archivoExcel.name}</strong> ({(archivoExcel.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="pt-4 border-t flex justify-end space-x-3">
                            <SecondaryButton onClick={() => setIsModalCargaOpen(false)} disabled={isUploading}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton onClick={handleCargaMasiva} disabled={!archivoExcel || isUploading}>
                                {isUploading ? 'Procesando...' : 'Cargar Estudiantes'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default GestionEstudiantes;