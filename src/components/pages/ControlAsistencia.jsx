import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';
import Modal from '../organisms/Modal'; // Asumimos que este componente existe
// import TomarAsistencia from './TomarAsistencia'; // Necesitamos crear este archivo
import SecondaryButton from '../atoms/SecondaryButton'; // Necesario para el modal

const API_BASE_URL = '/api';

const ControlAsistencia = () => {
    // --- ESTADOS PARA LA DATA REAL ---
    const [asistenciaData, setAsistenciaData] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Para resolver IDs a nombres
    const [docentesMap, setDocentesMap] = useState({});
    const [classesMap, setClassesMap] = useState({});

    // --- ESTADO PARA EL MODAL DE TOMAR ASISTENCIA ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Recargar datos al cerrar el modal (asumiendo que se guardó algo)
        fetchAsistenciaData();
    };

    // --- LÓGICA DE CARGA DE DATOS DE LA API ---
    const fetchAsistenciaData = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            // 1. Obtener Docentes y Clases para mapear IDs
            const [docentesRes, clasesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/docentes`), //
                fetch(`${API_BASE_URL}/clases`),   //
            ]);

            const docentesRaw = docentesRes.ok ? await docentesRes.json() : [];
            const clasesRaw = clasesRes.ok ? await clasesRes.json() : [];

            // Mapear Docentes (Asume estructura { id, Nombre, Apellidos })
            const dMap = docentesRaw.reduce((acc, d) => {
                acc[d.id] = `${d.Nombre} ${d.Apellidos}`;
                return acc;
            }, {});
            setDocentesMap(dMap);

            // Mapear Clases (Asume estructura { id, nombre, materia })
            const cMap = clasesRaw.reduce((acc, c) => {
                acc[c.id] = c.nombre || c.materia || 'Clase Desconocida';
                return acc;
            }, {});
            setClassesMap(cMap);

            // 2. Obtener Registros de Asistencia
            // Se asume que /api/asistencia devuelve los registros de asistencia resumidos
            const asistenciaRes = await fetch(`${API_BASE_URL}/asistencia`);
            if (!asistenciaRes.ok) {
                throw new Error(`Error al obtener asistencia: ${asistenciaRes.status} ${asistenciaRes.statusText}`);
            }
            const asistenciaRaw = await asistenciaRes.json();

            // 3. Mapear y calcular datos para la UI
            const mappedAsistencia = asistenciaRaw.map(item => {
                // Asume que item tiene campos como claseId/clase, docenteId/instructor
                const classTitle = cMap[item.claseId || item.clase] || 'Clase Desconocida';
                const instructorName = dMap[item.docenteId || item.instructor] || 'Instructor Desconocido';

                const presentes = item.presentes || 0;
                const total = item.total || 0;
                const percentage = total > 0 ? Math.round((presentes / total) * 100) : 0;

                return {
                    ...item,
                    clase: classTitle,
                    instructor: instructorName,
                    fecha: new Date(item.fecha || item.Fecha).toLocaleDateString() || 'N/A',
                    hora: item.hora || item.Hora || 'N/A',
                    presentes: presentes,
                    total: total,
                    percentage: percentage,
                };
            }).slice(0, 10); // Mostrar solo los 10 más recientes si la API no lo limita

            setAsistenciaData(mappedAsistencia);

            // Calcular Stats
            const totalRegistros = mappedAsistencia.length;
            const totalPresentes = mappedAsistencia.reduce((sum, item) => sum + item.presentes, 0);
            const totalEstudiantes = mappedAsistencia.reduce((sum, item) => sum + item.total, 0);
            const avgAttendance = totalEstudiantes > 0 ? Math.round((totalPresentes / totalEstudiantes) * 100) : 0;

            setStatsData([
                { value: totalRegistros, label: 'Registros Recientes', color: 'bg-indigo-500' },
                { value: totalEstudiantes, label: 'Estudiantes en Registros', color: 'bg-blue-500' },
                { value: totalPresentes, label: 'Total Asistencias', color: 'bg-green-500' },
                { value: `${avgAttendance}%`, label: 'Asistencia Promedio', color: 'bg-yellow-500' },
            ]);


        } catch (error) {
            console.error('Error cargando datos de asistencia:', error);
            setErrorMessage('Error al cargar datos. Verifique la API o la estructura de datos.');
            setAsistenciaData([]);
            setStatsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAsistenciaData();
    }, []);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <FormHeader
                        title="Control de Asistencia"
                        subtitle="Registre la asistencia de estudiantes a las clases de nivelación"
                    />
                    <div className="w-48 flex-shrink-0">
                        <PrimaryButton onClick={handleOpenModal}>
                            + Tomar Asistencia
                        </PrimaryButton>
                    </div>
                </div>

                {errorMessage && (
                    <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700">
                        {errorMessage}
                    </div>
                )}

                {/* Recent Records List */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Registros Recientes</h3>
                            <p className="text-sm text-gray-500">Últimos registros de asistencia</p>
                        </div>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <span className="mr-2">📤</span>
                            Exportar
                        </button>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando registros de asistencia...</p>
                        ) : asistenciaData.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay registros de asistencia recientes.</p>
                        ) : (
                            asistenciaData.map((item, index) => (
                                <div key={item.id || index} className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xl p-2 bg-gray-100 rounded-md">📋</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.clase}</p>
                                            <p className="text-xs text-gray-500">{`${item.instructor} • ${item.fecha} • ${item.hora}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                            {`${item.presentes}/${item.total} presentes (${item.percentage}%)`}
                                        </span>
                                        <button className="text-sm font-medium text-blue-600 hover:underline">
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

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

            </div>

            {/* MODAL PARA TOMAR ASISTENCIA */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {/* Aquí iría el componente TomarAsistencia.jsx, que definiremos a continuación
                  Requieres crear un archivo ProgramarClase.jsx que te proporcioné antes,
                  y un archivo TomarAsistencia.jsx ahora.
                */}
                <TomarAsistenciaForm
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </>
    );
};

// Placeholder temporal para el nuevo formulario de asistencia
const TomarAsistenciaForm = ({ PrimaryButtonComponent, SecondaryButtonComponent, onSuccess }) => {
    const [isLoad, setIsLoad] = useState(true);
    useEffect(() => {
        // Simular carga de catálogos y clases disponibles
        setTimeout(() => setIsLoad(false), 500);
    }, []);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <FormHeader
                title="Tomar Asistencia (Fase 1)"
                subtitle="Seleccione la clase para registrar la asistencia de los estudiantes."
            />
            {isLoad ? (
                <div className="text-center text-gray-500 py-8">Preparando selección de clases...</div>
            ) : (
                <>
                    <div className="space-y-6">
                        <FormSection title="Clase de Nivelación" icon="📖">
                            <FormField label="Seleccionar Clase" name="ClaseID" type="select" required={true} value={''} onChange={() => {}} disabled={true}>
                                <option value="">-- Seleccione una clase programada (*) --</option>
                                <option value="mock-1">Clase de Matemáticas (15/11/2025)</option>
                                <option value="mock-2">Clase de Física (16/11/2025)</option>
                            </FormField>
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm">
                                Nota: El formulario completo (Fase 2) se implementará en el siguiente paso.
                            </div>
                        </FormSection>
                    </div>
                    <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
                        <SecondaryButtonComponent type="button" onClick={onSuccess}>
                            Cancelar
                        </SecondaryButtonComponent>
                        <PrimaryButtonComponent type="submit" disabled={true}>
                            Continuar (Deshabilitado)
                        </PrimaryButtonComponent>
                    </div>
                </>
            )}
        </div>
    );
}

export default ControlAsistencia;