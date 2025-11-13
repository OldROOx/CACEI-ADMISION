import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import StatCard from '../atoms/StatCard';
import DistribucionBarChart from '../molecules/DistribucionBarChart'; // Asumido
import EfectividadPieChart from '../molecules/EfectividadPieChart';   // Asumido

const API_BASE_URL = '/api';

const Reportes = () => {
    // --- ESTADOS DE DATOS ---
    const [statsData, setStatsData] = useState([]);
    const [activityChartData, setActivityChartData] = useState([]);
    const [gradePieData, setGradePieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // --- LÓGICA DE CARGA DE DATOS PARA REPORTES ---
    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                // 1. Obtener datos crudos de varios endpoints
                const [actividadesRes, calificacionesRes, docentesRes, estudiantesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/actividades`),
                    fetch(`${API_BASE_URL}/calificaciones`),
                    fetch(`${API_BASE_URL}/docentes`),
                    fetch(`${API_BASE_URL}/estudiantes`),
                ]);

                // Manejo básico de errores de respuesta
                if (!actividadesRes.ok || !calificacionesRes.ok || !docentesRes.ok || !estudiantesRes.ok) {
                    throw new Error('Al menos una de las consultas de datos falló.');
                }

                const actividades = await actividadesRes.json();
                const calificaciones = await calificacionesRes.json();
                const docentes = await docentesRes.json();
                const estudiantes = await estudiantesRes.json();

                // 2. Cálculo y Mapeo de Estadísticas Generales (StatsOverview)
                const totalActividades = actividades.length;
                const totalDocentes = docentes.length;
                const totalEstudiantes = estudiantes.length;
                const promedioGeneral = calificaciones.length > 0
                    ? calificaciones.reduce((sum, c) => sum + (c.valor || c.calificacion || 0), 0) / calificaciones.length
                    : 0;

                setStatsData([
                    { value: totalActividades, label: 'Actividades Realizadas', color: 'bg-indigo-500' },
                    { value: totalDocentes, label: 'Docentes en Catálogo', color: 'bg-blue-500' },
                    { value: totalEstudiantes, label: 'Estudiantes Registrados', color: 'bg-teal-500' },
                    { value: promedioGeneral.toFixed(2), label: 'Promedio General (Nivelación)', color: 'bg-pink-500' },
                ]);

                // 3. Mapeo para Gráfico de Barras: Distribución de Actividades por Tipo
                const tipos = actividades.reduce((acc, act) => {
                    const tipo = act.tipo || 'Sin Tipo';
                    acc[tipo] = (acc[tipo] || 0) + 1;
                    return acc;
                }, {});
                setActivityChartData(Object.keys(tipos).map(key => ({
                    name: key,
                    value: tipos[key]
                })));

                // 4. Mapeo para Gráfico de Pastel: Efectividad de Nivelación
                const aprobados = calificaciones.filter(c => (c.valor || c.calificacion) >= 70).length;
                const reprobados = calificaciones.filter(c => (c.valor || c.calificacion) < 70 && (c.valor || c.calificacion) >= 1).length;
                const pendientes = calificaciones.filter(c => !c.valor && !c.calificacion).length;

                setGradePieData([
                    { name: 'Aprobados', value: aprobados, color: 'bg-green-500' },
                    { name: 'Reprobados', value: reprobados, color: 'bg-red-500' },
                    { name: 'Pendientes', value: pendientes, color: 'bg-yellow-500' },
                ]);


            } catch (error) {
                console.error('Error en la carga de reportes:', error);
                setErrorMessage(error.message || 'Error desconocido al cargar los reportes. Verifique la API.');
                setStatsData([]);
                setActivityChartData([]);
                setGradePieData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    // Función de ayuda para simular la renderización de un componente
    const renderChartPlaceholder = (title) => (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {loading ? (
                <p className="text-center text-gray-500 py-8">Cargando datos para el gráfico...</p>
            ) : errorMessage ? (
                <p className="text-center text-red-500 py-4">{errorMessage}</p>
            ) : (
                <p className="text-center text-gray-500 py-4">Visualización de gráfico no disponible. Datos cargados para: {title}</p>
                // AQUÍ iría el componente real, ej: <DistribucionBarChart data={activityChartData} />
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Reportes y Analíticas"
                    subtitle="Visualización de métricas clave de promoción e inducción"
                />
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
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            {/* Reemplazar con <DistribucionBarChart data={activityChartData} /> */}
                            Gráfico de Barras con {activityChartData.length} tipos de actividad cargados.
                        </p>
                    )}
                </div>

                {/* Pendiente: Gráfico de Efectividad de Promoción */}
                {renderChartPlaceholder('Efectividad de Promoción (Tasa de Inscripción vs. Meta)')}
            </div>

            {/* 3. Gráficos de Inducción */}
            <h2 className="text-xl font-semibold text-gray-700 pt-4 border-t">Métricas de Inducción y Nivelación</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Efectividad de Calificación (Pie Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Efectividad de Nivelación (Aprobados/Reprobados)</h3>
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Cargando datos para el gráfico...</p>
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            {/* Reemplazar con <EfectividadPieChart data={gradePieData} /> */}
                            Gráfico de Pastel con {gradePieData.length} categorías de calificación cargadas.
                        </p>
                    )}
                </div>

                {/* Pendiente: Gráfico de Asistencia por Clase */}
                {renderChartPlaceholder('Tasa de Asistencia por Clase')}
            </div>

        </div>
    );
};

export default Reportes;