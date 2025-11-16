import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';

const API_BASE_URL = '/api';

const RegistrosActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para filtros
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroDocente, setFiltroDocente] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Estados para vista detallada
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    useEffect(() => {
        fetchActividades();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [actividades, filtroTipo, filtroFecha, filtroDocente, busqueda]);

    const fetchActividades = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/actividades`);
            if (!response.ok) throw new Error('Error al cargar actividades');

            const data = await response.json();
            setActividades(data);
            setActividadesFiltradas(data);
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar los registros de actividades.');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultados = [...actividades];

        if (filtroTipo !== 'todos') {
            resultados = resultados.filter(act => act.Tipo === filtroTipo);
        }

        if (filtroFecha) {
            resultados = resultados.filter(act => {
                const fechaActividad = new Date(act.Fecha).toISOString().split('T')[0];
                return fechaActividad === filtroFecha;
            });
        }

        if (filtroDocente) {
            resultados = resultados.filter(act =>
                act.DocenteNombre && act.DocenteNombre.toLowerCase().includes(filtroDocente.toLowerCase())
            );
        }

        if (busqueda) {
            resultados = resultados.filter(act => {
                const textoBusqueda = `${act.Tipo || ''} ${act.DocenteNombre || ''} ${act.PreparatoriaNombre || ''} ${act.CarrerasPromovidas || ''} ${act.Observaciones || ''}`.toLowerCase();
                return textoBusqueda.includes(busqueda.toLowerCase());
            });
        }

        setActividadesFiltradas(resultados);
    };

    const limpiarFiltros = () => {
        setFiltroTipo('todos');
        setFiltroFecha('');
        setFiltroDocente('');
        setBusqueda('');
    };

    const verDetalle = (actividad) => {
        setActividadSeleccionada(actividad);
        setMostrarDetalle(true);
    };

    const cerrarDetalle = () => {
        setActividadSeleccionada(null);
        setMostrarDetalle(false);
    };

    const getTipoBadge = (tipo) => {
        const badges = {
            'Visitada': 'bg-blue-100 text-blue-800 border-blue-300',
            'Invitada': 'bg-purple-100 text-purple-800 border-purple-300',
            'Digital': 'bg-green-100 text-green-800 border-green-300'
        };
        return badges[tipo] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const exportarExcel = () => {
        alert('Funcionalidad de exportación a Excel en desarrollo');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Registros de Actividades de Promoción"
                    subtitle="Consulta y gestiona todas las actividades realizadas"
                    showBack={false}
                />
                <div className="flex space-x-2">
                    <button
                        onClick={exportarExcel}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        <span className="mr-2">📥</span>
                        Exportar Excel
                    </button>
                    <button
                        onClick={fetchActividades}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <span className="mr-2">🔄</span>
                        Actualizar
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700 border-l-4 border-red-500">
                    {errorMessage}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros de Búsqueda</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Búsqueda General
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar en todos los campos..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Actividad
                        </label>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="todos">Todos los tipos</option>
                            <option value="Visitada">Visitada</option>
                            <option value="Invitada">Invitada</option>
                            <option value="Digital">Digital</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Docente Responsable
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre de docente..."
                            value={filtroDocente}
                            onChange={(e) => setFiltroDocente(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-end">
                        <button
                            onClick={limpiarFiltros}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                        >
                            ✖ Limpiar Filtros
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Mostrando <span className="font-bold text-blue-600">{actividadesFiltradas.length}</span> de <span className="font-bold">{actividades.length}</span> actividades
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Lista de Actividades</h3>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando registros...</p>
                    ) : actividadesFiltradas.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No se encontraron actividades con los filtros aplicados.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Docente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preparatoria</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiantes</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidencias</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {actividadesFiltradas.map((actividad) => (
                                <tr key={actividad.ActividadID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{actividad.ActividadID}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(actividad.Fecha).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTipoBadge(actividad.Tipo)}`}>
                                                {actividad.Tipo}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {actividad.DocenteNombre || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {actividad.PreparatoriaNombre || 'Digital/N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                👥 {actividad.EstudiantesAlcanzados}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {actividad.EvidenciasURL ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                📎 {actividad.EvidenciasURL.split(',').length}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => verDetalle(actividad)}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            👁️ Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {mostrarDetalle && actividadSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                📋 Detalle de Actividad #{actividadSeleccionada.ActividadID}
                            </h2>
                            <button
                                onClick={cerrarDetalle}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información General</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tipo de Actividad:</p>
                                        <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full border ${getTipoBadge(actividadSeleccionada.Tipo)}`}>
                                            {actividadSeleccionada.Tipo}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha:</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {new Date(actividadSeleccionada.Fecha).toLocaleDateString('es-MX', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Docente Responsable:</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {actividadSeleccionada.DocenteNombre || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Estudiantes Alcanzados:</p>
                                        <p className="text-sm font-medium text-blue-600 mt-1">
                                            👥 {actividadSeleccionada.EstudiantesAlcanzados} estudiantes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {actividadSeleccionada.PreparatoriaNombre && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">🏫 Preparatoria</h3>
                                    <p className="text-sm font-medium text-gray-900">
                                        {actividadSeleccionada.PreparatoriaNombre}
                                    </p>
                                </div>
                            )}

                            {actividadSeleccionada.CarrerasPromovidas && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">🎓 Carreras Promovidas</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {actividadSeleccionada.CarrerasPromovidas}
                                    </p>
                                </div>
                            )}

                            {actividadSeleccionada.Observaciones && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Observaciones</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {actividadSeleccionada.Observaciones}
                                    </p>
                                </div>
                            )}

                            {actividadSeleccionada.EvidenciasURL && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📎 Evidencias Adjuntas</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {actividadSeleccionada.EvidenciasURL.split(',').map((url, index) => (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
                                            >
                                                <span className="mr-2">📄</span>
                                                Evidencia {index + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t flex justify-end">
                                <button
                                    onClick={cerrarDetalle}
                                    className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrosActividades;
