import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import Modal from '../organisms/Modal';
import { exportarAsistenciaPDF, exportarAsistenciaExcel } from '../../utils/exportUtils';

const API_BASE_URL = '/api';

const ControlAsistencia = () => {
    const [clases, setClases] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estado para modal de tomar asistencia
    const [isModalAsistenciaOpen, setIsModalAsistenciaOpen] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [asistenciaEstudiantes, setAsistenciaEstudiantes] = useState([]);
    const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
    const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado para modal de detalles
    const [isModalDetallesOpen, setIsModalDetallesOpen] = useState(false);
    const [detallesClase, setDetallesClase] = useState(null);

    // Estado para menú de exportar
    const [menuExportarAbierto, setMenuExportarAbierto] = useState(false);

    // Estadísticas
    const [stats, setStats] = useState({
        asistenciaPromedio: 0,
        estudiantesActivos: 0,
        clasesEstaSemana: 0,
        materiasActivas: 0
    });

    useEffect(() => {
        fetchDatos();
    }, []);

    // Filtrar estudiantes cuando cambia la búsqueda
    useEffect(() => {
        if (busquedaEstudiante.trim() === '') {
            setEstudiantesFiltrados(asistenciaEstudiantes);
        } else {
            const filtrados = asistenciaEstudiantes.filter(est => {
                const textoBusqueda = `${est.Nombre} ${est.Matricula || ''}`.toLowerCase();
                return textoBusqueda.includes(busquedaEstudiante.toLowerCase());
            });
            setEstudiantesFiltrados(filtrados);
        }
    }, [busquedaEstudiante, asistenciaEstudiantes]);

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
            const [clasesRes, estudiantesRes, asistenciasRes] = await Promise.all([
                fetch(`${API_BASE_URL}/clases`),
                fetch(`${API_BASE_URL}/estudiantes`),
                fetch(`${API_BASE_URL}/asistencia`)
            ]);

            if (!clasesRes.ok || !estudiantesRes.ok || !asistenciasRes.ok) {
                throw new Error('Error al cargar datos');
            }

            const clasesData = await clasesRes.json();
            const estudiantesData = await estudiantesRes.json();
            const asistenciasData = await asistenciasRes.json();

            setClases(clasesData);
            setEstudiantes(estudiantesData);
            setAsistencias(asistenciasData);

            calcularEstadisticas(clasesData, estudiantesData, asistenciasData);

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar los datos del sistema.');
        } finally {
            setLoading(false);
        }
    };

    const calcularEstadisticas = (clasesData, estudiantesData, asistenciasData) => {
        const totalAsistencias = asistenciasData.length;
        const asistenciasPresentes = asistenciasData.filter(a => a.Presente).length;
        const asistenciaPromedio = totalAsistencias > 0
            ? Math.round((asistenciasPresentes / totalAsistencias) * 100)
            : 0;

        const estudiantesActivos = estudiantesData.filter(e => e.EsAceptado).length;

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

        setStats({
            asistenciaPromedio,
            estudiantesActivos,
            clasesEstaSemana,
            materiasActivas
        });
    };

    const abrirModalAsistencia = (clase) => {
        setClaseSeleccionada(clase);
        setBusquedaEstudiante('');

        const listaEstudiantes = estudiantes
            .filter(e => e.EsAceptado)
            .map(estudiante => {
                const asistenciaExistente = asistencias.find(
                    a => a.ClaseID === clase.ClaseID && a.EstudianteID === estudiante.EstudianteID
                );

                return {
                    EstudianteID: estudiante.EstudianteID,
                    Nombre: `${estudiante.Nombre} ${estudiante.Apellidos}`,
                    Matricula: estudiante.Matricula,
                    Presente: asistenciaExistente ? asistenciaExistente.Presente : false,
                    AsistenciaID: asistenciaExistente ? asistenciaExistente.AsistenciaID : null
                };
            });

        setAsistenciaEstudiantes(listaEstudiantes);
        setEstudiantesFiltrados(listaEstudiantes);
        setIsModalAsistenciaOpen(true);
    };

    const toggleAsistencia = (estudianteID) => {
        setAsistenciaEstudiantes(prev => {
            const nuevaLista = prev.map(est =>
                est.EstudianteID === estudianteID
                    ? { ...est, Presente: !est.Presente }
                    : est
            );
            if (busquedaEstudiante.trim() !== '') {
                setEstudiantesFiltrados(
                    nuevaLista.filter(est => {
                        const textoBusqueda = `${est.Nombre} ${est.Matricula || ''}`.toLowerCase();
                        return textoBusqueda.includes(busquedaEstudiante.toLowerCase());
                    })
                );
            } else {
                setEstudiantesFiltrados(nuevaLista);
            }
            return nuevaLista;
        });
    };

    const marcarTodosPresentes = () => {
        setAsistenciaEstudiantes(prev => {
            const nuevaLista = prev.map(est => ({ ...est, Presente: true }));
            setEstudiantesFiltrados(
                busquedaEstudiante.trim() === ''
                    ? nuevaLista
                    : nuevaLista.filter(est => {
                        const textoBusqueda = `${est.Nombre} ${est.Matricula || ''}`.toLowerCase();
                        return textoBusqueda.includes(busquedaEstudiante.toLowerCase());
                    })
            );
            return nuevaLista;
        });
    };

    const marcarTodosAusentes = () => {
        setAsistenciaEstudiantes(prev => {
            const nuevaLista = prev.map(est => ({ ...est, Presente: false }));
            setEstudiantesFiltrados(
                busquedaEstudiante.trim() === ''
                    ? nuevaLista
                    : nuevaLista.filter(est => {
                        const textoBusqueda = `${est.Nombre} ${est.Matricula || ''}`.toLowerCase();
                        return textoBusqueda.includes(busquedaEstudiante.toLowerCase());
                    })
            );
            return nuevaLista;
        });
    };

    const guardarAsistencia = async () => {
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const promesas = asistenciaEstudiantes.map(async (est) => {
                if (est.AsistenciaID) {
                    return fetch(`${API_BASE_URL}/asistencia/${est.AsistenciaID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ClaseID: claseSeleccionada.ClaseID,
                            EstudianteID: est.EstudianteID,
                            Presente: est.Presente
                        })
                    });
                } else {
                    return fetch(`${API_BASE_URL}/asistencia`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ClaseID: claseSeleccionada.ClaseID,
                            EstudianteID: est.EstudianteID,
                            Presente: est.Presente
                        })
                    });
                }
            });

            await Promise.all(promesas);

            setSuccessMessage('✓ Asistencia guardada exitosamente');

            setTimeout(() => {
                setIsModalAsistenciaOpen(false);
                setBusquedaEstudiante('');
                fetchDatos();
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al guardar la asistencia.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verDetalles = async (clase) => {
        setDetallesClase(clase);
        setIsModalDetallesOpen(true);
    };

    const calcularAsistenciaClase = (claseID) => {
        const asistenciasClase = asistencias.filter(a => a.ClaseID === claseID);
        if (asistenciasClase.length === 0) return { presentes: 0, total: 0, porcentaje: 0 };

        const presentes = asistenciasClase.filter(a => a.Presente).length;
        const total = asistenciasClase.length;
        const porcentaje = Math.round((presentes / total) * 100);

        return { presentes, total, porcentaje };
    };

    const getColorPorcentaje = (porcentaje) => {
        if (porcentaje >= 90) return 'bg-green-100 text-green-800';
        if (porcentaje >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const exportarPDF = () => {
        if (clases.length === 0) {
            setErrorMessage('No hay datos para exportar.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        exportarAsistenciaPDF(clases, asistencias);
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
        exportarAsistenciaExcel(clases, asistencias);
        setSuccessMessage('✓ Reporte exportado exitosamente a Excel');
        setTimeout(() => setSuccessMessage(''), 3000);
        setMenuExportarAbierto(false);
    };

    const clasesOrdenadas = [...clases].sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <FormHeader
                        title="Control de Asistencia"
                        subtitle="Registre la asistencia de estudiantes a las clases de nivelación"
                        showBack={false}
                    />
                </div>
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
                </div>
            </div>

            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="text-4xl font-bold text-indigo-600">{stats.asistenciaPromedio}%</div>
                    <div className="text-sm text-gray-600 mt-1">Asistencia Promedio</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="text-4xl font-bold text-blue-600">{stats.estudiantesActivos}</div>
                    <div className="text-sm text-gray-600 mt-1">Estudiantes Activos</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="text-4xl font-bold text-green-600">{stats.clasesEstaSemana}</div>
                    <div className="text-sm text-gray-600 mt-1">Clases Esta Semana</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="text-4xl font-bold text-purple-600">{stats.materiasActivas}</div>
                    <div className="text-sm text-gray-600 mt-1">Materias Activas</div>
                </div>
            </div>

            {/* Registros Recientes */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">📚 Registros Recientes</h3>
                    <p className="text-sm text-gray-500">Últimos registros de asistencia</p>
                </div>

                <div className="mt-4 space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando clases...</p>
                    ) : clasesOrdenadas.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay clases registradas.</p>
                    ) : (
                        clasesOrdenadas.slice(0, 10).map((clase) => {
                            const asistenciaInfo = calcularAsistenciaClase(clase.ClaseID);

                            return (
                                <div
                                    key={clase.ClaseID}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📖</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{clase.Materia}</h4>
                                            <p className="text-sm text-gray-600">
                                                {clase.DocenteNombre} • {new Date(clase.Fecha).toLocaleDateString('es-MX')} • {clase.Horario}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {asistenciaInfo.total > 0 && (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorPorcentaje(asistenciaInfo.porcentaje)}`}>
                                                {asistenciaInfo.presentes}/{asistenciaInfo.total} presentes ({asistenciaInfo.porcentaje}%)
                                            </span>
                                        )}
                                        <button
                                            onClick={() => verDetalles(clase)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => abrirModalAsistencia(clase)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            ✓ Tomar Asistencia
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal Tomar Asistencia */}
            <Modal isOpen={isModalAsistenciaOpen} onClose={() => setIsModalAsistenciaOpen(false)}>
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">✓ Tomar Asistencia</h2>
                            {claseSeleccionada && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {claseSeleccionada.Materia} • {new Date(claseSeleccionada.Fecha).toLocaleDateString('es-MX')} • {claseSeleccionada.Horario}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsModalAsistenciaOpen(false)}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {successMessage && (
                        <div className="p-4 mb-4 rounded-lg text-sm bg-green-100 text-green-700 border-l-4 border-green-500 flex items-center animate-pulse">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700 border-l-4 border-red-500">
                            {errorMessage}
                        </div>
                    )}

                    {/* Barra de Búsqueda y Estadísticas */}
                    <div className="mb-4 space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="🔍 Buscar por nombre o matrícula..."
                                        value={busquedaEstudiante}
                                        onChange={(e) => setBusquedaEstudiante(e.target.value)}
                                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                                </div>
                            </div>
                            <button
                                onClick={marcarTodosPresentes}
                                className="px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 whitespace-nowrap"
                            >
                                ✓ Todos Presentes
                            </button>
                            <button
                                onClick={marcarTodosAusentes}
                                className="px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 whitespace-nowrap"
                            >
                                ✗ Todos Ausentes
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="text-blue-700">
                                    <strong>Presentes:</strong> {asistenciaEstudiantes.filter(e => e.Presente).length}
                                </span>
                                <span className="text-gray-600">|</span>
                                <span className="text-red-700">
                                    <strong>Ausentes:</strong> {asistenciaEstudiantes.filter(e => !e.Presente).length}
                                </span>
                                <span className="text-gray-600">|</span>
                                <span className="text-gray-700">
                                    <strong>Total:</strong> {asistenciaEstudiantes.length}
                                </span>
                            </div>
                            {busquedaEstudiante && (
                                <span className="text-sm text-gray-600">
                                    Mostrando {estudiantesFiltrados.length} de {asistenciaEstudiantes.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Asistencia</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {estudiantesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        {busquedaEstudiante
                                            ? '❌ No se encontraron estudiantes con ese criterio de búsqueda'
                                            : 'No hay estudiantes registrados'}
                                    </td>
                                </tr>
                            ) : (
                                estudiantesFiltrados.map((estudiante) => (
                                    <tr key={estudiante.EstudianteID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {estudiante.Matricula || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {estudiante.Nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => toggleAsistencia(estudiante.EstudianteID)}
                                                className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                                    estudiante.Presente
                                                        ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-sm'
                                                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                                                }`}
                                            >
                                                {estudiante.Presente ? '✓ Presente' : '✗ Ausente'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <SecondaryButton
                            onClick={() => {
                                setIsModalAsistenciaOpen(false);
                                setBusquedaEstudiante('');
                            }}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={guardarAsistencia}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                '💾 Guardar Asistencia'
                            )}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Modal Ver Detalles */}
            <Modal isOpen={isModalDetallesOpen} onClose={() => setIsModalDetallesOpen(false)}>
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">📋 Detalles de la Clase</h2>
                        <button
                            onClick={() => setIsModalDetallesOpen(false)}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {detallesClase && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Información de la Clase</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Materia:</p>
                                        <p className="font-medium">{detallesClase.Materia}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Docente:</p>
                                        <p className="font-medium">{detallesClase.DocenteNombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Fecha:</p>
                                        <p className="font-medium">{new Date(detallesClase.Fecha).toLocaleDateString('es-MX')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Horario:</p>
                                        <p className="font-medium">{detallesClase.Horario}</p>
                                    </div>
                                    {detallesClase.Tema && (
                                        <div className="col-span-2">
                                            <p className="text-gray-600">Tema:</p>
                                            <p className="font-medium">{detallesClase.Tema}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Estadísticas de Asistencia</h3>
                                {(() => {
                                    const info = calcularAsistenciaClase(detallesClase.ClaseID);
                                    return (
                                        <div className="text-sm">
                                            <p>Presentes: <span className="font-bold text-green-600">{info.presentes}</span></p>
                                            <p>Ausentes: <span className="font-bold text-red-600">{info.total - info.presentes}</span></p>
                                            <p>Total: <span className="font-bold">{info.total}</span></p>
                                            <p>Porcentaje: <span className={`font-bold ${info.porcentaje >= 70 ? 'text-green-600' : 'text-red-600'}`}>{info.porcentaje}%</span></p>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="flex justify-end">
                                <SecondaryButton onClick={() => setIsModalDetallesOpen(false)}>
                                    Cerrar
                                </SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ControlAsistencia;