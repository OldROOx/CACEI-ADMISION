import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import StatCard from '../atoms/StatCard';

// MOCK DATA ELIMINADO: Usar [] para datos de lista y [] para stats.
const mockClases = []; // Aquí se cargará la lista de clases desde /api/clases

// MOCK DATA ELIMINADO:
const mockStats = []; // Aquí se cargarán las estadísticas de clases

const ClasesNivelacion = () => {
    const clasesData = mockClases;
    const statsData = mockStats;

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
                {clasesData.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 bg-white p-6 rounded-xl shadow-md border">No hay clases de nivelación programadas.</p>
                ) : (
                    clasesData.map((clase, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
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
                                        <p>📍 {clase.Ubicacion || 'Virtual/Por definir'}</p>
                                        {/* Estos campos deben venir de la API o ser calculados en el front */}
                                        <p>🧑‍🎓 {clase.enrollment || '0/0 estudiantes'}</p>
                                        <p className="col-span-2">👨‍🏫 {clase.DocenteNombreCompleto}</p>
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
                    ))
                )}
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

export default ClasesNivelacion;