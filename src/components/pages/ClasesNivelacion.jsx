import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// Mock data for the classes
const mockClases = [
    {
        title: 'Matemáticas Básicas',
        status: 'Programada',
        date: '2024-01-20',
        time: '09:00 (2 horas)',
        location: 'Aula 101',
        enrollment: '25/30 estudiantes',
        instructor: 'Dr. Juan Martínez',
    },
    {
        title: 'Física Fundamental',
        status: 'Completada',
        date: '2024-01-18',
        time: '14:00 (1.5 horas)',
        location: 'Lab. Física',
        enrollment: '18/20 estudiantes',
        instructor: 'Dra. Ana López',
    },
    {
        title: 'Química General',
        status: 'Programada',
        date: '2024-01-22',
        time: '11:00 (2 horas)',
        location: 'Lab. Química',
        enrollment: '22/25 estudiantes',
        instructor: 'Dr. Carlos Ruiz',
    },
];

// Mock data for the summary stats
const mockStats = [
    { value: 2, label: 'Programadas', color: 'text-blue-600' },
    { value: 1, label: 'Completadas', color: 'text-green-600' },
    { value: 65, label: 'Total Inscritos', color: 'text-gray-800' },
    { value: '87%', label: 'Ocupación', color: 'text-purple-600' },
];

const ClasesNivelacion = () => {
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Programada':
                return 'bg-blue-100 text-blue-800';
            case 'Completada':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader
                    title="Clases de Nivelación"
                    subtitle="Administre las clases de nivelación para estudiantes"
                />
                <div className="w-48 flex-shrink-0">
                    <PrimaryButton>
                        + Programar Clase
                    </PrimaryButton>
                </div>
            </div>

            {/* List of Classes */}
            <div className="space-y-4">
                {mockClases.map((clase, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex justify-between items-start">
                            {/* Class Info */}
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-xl">📖</span>
                                    <h2 className="text-lg font-semibold text-gray-800">{clase.title}</h2>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(clase.status)}`}>
                                        {clase.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                    <p>📅 {clase.date}</p>
                                    <p>🕚 {clase.time}</p>
                                    <p>📍 {clase.location}</p>
                                    <p>🧑‍🎓 {clase.enrollment}</p>
                                    <p className="col-span-2">👨‍🏫 {clase.instructor}</p>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Ver Detalles
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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

export default ClasesNivelacion;