import React from 'react';
import EfectividadPieChart from '../molecules/EfectividadPieChart';
// ASUME que DistribucionBarChart.jsx ha sido creado
// import DistribucionBarChart from '../molecules/DistribucionBarChart';

// Datos simulados ELIMINADOS: Usar [] para datos de resumen.
const summaryData = []; // Aquí se cargarán los datos del resumen mensual

const Reportes = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
                    <p className="text-gray-500 mt-1">
                        Análisis de efectividad de promoción e inducción educativa - {currentYear}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <span className="mr-2">📊</span>
                        Filtros
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <span className="mr-2">📤</span>
                        Exportar
                    </button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Efectividad por Preparatoria</h3>
                    <p className="text-sm text-gray-500 mb-4">Número de estudiantes alcanzados y porcentaje de efectividad</p>
                    <EfectividadPieChart data={[]} /> {/* Pasa datos vacíos */}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Distribución por Carrera</h3>
                    <p className="text-sm text-gray-500 mb-4">Interés de estudiantes por programa académico</p>
                    <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                        {/* Cuando se implemente DistribucionBarChart, se usará aquí: <DistribucionBarChart data={[]}/> */}
                        <p>Gráfico de Barras - Cargando datos...</p>
                    </div>
                </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-800">Resumen Mensual</h3>
                <p className="text-sm text-gray-500 mb-4">Actividades realizadas este mes</p>
                <div className="space-y-4">
                    {summaryData.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Cargando resumen mensual...</p>
                    ) : (
                        summaryData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-3">
                                <div>
                                    <p className="font-medium text-gray-700">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                                </div>
                                <p className={`text-2xl font-semibold ${item.color}`}>{item.value}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reportes;