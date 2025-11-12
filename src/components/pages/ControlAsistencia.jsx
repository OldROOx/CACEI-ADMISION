import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// MOCK DATA ELIMINADO: Usar [] para datos de lista y [] para stats.
const mockAsistencia = []; // Aquí se cargarán los Registros Recientes de /api/asistencia/resumen

// MOCK DATA ELIMINADO:
const mockStats = []; // Aquí se cargarán las estadísticas resumidas

const ControlAsistencia = () => {
    // Estas variables ahora serán alimentadas por la API (con un hook de estado/efecto)
    const asistenciaData = mockAsistencia;
    const statsData = mockStats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Control de Asistencia"
                    subtitle="Registre la asistencia de estudiantes a las clases de nivelación"
                />
                <div className="w-48 flex-shrink-0">
                    <PrimaryButton>
                        + Tomar Asistencia
                    </PrimaryButton>
                </div>
            </div>

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
                    {asistenciaData.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay registros de asistencia recientes.</p>
                    ) : (
                        asistenciaData.map((item, index) => {
                            const percentage = Math.round((item.presentes / item.total) * 100);
                            return (
                                <div key={index} className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xl p-2 bg-gray-100 rounded-md">📋</span>
                                        <div>
                                            {/* Usando nombres de campos de la API */}
                                            <p className="font-semibold text-gray-800">{item.clase}</p>
                                            <p className="text-xs text-gray-500">{`${item.instructor} • ${item.fecha} • ${item.hora}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                            {/* Usando nombres de campos de la API */}
                                            {`${item.presentes}/${item.total} presentes (${percentage}%)`}
                                        </span>
                                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                                            Ver Detalles
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {statsData.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-full">Cargando estadísticas...</p>
                ) : (
                    statsData.map((stat, index) => (
                        <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ControlAsistencia;