import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';
import Modal from '../organisms/Modal';
import SecondaryButton from '../atoms/SecondaryButton';
// Importa el nuevo componente de formulario (SubirEvidencia.jsx)
import SubirEvidencia from './SubirEvidencia';

const API_BASE_URL = '/api';

const EvidenciasCurso = () => {
    // --- ESTADOS PARA LA DATA REAL ---
    const [evidenciasData, setEvidenciasData] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Mapas para resolver IDs a nombres
    const [estudiantesMap, setEstudiantesMap] = useState({});
    const [clasesMap, setClasesMap] = useState({});

    // --- ESTADO PARA EL MODAL DE SUBIR EVIDENCIA ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        fetchEvidenciasData(); // Recargar datos al cerrar
    };


    // --- LÓGICA DE CARGA DE DATOS DE LA API ---
    const fetchEvidenciasData = async () => {
        setLoading(true);
        setErrorMessage('');
        let currentEstudiantesMap = {};
        let currentClasesMap = {};

        try {
            // 1. Obtener Estudiantes y Clases para mapear IDs a Nombres
            const [estudiantesRes, clasesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/estudiantes`), //
                fetch(`${API_BASE_URL}/clases`),       //
            ]);

            const estudiantesRaw = estudiantesRes.ok ? await estudiantesRes.json() : [];
            const clasesRaw = clasesRes.ok ? await clasesRes.json() : [];

            currentEstudiantesMap = estudiantesRaw.reduce((acc, e) => {
                // Asume { id, Nombre, Apellidos, Matricula }
                acc[e.id] = `${e.Nombre} ${e.Apellidos} (${e.Matricula || 'N/A'})`;
                return acc;
            }, {});
            setEstudiantesMap(currentEstudiantesMap);

            currentClasesMap = clasesRaw.reduce((acc, c) => {
                // Asume { id, nombre, materia }
                acc[c.id] = c.nombre || c.materia || 'Clase Desconocida';
                return acc;
            }, {});
            setClasesMap(currentClasesMap);

            // 2. Obtener Evidencias
            // Petición al endpoint /api/evidencias
            const evidenciasRes = await fetch(`${API_BASE_URL}/evidencias`);
            if (!evidenciasRes.ok) {
                throw new Error(`Error al obtener evidencias: ${evidenciasRes.status} ${evidenciasRes.statusText}`);
            }
            const evidenciasRaw = await evidenciasRes.json();

            // 3. Mapear la data de evidencias
            const mapEstudiantes = Object.keys(currentEstudiantesMap).length > 0 ? currentEstudiantesMap : estudiantesMap;
            const mapClases = Object.keys(currentClasesMap).length > 0 ? currentClasesMap : clasesMap;

            const mappedEvidencias = evidenciasRaw.map(ev => ({
                ...ev,
                id: ev.id,
                // Asume campos claseId/clase, estudianteId/estudiante, nombreArchivo
                Clase: mapClases[ev.claseId || ev.clase] || 'Clase no encontrada',
                Estudiante: mapEstudiantes[ev.estudianteId || ev.estudiante] || 'Estudiante no encontrado',
                FechaSubida: new Date(ev.fechaSubida || Date.now()).toLocaleDateString(),
                NombreArchivo: ev.nombreArchivo || 'Archivo sin nombre',
                URL: ev.url || ev.ruta || '#', // URL o ruta del archivo para la descarga
                Tipo: ev.mimeType || 'Archivo',
                Estado: ev.estado || 'Pendiente', // Asume un campo de estado
            }));

            setEvidenciasData(mappedEvidencias);

            // Calcular Stats
            const totalArchivos = mappedEvidencias.length;
            const tiposUnicos = new Set(mappedEvidencias.map(e => e.Tipo)).size;
            const pendientes = mappedEvidencias.filter(e => e.Estado === 'Pendiente').length;
            const totalRevisados = totalArchivos - pendientes;
            const porcentajeRevisado = totalArchivos > 0 ? (totalRevisados * 100 / totalArchivos).toFixed(1) : 0;

            setStatsData([
                { value: totalArchivos, label: 'Archivos Subidos', color: 'bg-indigo-500' },
                { value: tiposUnicos, label: 'Tipos de Archivos', color: 'bg-blue-500' },
                { value: pendientes, label: 'Pendientes de Revisión', color: 'bg-yellow-500' },
                { value: `${porcentajeRevisado}%`, label: 'Revisión Completada', color: 'bg-green-500' },
            ]);


        } catch (error) {
            console.error('Error cargando datos de evidencias:', error);
            setErrorMessage('Error al cargar evidencias. Verifique la conexión a la API o la estructura de datos.');
            setEvidenciasData([]);
            setStatsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvidenciasData();
    }, []);

    const getStatusClasses = (status) => {
        if (status === 'Revisado' || status === 'Aprobado') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Rechazado') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    // Función para determinar el ícono basado en el tipo de archivo (simplificado)
    const getFileIcon = (mimeType) => {
        if (mimeType.includes('image')) return '🖼️';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
        return '📦';
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <FormHeader
                        title="Evidencias de Curso"
                        subtitle="Gestione las evidencias subidas por los estudiantes de nivelación"
                    />
                    <div className="w-48 flex-shrink-0">
                        <PrimaryButton onClick={handleOpenModal}>
                            + Subir Evidencia
                        </PrimaryButton>
                    </div>
                </div>

                {errorMessage && (
                    <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700">
                        {errorMessage}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                    {loading ? (
                        <p className="text-center text-gray-500 col-span-full">Cargando estadísticas...</p>
                    ) : (
                        statsData.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                        ))
                    )}
                </div>


                {/* List of Evidences */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Archivos Recientes</h3>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <span className="mr-2">📤</span>
                            Exportar
                        </button>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando registros de evidencias...</p>
                        ) : evidenciasData.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay evidencias registradas.</p>
                        ) : (
                            evidenciasData.map((ev, index) => (
                                <div key={ev.id || index} className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4 flex-grow">
                                        <span className="text-xl p-2 bg-gray-100 rounded-md">{getFileIcon(ev.Tipo)}</span>
                                        <div className='flex-grow min-w-0'>
                                            <p className="font-semibold text-gray-800 truncate" title={ev.NombreArchivo}>{ev.NombreArchivo}</p>
                                            <p className="text-xs text-gray-500 truncate" title={`${ev.Estudiante} • ${ev.Clase}`}>{`Estudiante: ${ev.Estudiante} • Clase: ${ev.Clase}`}</p>
                                            <p className="text-xs text-gray-500">Subido: {ev.FechaSubida}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClasses(ev.Estado)}`}>
                                            {ev.Estado}
                                        </span>
                                        <a href={ev.URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
                                            ⬇️ Descargar
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL PARA SUBIR EVIDENCIA */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <SubirEvidencia
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </>
    );
};

export default EvidenciasCurso;