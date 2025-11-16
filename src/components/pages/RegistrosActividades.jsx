import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import { exportarActividadesExcel } from '../../utils/exportUtils';

const API_BASE_URL = '/api';

const RegistrosActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroDocente, setFiltroDocente] = useState('');
    const [busqueda, setBusqueda] = useState('');

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

        if (filtroTipo !== 'todos')
            resultados = resultados.filter(act => act.Tipo === filtroTipo);

        if (filtroFecha)
            resultados = resultados.filter(act => new Date(act.Fecha).toISOString().split('T')[0] === filtroFecha);

        if (filtroDocente)
            resultados = resultados.filter(act =>
                act.DocenteNombre?.toLowerCase().includes(filtroDocente.toLowerCase())
            );

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
        if (actividadesFiltradas.length === 0)
            return setErrorMessage('No hay datos para exportar.'), setTimeout(() => setErrorMessage(''), 3000);

        exportarActividadesExcel(actividadesFiltradas);
        setSuccessMessage('✓ Reporte exportado exitosamente a Excel');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <FormHeader title="Registros de Actividades de Promoción" subtitle="Consulta y gestiona todas las actividades realizadas" showBack={false}/>

                <div className="flex space-x-2">
                    <button onClick={exportarExcel} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                        <span className="mr-2">📥</span> Exportar Excel
                    </button>
                    <button onClick={fetchActividades} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <span className="mr-2">🔄</span> Actualizar
                    </button>
                </div>
            </div>

            {/* MESSAGES */}
            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {/* FILTROS */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros de Búsqueda</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e)=>setBusqueda(e.target.value)}
                               className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <select value={filtroTipo} onChange={(e)=>setFiltroTipo(e.target.value)} className="px-3 py-2 border rounded-lg">
                        <option value="todos">Todos los tipos</option>
                        <option value="Visitada">Visitada</option>
                        <option value="Invitada">Invitada</option>
                        <option value="Digital">Digital</option>
                    </select>

                    <input type="date" value={filtroFecha} onChange={(e)=>setFiltroFecha(e.target.value)} className="px-3 py-2 border rounded-lg"/>

                    <input type="text" placeholder="Docente responsable" value={filtroDocente} onChange={(e)=>setFiltroDocente(e.target.value)}
                           className="px-3 py-2 border rounded-lg md:col-span-2" />

                    <button onClick={limpiarFiltros} className="px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 md:col-span-2">
                        ✖ Limpiar filtros
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">Mostrando <b>{actividadesFiltradas.length}</b> de <b>{actividades.length}</b> actividades</p>
            </div>

            {/* TABLA */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Lista de Actividades</h3>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando registros...</p>
                    ) : actividadesFiltradas.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No se encontraron actividades.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Fecha</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Tipo</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Docente</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Preparatoria</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Estudiantes</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Evidencias</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Acciones</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                            {actividadesFiltradas.map((actividad) => (
                                <tr key={actividad.ActividadID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{actividad.ActividadID}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(actividad.Fecha)
                                            .toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'numeric'})}
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTipoBadge(actividad.Tipo)}`}>
                                                {actividad.Tipo}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{actividad.DocenteNombre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{actividad.PreparatoriaNombre || 'Digital/N/A'}</td>
                                    <td className="px-6 py-4 text-sm">👥 {actividad.EstudiantesAlcanzados}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {actividad.EvidenciasURL ? (
                                            <span className="inline-flex px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                                    📎 {actividad.EvidenciasURL.split(',').length}
                                                </span>
                                        ) : '-' }
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button onClick={()=>verDetalle(actividad)} className="text-blue-600 hover:text-blue-900">
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

            {/* MODAL DETALLE */}
            {mostrarDetalle && actividadSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full overflow-y-auto max-h-[90vh] shadow-xl">

                        <div className="sticky top-0 px-6 py-4 border-b flex justify-between items-center bg-white">
                            <h2 className="text-xl font-bold">📋 Actividad #{actividadSeleccionada.ActividadID}</h2>
                            <button onClick={cerrarDetalle} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
                        </div>

                        <div className="p-6 space-y-6">

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
                                <button onClick={cerrarDetalle} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
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
