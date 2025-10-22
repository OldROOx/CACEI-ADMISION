import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import StatCard from '../atoms/StatCard'; // Reutilizamos el StatCard

// Mock data para la lista de actividades
const mockActividades = [
    {
        title: 'Ingeniería en Sistemas',
        status: 'Completada',
        docente: 'Dr. Juan Martínez',
        fecha: '2024-01-18',
        duracion: '1 hora',
        preparatoria: 'CBTIS No. 45',
        estudiantes: 45,
        tipo: 'Presentación',
    },
    {
        title: 'Ingeniería Industrial',
        status: 'Completada',
        docente: 'Dra. Ana López',
        fecha: '2024-01-17',
        duracion: '45 min',
        preparatoria: 'CBTIS No. 12',
        estudiantes: 32,
        tipo: 'Taller',
    },
    {
        title: 'Ingeniería Civil',
        status: 'Pendiente',
        docente: 'Dr. Carlos Ruiz',
        fecha: '2024-01-20',
        duracion: '1.5 horas',
        preparatoria: 'CONALEP No. 3',
        estudiantes: 28,
        tipo: 'Conferencia',
    },
    {
        title: 'Administración',
        status: 'Completada',
        docente: 'Dra. María González',
        fecha: '2024-01-16',
        duracion: '1 hora',
        preparatoria: 'CBTIS No. 23',
        estudiantes: 38,
        tipo: 'Presentación',
    },
];

// Mock data para las estadísticas del footer
const mockStats = [
    { value: 143, label: 'Total Estudiantes Alcanzados', color: 'text-gray-800' },
    { value: 4, label: 'Preparatorias Visitadas', color: 'text-blue-600' },
    { value: 4, label: 'Docentes Participantes', color: 'text-purple-600' },
    { value: '75%', label: 'Tasa de Éxito', color: 'text-green-600' },
];

const RegistrosActividades = () => {
    const getStatusClasses = (status) => {
        if (status === 'Completada') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div className="flex justify-between items-start">
                <FormHeader title="Registros de Actividades" subtitle="Consulte y administre todas las actividades de promoción" />
                <div className="flex space-x-2 flex-shrink-0">
                    <SecondaryButton Icon={'📤'}>Exportar</SecondaryButton>
                    <PrimaryButton>+ Nueva Actividad</PrimaryButton>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-md border flex items-center space-x-4">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                    <input type="text" placeholder="Buscar por docente, preparatoria o proyecto..." className="w-full p-2 pl-10 border rounded-lg text-sm" />
                </div>
                <select className="p-2 border rounded-lg bg-white text-sm">
                    <option>Todos los estados</option>
                </select>
                <select className="p-2 border rounded-lg bg-white text-sm">
                    <option>Todos los tipos</option>
                </select>
            </div>

            {/* Resumen de registros */}
            <div className="text-sm text-gray-600 flex justify-between items-center px-2">
                <span>Mostrando 4 de 4 registros</span>
                <div>
                    <span className="mr-4"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>3 Completadas</span>
                    <span className="mr-4"><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>1 Pendientes</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>0 Cancelados</span>
                </div>
            </div>

            {/* Lista de Actividades */}
            <div className="space-y-4">
                {mockActividades.map((actividad, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-md border flex items-center">
                        <div className="pr-4 text-2xl">📄</div>
                        <div className="flex-grow">
                            <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-gray-800">{actividad.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(actividad.status)}`}>{actividad.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 text-xs text-gray-500 mt-2">
                                <p>Docente: {actividad.docente}</p>
                                <p>Preparatoria: {actividad.preparatoria}</p>
                                <p>Fecha: {actividad.fecha}</p>
                                <p>Estudiantes: {actividad.estudiantes}</p>
                                <p>Duración: {actividad.duracion}</p>
                                <p>Tipo: {actividad.tipo}</p>
                            </div>
                        </div>
                        <div className="flex space-x-3 text-gray-500">
                            <button className="hover:text-blue-600">👁️</button>
                            <button className="hover:text-green-600">✏️</button>
                            <button className="hover:text-red-600">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estadísticas del Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {mockStats.map((stat, index) => (
                    <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                ))}
            </div>
        </div>
    );
};

export default RegistrosActividades;