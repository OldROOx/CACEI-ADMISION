import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// Mock data for the attendance records
const mockAsistencia = [
    {
        clase: 'Matemáticas Básicas',
        instructor: 'Dr. Juan Martínez',
        fecha: '2024-01-18',
        hora: '09:00',
        presentes: 28,
        total: 30,
    },
    {
        clase: 'Física Fundamental',
        instructor: 'Dra. Ana López',
        fecha: '2024-01-17',
        hora: '14:00',
        presentes: 18,
        total: 20,
    },
    {
        clase: 'Química General',
        instructor: 'Dr. Carlos Ruiz',
        fecha: '2024-01-16',
        hora: '11:00',
        presentes: 21,
        total: 22,
    },
];

// Mock data for the summary stats
const mockStats = [
    { value: '89%', label: 'Asistencia Promedio', color: 'text-green-600' },
    { value: 156, label: 'Estudiantes Activos', color: 'text-blue-600' },
    { value: 12, label: 'Clases Esta Semana', color: 'text-purple-600' },
    { value: 3, label: 'Materias Activas', color: 'text-orange-500' },
];

const ControlAsistencia = () => {
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
                    {mockAsistencia.map((item, index) => {
                        const percentage = Math.round((item.presentes / item.total) * 100);
                        return (
                            <div key={index} className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-xl p-2 bg-gray-100 rounded-md">📋</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.clase}</p>
                                        <p className="text-xs text-gray-500">{`${item.instructor} • ${item.fecha} • ${item.hora}`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                        {`${item.presentes}/${item.total} presentes (${percentage}%)`}
                                    </span>
                                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                                        Ver Detalles
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {mockStats.map((stat, index) => (
                    <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                ))}
            </div>
        </div>
    );
};

export default ControlAsistencia;