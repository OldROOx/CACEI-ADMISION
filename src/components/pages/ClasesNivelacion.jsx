import React, { useState, useEffect } from 'react';
import { FormHeader, FormSection } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import Modal from '../organisms/Modal';
import StatCard from '../atoms/StatCard';
import { exportarClasesPDF, exportarClasesExcel } from '../../utils/exportUtils';

const API_BASE_URL = '/api';

const ClasesNivelacion = () => {
    const [clases, setClases] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para modales
    const [isModalRegistroOpen, setIsModalRegistroOpen] = useState(false);
    const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [menuExportarAbierto, setMenuExportarAbierto] = useState(false);

    // Estadísticas
    const [stats, setStats] = useState({
        totalClases: 0,
        clasesEstaSemana: 0,
        materiasActivas: 0,
        docentesActivos: 0
    });

    // Formulario
    const [formData, setFormData] = useState({
        DocenteID: '',
        Materia: '',
        Fecha: new Date().toISOString().split('T')[0],
        Horario: '',
        Tema: '',
        Salon: '',
        Observaciones: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchDatos();
    }, []);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuExportarAbierto && !event.target.closest('.menu-exportar')) {
                setMenuExportarAbierto(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuExportarAbierto]);

    const fetchDatos = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const [clasesRes, docentesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/clases`),
                fetch(`${API_BASE_URL}/docentes`)
            ]);

            if (!clasesRes.ok || !docentesRes.ok) {
                throw new Error('Error al cargar datos');
            }

            const clasesData = await clasesRes.json();
            const docentesData = await docentesRes.json();

            setClases(clasesData);
            setDocentes(docentesData);

            calcularEstadisticas(clasesData, docentesData);

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    const calcularEstadisticas = (clasesData, docentesData) => {
        const totalClases = clasesData.length;

        // Clases esta semana
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const clasesEstaSemana = clasesData.filter(clase => {
            const fechaClase = new Date(clase.Fecha);
            return fechaClase >= inicioSemana && fechaClase <= finSemana;
        }).length;

        const materiasActivas = [...new Set(clasesData.map(c => c.Materia))].length;
        const docentesActivos = docentesData.length;

        setStats({
            totalClases,
            clasesEstaSemana,
            materiasActivas,
            docentesActivos
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            DocenteID: '',
            Materia: '',
            Fecha: new Date().toISOString().split('T')[0],
            Horario: '',
            Tema: '',
            Salon: '',
            Observaciones: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!formData.DocenteID || !formData.Materia || !formData.Fecha) {
            setErrorMessage('Por favor, complete todos los campos obligatorios: Docente, Materia y Fecha.');
            return;
        }

        setIsSubmitting(true);

        try {
            const dataToSend = {
                DocenteID: parseInt(formData.DocenteID),
                Materia: formData.Materia,
                Fecha: formData.Fecha,
                Horario: formData.Horario || null,
                Tema: formData.Tema || null,
                Salon: formData.Salon || null,
                Observaciones: formData.Observaciones || null
            };

            const response = await fetch(`${API_BASE_URL}/clases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || 'Error al registrar clase.');
            } else {
                setSuccessMessage('✓ Clase registrada exitosamente');
                resetForm();
                setTimeout(() => {
                    setIsModalRegistroOpen(false);
                    fetchDatos();
                }, 1500);
            }

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditar = (clase) => {
        setClaseSeleccionada(clase);
        setFormData({
            DocenteID: clase.DocenteID.toString(),
            Materia: clase.Materia,
            Fecha: new Date(clase.Fecha).toISOString().split('T')[0],
            Horario: clase.Horario || '',
            Tema: clase.Tema || '',
            Salon: clase.Salon || '',
            Observaciones: clase.Observaciones || ''
        });
        setIsModalEditarOpen(true);
    };

    const handleActualizar = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!formData.DocenteID || !formData.Materia || !formData.Fecha) {
            setErrorMessage('Por favor, complete todos los campos obligatorios.');
            return;
        }

        setIsSubmitting(true);

        try {
            const dataToSend = {
                DocenteID: parseInt(formData.DocenteID),
                Materia: formData.Materia,
                Fecha: formData.Fecha,
                Horario: formData.Horario || null,
                Tema: formData.Tema || null,
                Salon: formData.Salon || null,
                Observaciones: formData.Observaciones || null
            };

            const response = await fetch(`${API_BASE_URL}/clases/${claseSeleccionada.ClaseID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.message || 'Error al actualizar clase.');
            } else {
                setSuccessMessage('✓ Clase actualizada exitosamente');
                setTimeout(() => {
                    setIsModalEditarOpen(false);
                    setClaseSeleccionada(null);
                    resetForm();
                    fetchDatos();
                }, 1500);
            }

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async (claseID) => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta clase? Esta acción también eliminará todas las asistencias asociadas.')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clases/${claseID}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error al eliminar clase.');
            } else {
                setSuccessMessage('✓ Clase eliminada exitosamente');
                fetchDatos();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        }
    };

    const exportarPDF = () => {
        if (clases.length === 0) {
            setErrorMessage('No hay datos para exportar.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        exportarClasesPDF(clases);
        setSuccessMessage('✓ Reporte exportado exitosamente a PDF');
        setTimeout(() => setSuccessMessage(''), 3000);
        setMenuExportarAbierto(false);
    };

    const exportarExcel = () => {
        if (clases.length === 0) {
            setErrorMessage('No hay datos para exportar.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        exportarClasesExcel(clases);
        setSuccessMessage('✓ Reporte exportado exitosamente a Excel');
        setTimeout(() => setSuccessMessage(''), 3000);
        setMenuExportarAbierto(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Gestión de Clases de Nivelación"
                    subtitle="Administre las clases de inducción y nivelación"
                    showBack={false}
                />
                <div className="flex space-x-2">
                    <SecondaryButton onClick={fetchDatos}>
                        🔄 Actualizar
                    </SecondaryButton>
                    <div className="relative menu-exportar">
                        <button
                            onClick={() => setMenuExportarAbierto(!menuExportarAbierto)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <span className="mr-2">📥</span>
                            Exportar
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {menuExportarAbierto && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <button
                                    onClick={exportarPDF}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                                >
                                    📄 Exportar a PDF
                                </button>
                                <button
                                    onClick={exportarExcel}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                                >
                                    📊 Exportar a Excel
                                </button>
                            </div>
                        )}
                    </div>
                    <PrimaryButton onClick={() => setIsModalRegistroOpen(true)}>
                        + Registrar Clase
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
                <StatCard value={stats.totalClases} label="Total Clases" colorClassName="bg-indigo-500" />
                <StatCard value={stats.clasesEstaSemana} label="Clases Esta Semana" colorClassName="bg-green-500" />
                <StatCard value={stats.materiasActivas} label="Materias Activas" colorClassName="bg-blue-500" />
                <StatCard value={stats.docentesActivos} label="Docentes Activos" colorClassName="bg-purple-500" />
            </div>

            {/* Tabla de Clases */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Clases Registradas</h3>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando clases...</p>
                    ) : clases.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay clases registradas.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salón</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {clases.map((clase) => (
                                <tr key={clase.ClaseID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{clase.ClaseID}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {clase.Materia}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {clase.DocenteNombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(clase.Fecha).toLocaleDateString('es-MX')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {clase.Horario || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {clase.Tema || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {clase.Salon || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleEditar(clase)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(clase.ClaseID)}
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

            {/* Modal Registrar Clase */}
            <Modal isOpen={isModalRegistroOpen} onClose={() => setIsModalRegistroOpen(false)}>
                <FormularioClase
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    docentes={docentes}
                    isSubmitting={isSubmitting}
                    successMessage={successMessage}
                    errorMessage={errorMessage}
                    onClose={() => setIsModalRegistroOpen(false)}
                    titulo="Registrar Nueva Clase"
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                />
            </Modal>

            {/* Modal Editar Clase */}
            <Modal isOpen={isModalEditarOpen} onClose={() => setIsModalEditarOpen(false)}>
                <FormularioClase
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleActualizar}
                    docentes={docentes}
                    isSubmitting={isSubmitting}
                    successMessage={successMessage}
                    errorMessage={errorMessage}
                    onClose={() => setIsModalEditarOpen(false)}
                    titulo="Editar Clase"
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    esEdicion={true}
                />
            </Modal>
        </div>
    );
};

// Componente reutilizable para formulario
const FormularioClase = ({
                             formData,
                             handleChange,
                             handleSubmit,
                             docentes,
                             isSubmitting,
                             successMessage,
                             errorMessage,
                             onClose,
                             titulo,
                             PrimaryButtonComponent,
                             SecondaryButtonComponent,
                             esEdicion = false
                         }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title={titulo}
                subtitle="Complete la información de la clase"
            />

            {successMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-green-100 text-green-700 border-l-4 border-green-500">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700 border-l-4 border-red-500">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FormSection title="Información de la Clase" icon="📖">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Docente Responsable *
                            </label>
                            <select
                                name="DocenteID"
                                value={formData.DocenteID}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                            >
                                <option value="">-- Seleccione un docente --</option>
                                {docentes.map(docente => (
                                    <option key={docente.DocenteID} value={docente.DocenteID}>
                                        {docente.Nombre} {docente.Apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Materia *
                            </label>
                            <input
                                type="text"
                                name="Materia"
                                placeholder="Ej: Matemáticas Básicas"
                                value={formData.Materia}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Fecha *
                            </label>
                            <input
                                type="date"
                                name="Fecha"
                                value={formData.Fecha}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Horario
                            </label>
                            <input
                                type="text"
                                name="Horario"
                                placeholder="Ej: 09:00 - 11:00"
                                value={formData.Horario}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Tema
                            </label>
                            <input
                                type="text"
                                name="Tema"
                                placeholder="Ej: Álgebra Lineal"
                                value={formData.Tema}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Salón
                            </label>
                            <input
                                type="text"
                                name="Salon"
                                placeholder="Ej: Aula 101"
                                value={formData.Salon}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Observaciones
                            </label>
                            <textarea
                                name="Observaciones"
                                rows="3"
                                placeholder="Notas adicionales sobre la clase..."
                                value={formData.Observaciones}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>
                    </div>
                </FormSection>

                <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500 mb-4">
                        Los campos marcados con (*) son obligatorios.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButtonComponent
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : esEdicion ? '💾 Guardar Cambios' : '📝 Registrar Clase'}
                        </PrimaryButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ClasesNivelacion;