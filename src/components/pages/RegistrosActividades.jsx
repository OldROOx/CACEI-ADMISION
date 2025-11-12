import React from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import StatCard from '../atoms/StatCard'; // Reutilizamos el StatCard

// MOCK DATA ELIMINADO: Usar [] para datos de lista y [] para stats.
const mockActividades = []; // Aquí se cargará la lista de actividades desde /api/actividades

// MOCK DATA ELIMINADO:
const mockStats = []; // Aquí se cargarán las estadísticas del footer

const RegistrosActividades = () => {
    const actividadesData = mockActividades;
    const statsData = mockStats;

    const getStatusClasses = (status) => {
        // El status de la DB es fijo (Completada, Pendiente, Rechazado, etc.)
        if (status === 'Completada') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    // Calcular estadísticas resumidas
    const totalRegistros = actividadesData.length;
    // Asume que el campo de estado se llama 'Status' y el valor es 'Completada' o 'Pendiente'
    const completadas = actividadesData.filter(a => a.Status === 'Completada').length;
    const pendientes = actividadesData.filter(a => a.Status === 'Pendiente').length;
    const cancelados = actividadesData.filter(a => a.Status === 'Cancelado').length;

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
                <span>Mostrando {totalRegistros} de {totalRegistros} registros</span>
                <div>
                    <span className="mr-4"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>{completadas} Completadas</span>
                    <span className="mr-4"><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>{pendientes} Pendientes</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>{cancelados} Cancelados</span>
                </div>
            </div>

            {/* Lista de Actividades */}
            <div className="space-y-4">
                {actividadesData.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 bg-white p-4 rounded-xl shadow-md border">No hay actividades registradas.</p>
                ) : (
                    actividadesData.map((actividad, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-md border flex items-center">
                            <div className="pr-4 text-2xl">📄</div>
                            <div className="flex-grow">
                                <div className="flex items-center space-x-3">
                                    {/* Asume que el campo para el título de la actividad se llama 'title' o 'Titulo' */}
                                    <h3 className="font-semibold text-gray-800">{actividad.title || actividad.Titulo}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(actividad.Status)}`}>{actividad.Status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 text-xs text-gray-500 mt-2">
                                    <p>Docente: {actividad.DocenteNombre} {actividad.DocenteApellidos}</p>
                                    <p>Preparatoria: {actividad.PreparatoriaNombre || 'Digital/Invitada'}</p>
                                    <p>Fecha: {actividad.Fecha}</p>
                                    <p>Estudiantes: {actividad.EstudiantesAlcanzados}</p>
                                    <p>Tipo: {actividad.Tipo}</p>
                                    <p className="col-span-2">Carreras: {actividad.CarrerasPromovidas}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3 text-gray-500">
                                <button className="hover:text-blue-600">👁️</button>
                                <button className="hover:text-green-600">✏️</button>
                                <button className="hover:text-red-600">🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Estadísticas del Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {statsData.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-full">Cargando estadísticas del resumen de promoción...</p>
                ) : (
                    statsData.map((stat, index) => (
                        <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RegistrosActividades;