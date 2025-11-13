import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';
import Modal from '../organisms/Modal';
// Asumo que ProgramarClase y SecondaryButton están disponibles o importados
import ProgramarClase from './ProgramarClase';
import SecondaryButton from '../atoms/SecondaryButton';

const API_BASE_URL = '/api';

const ClasesNivelacion = () => {
    // --- ESTADOS PARA LA DATA REAL ---
    const [clasesData, setClasesData] = useState([]);
    const [docentesMap, setDocentesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // --- ESTADO PARA EL MODAL DE PROGRAMAR CLASE ---
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Recargar datos al cerrar el modal (asumiendo que se guardó algo)
        fetchClasesData();
    };


    // --- LÓGICA DE CARGA DE DATOS DE LA API ---
    const fetchClasesData = async () => {
        setLoading(true);
        setErrorMessage('');
        let currentDocentesMap = {};
        try {
            // 1. Obtener Docentes para mapear ID a Nombre
            const docentesRes = await fetch(`${API_BASE_URL}/docentes`); //
            if (docentesRes.ok) {
                const fetchedDocentes = await docentesRes.json();
                currentDocentesMap = fetchedDocentes.reduce((acc, docente) => {
                    // Se asume que el ID del docente es 'id' y el nombre es 'Nombre' y 'Apellidos'
                    acc[docente.id] = `${docente.Nombre} ${docente.Apellidos}`;
                    return acc;
                }, {});
                setDocentesMap(currentDocentesMap);
            } else {
                console.warn('Advertencia: No se pudieron cargar los docentes.');
            }

            // 2. Obtener Clases
            const clasesRes = await fetch(`${API_BASE_URL}/clases`); //
            if (!clasesRes.ok) {
                throw new Error(`Error al obtener clases: ${clasesRes.status} ${clasesRes.statusText}`);
            }
            const data = await clasesRes.json();

            // 3. Mapear la data de clases con el nombre del docente
            const mapToUse = Object.keys(currentDocentesMap).length > 0 ? currentDocentesMap : docentesMap;
            const mappedClases = data.map(clase => ({
                ...clase,
                // Asume que el ID del docente en la clase es 'docenteId' o 'DocenteID'
                DocenteNombreCompleto: mapToUse[clase.docenteId || clase.DocenteID] || 'Docente no asignado',
                Titulo: clase.nombre || clase.materia || 'Clase sin título',
                Status: clase.estado || 'Programada', // Asume un campo de estado
                Fecha: new Date(clase.fecha).toLocaleDateString() || 'N/A',
                // enrollment se calcularía o se asumiría de campos de la API
                enrollment: `${clase.inscritos || 0} / ${clase.capacidad || 0} estudiantes`,
            }));

            setClasesData(mappedClases);

        } catch (error) {
            console.error('Error cargando datos de nivelación:', error);
            setErrorMessage('Error al cargar clases. Verifique la conexión a la API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasesData();
    }, []);

    // --- LÓGICA DERIVADA DEL ESTADO (Métricas) ---
    const clases = clasesData;

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Programada':
                return 'bg-blue-100 text-blue-800';
            case 'Completada':
                return 'bg-green-100 text-green-800';
            case 'Cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calcular estadísticas resumidas
    const totalClases = clases.length;
    const programadas = clases.filter(c => c.Status === 'Programada').length;
    const completadas = clases.filter(c => c.Status === 'Completada').length;

    const statsDataCalculated = [
        { value: totalClases, label: 'Total de Clases', color: 'bg-indigo-500' },
        { value: completadas, label: 'Clases Completadas', color: 'bg-green-500' },
        { value: programadas, label: 'Clases Programadas', color: 'bg-blue-500' },
        { value: 'N/A', label: 'Estudiantes Inscritos', color: 'bg-yellow-500' },
    ];


    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <FormHeader
                        title="Clases de Nivelación"
                        subtitle="Administre las clases de nivelación para estudiantes"
                    />
                    <div className="w-48 flex-shrink-0">
                        {/* CONEXIÓN DEL BOTÓN CON EL MODAL */}
                        <PrimaryButton onClick={handleOpenModal}>
                            + Programar Clase
                        </PrimaryButton>
                    </div>
                </div>

                {errorMessage && (
                    <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700">
                        {errorMessage}
                    </div>
                )}

                {/* List of Classes */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8 bg-white p-6 rounded-xl shadow-md border">Cargando clases de nivelación...</p>
                    ) : clases.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 bg-white p-6 rounded-xl shadow-md border">No hay clases de nivelación programadas.</p>
                    ) : (
                        clases.map((clase, index) => (
                            <div key={clase.id || index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <div className="flex justify-between items-start">
                                    {/* Class Info */}
                                    <div>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <span className="text-xl">📖</span>
                                            <h2 className="text-lg font-semibold text-gray-800">{clase.Titulo}</h2>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(clase.Status)}`}>
                                                {clase.Status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                            <p>📅 {clase.Fecha}</p>
                                            <p>📍 {clase.ubicacion || 'Virtual/Por definir'}</p>
                                            <p>🧑‍🎓 {clase.enrollment}</p>
                                            <p className="col-span-2">👨‍🏫 {clase.DocenteNombreCompleto}</p>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Ver Detalles
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                    {loading ? (
                        <p className="text-center text-gray-500 col-span-full">Cargando estadísticas...</p>
                    ) : (
                        statsDataCalculated.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                        ))
                    )}
                </div>

            </div>

            {/* MODAL PARA PROGRAMAR CLASE */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ProgramarClase
                    PrimaryButtonComponent={PrimaryButton}
                    SecondaryButtonComponent={SecondaryButton}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </>
    );
};

export default ClasesNivelacion;