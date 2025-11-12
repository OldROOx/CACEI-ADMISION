import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// MOCK DATA ELIMINADO: Usar [] para datos de lista y [] para stats.
const mockEvidencias = []; // Aquí se cargará la lista de evidencias desde la API

// MOCK DATA ELIMINADO:
const mockStats = []; // Aquí se cargarán las estadísticas de evidencias

const EvidenciasCurso = () => {
    const evidenciasData = mockEvidencias;
    const statsData = mockStats;

    const getStatusClasses = (status) => {
        // Mapear los ENUMs de la DB a clases de Tailwind
        if (status === 'Aprobado') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Rechazado') return 'bg-red-100 text-red-800';
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
                    {evidenciasData.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay evidencias registradas.</p>
                    ) : (
                        evidenciasData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl p-2 bg-gray-100 rounded-md">📄</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.Titulo}</p>
                                        {/* Usando EstudianteNombre y ArchivoURL que vendrán de la API */}
                                        <p className="text-xs text-gray-500">{`${item.EstudianteNombre || 'Estudiante'} • ${item.Fecha} • ${item.ArchivoURL ? item.ArchivoURL.split('/').pop() : 'N/A'}`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(item.Status)}`}>
                                        {item.Status}
                                    </span>
                                    <div className="flex space-x-3 text-gray-500">
                                        <button className="hover:text-blue-600">📥</button>
                                        <button className="hover:text-blue-600">👁️</button>
                                        <button className="hover:text-red-600">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {statsData.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-full">Cargando estadísticas de revisión...</p>
                ) : (
                    statsData.map((stat, index) => (
                        <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                    ))
                )}
            </div>
        </div>
    );
};

export default EvidenciasCurso;