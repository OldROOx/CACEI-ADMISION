// src/components/pages/EvidenciasCurso.jsx
import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import StatCard from '../atoms/StatCard';

const API_BASE_URL = '/api';
// ✅ NUEVO: URL base para archivos estáticos del backend
const BACKEND_URL = 'http://localhost:3000';

const EvidenciasCurso = () => {
    const [evidencias, setEvidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Filtros
    const [filtroTipo, setFiltroTipo] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [evidenciasFiltradas, setEvidenciasFiltradas] = useState([]);

    // Estadísticas
    const [stats, setStats] = useState({
        totalEvidencias: 0,
        fotos: 0,
        documentos: 0,
        videos: 0
    });

    useEffect(() => {
        fetchDatos();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [evidencias, filtroTipo, busqueda]);

    const fetchDatos = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/evidencias/uploads`);

            if (!response.ok) {
                throw new Error('Error al cargar archivos de uploads');
            }

            const data = await response.json();
            console.log('📊 Archivos cargados desde uploads:', data);

            setEvidencias(data.archivos || []);
            setEvidenciasFiltradas(data.archivos || []);

            const archivos = data.archivos || [];
            const fotos = archivos.filter(e => e.tipo === 'Foto').length;
            const documentos = archivos.filter(e => e.tipo === 'Documento').length;
            const videos = archivos.filter(e => e.tipo === 'Video').length;

            setStats({
                totalEvidencias: archivos.length,
                fotos,
                documentos,
                videos
            });

        } catch (error) {
            console.error('❌ Error:', error);
            setErrorMessage('Error al cargar las evidencias de la carpeta uploads.');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultados = [...evidencias];

        if (filtroTipo) {
            resultados = resultados.filter(ev => ev.tipo === filtroTipo);
        }

        if (busqueda) {
            resultados = resultados.filter(ev => {
                const textoBusqueda = `${ev.nombreArchivo || ''} ${ev.extension || ''}`.toLowerCase();
                return textoBusqueda.includes(busqueda.toLowerCase());
            });
        }

        setEvidenciasFiltradas(resultados);
    };

    const limpiarFiltros = () => {
        setFiltroTipo('');
        setBusqueda('');
    };

    // ✅ CORRECCIÓN: Usar BACKEND_URL para construir la URL completa
    const descargarEvidencia = (nombreArchivo) => {
        const fileUrl = `${BACKEND_URL}/uploads/${nombreArchivo}`;

        console.log('📥 Descargando archivo desde:', fileUrl);

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = nombreArchivo;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('✅ Descarga iniciada');
    };

    // ✅ CORRECCIÓN: Usar BACKEND_URL para abrir el archivo
    const verEvidencia = (nombreArchivo) => {
        const fileUrl = `${BACKEND_URL}/uploads/${nombreArchivo}`;

        console.log('👁️ Abriendo archivo:', fileUrl);

        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };

    const handleEliminar = async (evidencia) => {
        if (!window.confirm(`¿Está seguro de que desea eliminar "${evidencia.nombreArchivo}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/evidencias/uploads/${evidencia.nombreArchivo}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error al eliminar archivo.');
            } else {
                setSuccessMessage('✓ Archivo eliminado exitosamente');
                fetchDatos();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de conexión con el servidor.');
        }
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
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Gestión de Evidencias"
                    subtitle="Visualice, descargue y gestione todos los archivos de la carpeta uploads"
                    showBack={false}
                />
                <div className="flex space-x-2">
                    <SecondaryButton onClick={fetchDatos}>
                        🔄 Actualizar
                    </SecondaryButton>
                </div>
            </div>

            {/* Messages */}
            {(successMessage || errorMessage) && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {successMessage || errorMessage}
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard value={stats.totalEvidencias} label="Total Archivos" colorClassName="text-white bg-indigo-500" />
                <StatCard value={stats.fotos} label="Fotos" colorClassName="text-white bg-blue-500" />
                <StatCard value={stats.documentos} label="Documentos" colorClassName="text-white bg-green-500" />
                <StatCard value={stats.videos} label="Videos" colorClassName="text-white bg-purple-500" />
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros de Búsqueda</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Buscar por nombre de archivo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="Foto">📷 Foto</option>
                        <option value="Video">🎥 Video</option>
                        <option value="Documento">📄 Documento</option>
                    </select>

                    <button
                        onClick={limpiarFiltros}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        ✖ Limpiar
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Mostrando <b>{evidenciasFiltradas.length}</b> de <b>{evidencias.length}</b> archivos
                </p>
            </div>

            {/* Tabla */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Archivos en Uploads</h3>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 mt-4">Cargando archivos...</p>
                        </div>
                    ) : evidenciasFiltradas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-2">📭 No hay archivos en la carpeta uploads</p>
                            <p className="text-gray-400 text-sm">
                                {evidencias.length === 0
                                    ? 'Los archivos se suben cuando se registra una actividad de promoción con evidencias'
                                    : 'No se encontraron archivos con los filtros aplicados'}
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Archivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extensión</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {evidenciasFiltradas.map((ev) => (
                                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{ev.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full border font-medium ${getTipoBadge(ev.tipo)}`}>
                                            <span className="mr-1">{getTipoIcon(ev.tipo)}</span>
                                            {ev.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={ev.nombreArchivo}>
                                        {ev.nombreArchivo}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 uppercase">
                                        .{ev.extension}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {ev.tamañoLegible}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(ev.fechaModificacion).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => descargarEvidencia(ev.nombreArchivo)}
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                                title="Descargar archivo"
                                            >
                                                <span className="mr-1">📥</span>
                                                Descargar
                                            </button>
                                            <button
                                                onClick={() => verEvidencia(ev.nombreArchivo)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                                title="Ver archivo en nueva pestaña"
                                            >
                                                <span className="mr-1">👁️</span>
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(ev)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                                title="Eliminar archivo"
                                            >
                                                <span className="mr-1">🗑️</span>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvidenciasCurso;