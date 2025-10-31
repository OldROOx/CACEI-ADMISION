import React from 'react';
import EfectividadPieChart from '../molecules/EfectividadPieChart';

const summaryData = [
    { title: 'Actividades de Promoción', subtitle: 'Presentaciones realizadas', value: 42, color: 'text-blue-600' },
    { title: 'Clases de Nivelación', subtitle: 'Sesiones completadas', value: 28, color: 'text-purple-600' },
    { title: 'Evidencias Subidas', subtitle: 'Documentos registrados', value: 156, color: 'text-gray-800' },
    { title: 'Nuevos Registros', subtitle: 'Docentes y preparatorias', value: 12, color: 'text-green-600' },
];

const Reportes = () => {
    // --- NUEVO: Obtener el año actual ---
    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-6">
            {/* Header --- MODIFICADO --- */}
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

            {/* Charts Grid (sin cambios) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Efectividad por Preparatoria</h3>
                    <p className="text-sm text-gray-500 mb-4">Número de estudiantes alcanzados y porcentaje de efectividad</p>
                    <EfectividadPieChart />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Distribución por Carrera</h3>
                    <p className="text-sm text-gray-500 mb-4">Interés de estudiantes por programa académico</p>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>Próximamente: Gráfico de Barras</p>
                    </div>
                </div>
            </div>

            {/* Monthly Summary (sin cambios) */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-800">Resumen Mensual</h3>
                <p className="text-sm text-gray-500 mb-4">Actividades realizadas este mes</p>
                <div className="space-y-4">
                    {summaryData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-3">
                            <div>
                                <p className="font-medium text-gray-700">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.subtitle}</p>
                            </div>
                            <p className={`text-2xl font-semibold ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reportes;