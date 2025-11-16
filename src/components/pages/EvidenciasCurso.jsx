import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import SecondaryButton from '../atoms/SecondaryButton';

const API_BASE_URL = '/api/actividades';

const EvidenciasCurso = () => {
    const [actividades, setActividades] = useState([]);
    const [evidencias, setEvidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [filtroActividad, setFiltroActividad] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [evidenciasFiltradas, setEvidenciasFiltradas] = useState([]);

    const [isModalVistaOpen, setIsModalVistaOpen] = useState(false);
    const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState(null);

    useEffect(() => {
        fetchActividades();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [evidencias, filtroActividad, filtroTipo, busqueda]);

    const fetchActividades = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(API_BASE_URL);

            if (!response.ok) throw new Error('Error al cargar actividades');

            const actividadesData = await response.json();
            setActividades(actividadesData);

            const evidenciasExtraidas = [];
            actividadesData.forEach(actividad => {
                if (actividad.EvidenciasURL) {
                    const urls = actividad.EvidenciasURL.split(',');
                    urls.forEach((url, index) => {
                        evidenciasExtraidas.push({
                            EvidenciaID: `${actividad.ActividadID}-${index}`,
                            ActividadID: actividad.ActividadID,
                            ActividadTipo: actividad.Tipo,
                            ActividadFecha: actividad.Fecha,
                            DocenteNombre: actividad.DocenteNombre,
                            PreparatoriaNombre: actividad.PreparatoriaNombre,
                            TipoEvidencia: getTipoFromURL(url.trim()),
                            URL: url.trim(),
                            Descripcion: `Evidencia ${index + 1} de actividad ${actividad.Tipo}`,
                            FechaSubida: actividad.Fecha
                        });
                    });
                }
            });

            setEvidencias(evidenciasExtraidas);
            setEvidenciasFiltradas(evidenciasExtraidas);

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar las evidencias.');
        } finally {
            setLoading(false);
        }
    };

    const getTipoFromURL = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'Foto';
        if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) return 'Video';
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) return 'Documento';
        return 'Enlace';
    };

    const aplicarFiltros = () => {
        let resultados = [...evidencias];

        if (filtroActividad) {
            resultados = resultados.filter(ev => ev.ActividadID === parseInt(filtroActividad));
        }

        if (filtroTipo) {
            resultados = resultados.filter(ev => ev.TipoEvidencia === filtroTipo);
        }

        if (busqueda) {
            resultados = resultados.filter(ev => {
                const textoBusqueda =
                    `${ev.Descripcion} ${ev.ActividadTipo} ${ev.DocenteNombre} ${ev.PreparatoriaNombre}`.toLowerCase();
                return textoBusqueda.includes(busqueda.toLowerCase());
            });
        }

        setEvidenciasFiltradas(resultados);
    };

    const limpiarFiltros = () => {
        setFiltroActividad('');
        setFiltroTipo('');
        setBusqueda('');
    };

    const verDetalles = (evidencia) => {
        setEvidenciaSeleccionada(evidencia);
        setIsModalVistaOpen(true);
    };

    const getTipoIcon = (tipo) => {
        const icons = {
            Foto: '📷',
            Video: '🎥',
            Documento: '📄',
            Enlace: '🔗'
        };
        return icons[tipo] || '📎';
    };

    const getTipoBadge = (tipo) => {
        const badges = {
            Foto: 'bg-blue-100 text-blue-800 border-blue-300',
            Video: 'bg-purple-100 text-purple-800 border-purple-300',
            Documento: 'bg-green-100 text-green-800 border-green-300',
            Enlace: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
        return badges[tipo] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Evidencias del Curso"
                    subtitle="Visualice todas las evidencias subidas en las actividades de promoción"
                    showBack={false}
                />
                <SecondaryButton onClick={fetchActividades}>
                    🔄 Actualizar
                </SecondaryButton>
            </div>

            {errorMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros de Búsqueda</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        className="px-3 py-2 border rounded-lg"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={filtroActividad}
                        onChange={(e) => setFiltroActividad(e.target.value)}
                    >
                        <option value="">Todas las actividades</option>
                        {actividades.filter(act => act.EvidenciasURL).map(act => (
                            <option key={act.ActividadID} value={act.ActividadID}>
                                {act.Tipo} - {new Date(act.Fecha).toLocaleDateString('es-MX')}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="Foto">Foto</option>
                        <option value="Video">Video</option>
                        <option value="Documento">Documento</option>
                        <option value="Enlace">Enlace</option>
                    </select>

                    <button
                        onClick={limpiarFiltros}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        ✖ Limpiar
                    </button>
                </div>
            </div>

            {/* Galería */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Galería de Evidencias</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Cargando...</p>
                    ) : evidenciasFiltradas.length === 0 ? (
                        <p>No hay resultados.</p>
                    ) : (
                        evidenciasFiltradas.map((ev) => (
                            <div key={ev.EvidenciaID} className="border rounded-xl p-4 shadow">
                                <span className={`px-3 py-1 text-xs rounded-full border ${getTipoBadge(ev.TipoEvidencia)}`}>
                                    {getTipoIcon(ev.TipoEvidencia)} {ev.TipoEvidencia}
                                </span>

                                <h4 className="font-bold mt-3">{ev.ActividadTipo}</h4>
                                <p className="text-sm text-gray-600">{ev.Descripcion}</p>

                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={() => verDetalles(ev)}
                                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg flex-1"
                                    >
                                        👁️ Ver
                                    </button>

                                    <a
                                        href={ev.URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        📥
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalVistaOpen && evidenciaSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl w-full max-w-3xl">
                        <h2 className="text-2xl font-bold mb-4">📋 Detalles</h2>

                        <p><strong>Tipo:</strong> {evidenciaSeleccionada.TipoEvidencia}</p>
                        <p><strong>Actividad:</strong> {evidenciaSeleccionada.ActividadTipo}</p>

                        <a
                            href={evidenciaSeleccionada.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            📥 Descargar / Ver Archivo
                        </a>

                        <div className="mt-6 text-right">
                            <SecondaryButton onClick={() => setIsModalVistaOpen(false)}>
                                Cerrar
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvidenciasCurso;
