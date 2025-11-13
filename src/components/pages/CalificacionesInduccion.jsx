import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';
import Modal from '../organisms/Modal';
import SecondaryButton from '../atoms/SecondaryButton';

const API_BASE_URL = '/api';

// --- Placeholder para el futuro formulario de registro/edición de calificaciones ---
// NOTA: Este componente debe ser creado en un archivo aparte (RegistrarCalificacion.jsx)
const RegistrarCalificacionForm = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {
    const [isLoad, setIsLoad] = useState(true);
    useEffect(() => {
        setTimeout(() => setIsLoad(false), 500); // Simular carga de catálogos
    }, []);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Registrar / Editar Calificación"
                subtitle="Funcionalidad pendiente: Aquí se implementará la lógica de POST/PUT a /api/calificaciones."
            />
            {isLoad ? (
                <div className="text-center text-gray-500 py-8">Cargando opciones de estudiantes y clases...</div>
            ) : (
                <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
                    <p className="text-sm text-gray-600 self-center">Conexión de formulario pendiente.</p>
                    <SecondaryButtonComponent type="button" onClick={onSuccess}>
                        Cerrar
                    </SecondaryButtonComponent>
                    <PrimaryButtonComponent type="button" disabled={true}>
                        Guardar Calificación
                    </PrimaryButtonComponent>
                </div>
            )}
        </div>
    );
}
// --- FIN DEL PLACEHOLDER ---


const CalificacionesInduccion = () => {
    // --- ESTADOS PARA LA DATA REAL ---
    const [calificacionesData, setCalificacionesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Mapas para resolver IDs a nombres
    const [estudiantesMap, setEstudiantesMap] = useState({});
    const [clasesMap, setClasesMap] = useState({});

    // --- ESTADO PARA EL MODAL DE REGISTRAR CALIFICACIÓN ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        fetchCalificacionesData(); // Recargar datos al cerrar
    };


    // --- LÓGICA DE CARGA DE DATOS DE LA API ---
    const fetchCalificacionesData = async () => {
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
                acc[e.id] = `${e.Nombre} ${e.Apellidos} (${e.Matricula || 'N/A'})`;
                return acc;
            }, {});
            setEstudiantesMap(currentEstudiantesMap);

            currentClasesMap = clasesRaw.reduce((acc, c) => {
                acc[c.id] = c.nombre || c.materia || 'Clase Desconocida';
                return acc;
            }, {});
            setClasesMap(currentClasesMap);

            // 2. Obtener Calificaciones
            // Petición al endpoint /api/calificaciones
            const calificacionesRes = await fetch(`${API_BASE_URL}/calificaciones`);
            if (!calificacionesRes.ok) {
                throw new Error(`Error al obtener calificaciones: ${calificacionesRes.status} ${calificacionesRes.statusText}`);
            }
            const calificacionesRaw = await calificacionesRes.json();

            // 3. Mapear la data de calificaciones
            const mappedCalificaciones = calificacionesRaw.map(cal => ({
                ...cal,
                // Asume campos calificacionId/claseId, estudianteId/estudiante, valor/calificacion
                id: cal.id,
                Clase: currentClasesMap[cal.claseId || cal.clase] || 'Clase no encontrada',
                Estudiante: currentEstudiantesMap[cal.estudianteId || cal.estudiante] || 'Estudiante no encontrado',
                Calificacion: cal.valor || cal.calificacion || 'N/A',
                Status: cal.valor >= 70 ? 'Aprobado' : (cal.valor >= 1 && cal.valor < 70 ? 'Reprobado' : 'Pendiente'),
                FechaRegistro: new Date(cal.fecha || Date.now()).toLocaleDateString(),
            }));

            setCalificacionesData(mappedCalificaciones);

            // Calcular Stats (Simples: Total, Aprobados, Reprobados, Promedio)
            const totalRegistros = mappedCalificaciones.length;
            const aprobados = mappedCalificaciones.filter(c => c.Status === 'Aprobado').length;
            const reprobados = mappedCalificaciones.filter(c => c.Status === 'Reprobado').length;
            const promedio = mappedCalificaciones.filter(c => typeof c.Calificacion === 'number').reduce((sum, c) => sum + c.Calificacion, 0) / (aprobados + reprobados) || 0;

            setStatsData([
                { value: totalRegistros, label: 'Total Calificaciones', color: 'bg-indigo-500' },
                { value: aprobados, label: 'Aprobados (>=70)', color: 'bg-green-500' },
                { value: reprobados, label: 'Reprobados (<70)', color: 'bg-red-500' },
                { value: promedio.toFixed(1), label: 'Promedio General', color: 'bg-yellow-500' },
            ]);


        } catch (error) {
            console.error('Error cargando datos de calificaciones:', error);
            setErrorMessage('Error al cargar calificaciones. Verifique la conexión a la API o la estructura de datos.');
            setCalificacionesData([]);
            setStatsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalificacionesData();
    }, []);

    const getStatusClasses = (status) => {
        if (status === 'Aprobado') return 'bg-green-100 text-green-800';
        if (status === 'Reprobado') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    // Lógica para el botón de editar/registrar (asumo un solo modal para ambas acciones por ahora)

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <FormHeader
                        title="Calificaciones de Inducción"
                        subtitle="Consulte y registre los resultados de las evaluaciones de nivelación"
                    />
                    <div className="w-48 flex-shrink-0">
                        <PrimaryButton onClick={handleOpenModal}>
                            + Registrar Calificación
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


                {/* List of Grades */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Registros de Calificaciones</h3>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <span className="mr-2">📤</span>
                            Exportar
                        </button>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando registros de calificaciones...</p>
                        ) : calificacionesData.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay calificaciones registradas.</p>
                        ) : (
                            calificacionesData.map((cal, index) => (
                                <div key={cal.id || index} className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4 flex-grow">
                                        <span className="text-xl p-2 bg-gray-100 rounded-md">⭐</span>
                                        <div className='flex-grow min-w-0'>
                                            <p className="font-semibold text-gray-800 truncate" title={cal.Estudiante}>{cal.Estudiante}</p>
                                            <p className="text-xs text-gray-500 truncate" title={cal.Clase}>{`Clase: ${cal.Clase} • Fecha: ${cal.FechaRegistro}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClasses(cal.Status)}`}>
                                            {cal.Calificacion} pts - {cal.Status}
                                        </span>
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                            ✏️ Editar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL PARA REGISTRAR CALIFICACIÓN */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <RegistrarCalificacionForm
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </>
    );
};

export default CalificacionesInduccion;