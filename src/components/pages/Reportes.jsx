import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import StatCard from '../atoms/StatCard';
import DistribucionBarChart from '../molecules/DistribucionBarChart';
import EfectividadPieChart from '../molecules/EfectividadPieChart';

const API_BASE_URL = '/api';

const Reportes = () => {
    // --- ESTADOS DE DATOS ---
    const [statsData, setStatsData] = useState([]);
    const [activityChartData, setActivityChartData] = useState([]);
    const [municipioChartData, setMunicipioChartData] = useState([]);
    const [preparatoriaChartData, setPreparatoriaChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Estado para alternar entre municipio y preparatoria
    const [vistaGrafico, setVistaGrafico] = useState('municipio'); // 'municipio' o 'preparatoria'

    // --- LÓGICA DE CARGA DE DATOS PARA REPORTES ---
    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                // 1. Obtener datos crudos de varios endpoints
                const [actividadesRes, docentesRes, estudiantesRes, preparatoriasRes, estadisticasEstRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/actividades`),
                    fetch(`${API_BASE_URL}/docentes`),
                    fetch(`${API_BASE_URL}/estudiantes`),
                    fetch(`${API_BASE_URL}/preparatorias`),
                    fetch(`${API_BASE_URL}/estudiantes/estadisticas`),
                ]);

                // Manejo básico de errores de respuesta
                if (!actividadesRes.ok || !docentesRes.ok || !estudiantesRes.ok || !preparatoriasRes.ok) {
                    throw new Error('Al menos una de las consultas de datos falló.');
                }

                const actividades = await actividadesRes.json();
                const docentes = await docentesRes.json();
                const estudiantes = await estudiantesRes.json();
                const preparatorias = await preparatoriasRes.json();
                const estadisticasEst = estadisticasEstRes.ok ? await estadisticasEstRes.json() : { porMunicipio: [], porPreparatoria: [] };

                // 2. Cálculo y Mapeo de Estadísticas Generales (StatsOverview)
                const totalActividades = actividades.length;
                const totalDocentes = docentes.length;
                const totalEstudiantes = estudiantes.length;
                const totalPreparatorias = preparatorias.length;

                // Calcular total de estudiantes alcanzados en todas las actividades
                const totalEstudiantesAlcanzados = actividades.reduce((sum, act) => {
                    return sum + (parseInt(act.EstudiantesAlcanzados) || 0);
                }, 0);

                setStatsData([
                    { value: totalActividades, label: 'Actividades Realizadas', color: 'bg-indigo-500' },
                    { value: totalDocentes, label: 'Docentes Activos', color: 'bg-blue-500' },
                    { value: totalPreparatorias, label: 'Preparatorias Registradas', color: 'bg-teal-500' },
                    { value: totalEstudiantesAlcanzados, label: 'Estudiantes Alcanzados', color: 'bg-pink-500' },
                ]);

                // 3. Mapeo para Gráfico de Barras: Distribución de Actividades por Tipo
                const tiposCount = actividades.reduce((acc, act) => {
                    const tipo = act.Tipo || 'Sin Tipo';
                    acc[tipo] = (acc[tipo] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.keys(tiposCount).map(key => ({
                    name: key,
                    value: tiposCount[key]
                }));

                setActivityChartData(chartData);

                // 4. Mapeo para Gráfico de Pastel: Estudiantes por Municipio
                const municipioData = estadisticasEst.porMunicipio.map(item => ({
                    name: item.Municipio || 'Sin especificar',
                    value: parseInt(item.cantidad) || 0
                }));
                setMunicipioChartData(municipioData);

                // 5. Mapeo para Gráfico de Pastel: Estudiantes por Preparatoria
                const preparatoriaData = estadisticasEst.porPreparatoria.map(item => ({
                    name: item.preparatoria || 'Sin especificar',
                    value: parseInt(item.cantidad) || 0
                }));
                setPreparatoriaChartData(preparatoriaData);

            } catch (error) {
                console.error('Error en la carga de reportes:', error);
                setErrorMessage(error.message || 'Error desconocido al cargar los reportes. Verifique la API.');
                setStatsData([]);
                setActivityChartData([]);
                setMunicipioChartData([]);
                setPreparatoriaChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Reportes y Analíticas"
                    subtitle="Visualización de métricas clave de promoción e inducción"
                    showBack={false}
                />
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <span className="mr-2">📤</span>
                    Exportar Reporte
                </button>
            </div>

            {errorMessage && (
                <div className="p-4 mb-4 rounded-lg text-sm bg-red-100 text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* 1. Métrica Global */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {loading ? (
                    <p className="text-center text-gray-500 col-span-full">Cargando métricas globales...</p>
                ) : (
                    statsData.map((stat, index) => (
                        <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                    ))
                )}
            </div>

            {/* 2. Gráficos de Promoción */}
            <h2 className="text-xl font-semibold text-gray-700 pt-4 border-t">Métricas de Promoción</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Distribución de Actividades (Bar Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Actividades por Tipo</h3>
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando datos para el gráfico...</p>
                    ) : activityChartData.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No hay actividades registradas aún.</p>
                    ) : (
                        <DistribucionBarChart data={activityChartData} />
                    )}
                </div>

                {/* Distribución de Estudiantes por Municipio/Preparatoria (Pie Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Distribución de Estudiantes por {vistaGrafico === 'municipio' ? 'Municipio' : 'Preparatoria'}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setVistaGrafico('municipio')}
                                className={`px-3 py-1 text-xs font-medium rounded ${
                                    vistaGrafico === 'municipio'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                📍 Municipio
                            </button>
                            <button
                                onClick={() => setVistaGrafico('preparatoria')}
                                className={`px-3 py-1 text-xs font-medium rounded ${
                                    vistaGrafico === 'preparatoria'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                🏫 Preparatoria
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando datos para el gráfico...</p>
                    ) : (vistaGrafico === 'municipio' ? municipioChartData : preparatoriaChartData).length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No hay datos suficientes para mostrar.</p>
                    ) : (
                        <EfectividadPieChart data={vistaGrafico === 'municipio' ? municipioChartData : preparatoriaChartData} />
                    )}
                </div>
            </div>

            {/* 3. Tabla de Actividades Recientes */}
            <h2 className="text-xl font-semibold text-gray-700 pt-4 border-t">Actividades Recientes</h2>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Cargando actividades recientes...</p>
                ) : (
                    <ActividadesRecientesTable />
                )}
            </div>
        </div>
    );
};

// Componente auxiliar para mostrar tabla de actividades recientes
const ActividadesRecientesTable = () => {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/actividades`);
                if (response.ok) {
                    const data = await response.json();
                    setActividades(data.slice(0, 10));
                }
            } catch (error) {
                console.error('Error cargando actividades:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActividades();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500 py-4">Cargando...</p>;
    }

    if (actividades.length === 0) {
        return <p className="text-center text-gray-400 py-4">No hay actividades registradas.</p>;
    }

    const getTipoBadge = (tipo) => {
        const badges = {
            'Visitada': 'bg-blue-100 text-blue-800',
            'Invitada': 'bg-purple-100 text-purple-800',
            'Digital': 'bg-green-100 text-green-800'
        };
        return badges[tipo] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Docente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preparatoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estudiantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evidencias
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {actividades.map((actividad) => (
                    <tr key={actividad.ActividadID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(actividad.Fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoBadge(actividad.Tipo)}`}>
                                    {actividad.Tipo}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {actividad.DocenteNombre || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            {actividad.PreparatoriaNombre || 'Digital/N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {actividad.EstudiantesAlcanzados}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {actividad.EvidenciasURL ? (
                                <span className="text-green-600">✓ {actividad.EvidenciasURL.split(',').length}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reportes;