import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// Mock data for the evidence list
const mockEvidencias = [
    {
        title: 'Asistencia Curso Inducción - Semana 1',
        submitter: 'Juan Pérez',
        date: '2024-01-15',
        filename: 'asistencia_semana1.pdf',
        status: 'Aprobada',
    },
    {
        title: 'Evaluación Diagnóstica Matemáticas',
        submitter: 'María González',
        date: '2024-01-14',
        filename: 'eval_matematicas.pdf',
        status: 'Pendiente',
    },
    {
        title: 'Certificado Curso en Línea',
        submitter: 'Carlos López',
        date: '2024-01-13',
        filename: 'certificado_curso.pdf',
        status: 'Aprobada',
    },
];

// Mock data for the summary stats
const mockStats = [
    { value: 2, label: 'Evidencias Aprobadas', color: 'text-green-600' },
    { value: 1, label: 'Pendientes de Revisión', color: 'text-orange-500' },
    { value: 0, label: 'Evidencias Rechazadas', color: 'text-red-600' },
];

const EvidenciasCurso = () => {
    const getStatusClasses = (status) => {
        if (status === 'Aprobada') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <FormHeader title="Evidencias del Curso" subtitle="Gestione las evidencias del curso de inducción" />
                <div className="w-48 flex-shrink-0">
                    <PrimaryButton Icon={'📤'}>Subir Evidencia</PrimaryButton>
                </div>
            </div>

            {/* Evidence List */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Evidencias Registradas</h3>
                    <p className="text-sm text-gray-500">Lista de todas las evidencias del curso de inducción</p>
                </div>
                <div className="divide-y divide-gray-200">
                    {mockEvidencias.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl p-2 bg-gray-100 rounded-md">📄</span>
                                <div>
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500">{`${item.submitter} • ${item.date} • ${item.filename}`}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(item.status)}`}>
                                    {item.status}
                                </span>
                                <div className="flex space-x-3 text-gray-500">
                                    <button className="hover:text-blue-600">📥</button>
                                    <button className="hover:text-blue-600">👁️</button>
                                    <button className="hover:text-red-600">🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {mockStats.map((stat, index) => (
                    <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                ))}
            </div>
        </div>
    );
};

export default EvidenciasCurso;