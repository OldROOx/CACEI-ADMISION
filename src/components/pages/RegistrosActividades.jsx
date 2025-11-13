import React, { useState, useEffect } from 'react';
import { FormHeader } from '../atoms/FormAtoms';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import StatCard from '../atoms/StatCard'; // Reutilizamos el StatCard

const API_BASE_URL = '/api'; // Usa el proxy configurado en vite.config.js

const RegistrosActividades = () => {
    // --- ESTADOS PARA LA DATA REAL ---
    const [actividadesData, setActividadesData] = useState([]);
    const [loading, setLoading] = useState(true); // Para manejar el estado de carga

    // --- LÓGICA DE CARGA DE DATOS DE LA API ---
    useEffect(() => {
        const fetchActividades = async () => {
            try {
                setLoading(true);
                // Petición al endpoint /api/actividades
                const response = await fetch(`${API_BASE_URL}/actividades`);
                if (!response.ok) {
                    throw new Error(`Error al obtener actividades: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();

                // Mapear la data para asegurar que tiene un formato amigable para el componente.
                // Ajusta los nombres de las propiedades (ej: item.nombre, item.estado) si tu API
                // usa otros nombres de campos para Docente, Preparatoria, etc.
                const mappedActivities = data.map(item => ({
                    ...item,
                    id: item.id || Math.random(), // Asegura una key única
                    title: item.nombre || item.Titulo || 'Actividad sin título',
                    Status: item.estado || item.Status || 'Pendiente',
                    // Adaptación de los campos anidados si la API los devuelve así:
                    DocenteNombre: item.docente?.nombre || 'Docente',
                    DocenteApellidos: item.docente?.apellidos || 'Desconocido',
                    PreparatoriaNombre: item.preparatoria?.nombre || 'Digital/Invitada',
                    Fecha: new Date(item.fecha).toLocaleDateString() || 'N/A',
                    EstudiantesAlcanzados: item.estudiantes_alcanzados || item.estudiantes || 0,
                    Tipo: item.tipo || 'General',
                    CarrerasPromovidas: item.carreras_promovidas || item.carreras?.join(', ') || 'Varias'
                }));

                setActividadesData(mappedActivities);

            } catch (error) {
                console.error('Error cargando actividades:', error);
                // En caso de error, la lista se queda vacía
                setActividadesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActividades();
    }, []);

    // --- LÓGICA DERIVADA DEL ESTADO (Métricas) ---
    const actividades = actividadesData;
    const totalRegistros = actividades.length;

    const getStatusClasses = (status) => {
        if (status === 'Completada') return 'bg-green-100 text-green-800';
        if (status === 'Pendiente') return 'bg-blue-100 text-blue-800';
        if (status === 'Rechazado' || status === 'Cancelado') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    // Calcular estadísticas resumidas desde la lista de actividades
    const completadas = actividades.filter(a => a.Status === 'Completada').length;
    const pendientes = actividades.filter(a => a.Status === 'Pendiente').length;
    const cancelados = actividades.filter(a => a.Status === 'Cancelado').length;

    // Datos para el componente StatCard
    const statsDataCalculated = [
        { value: totalRegistros, label: 'Total Registros', color: 'bg-indigo-500' },
        { value: completadas, label: 'Actividades Completadas', color: 'bg-green-500' },
        { value: pendientes, label: 'Actividades Pendientes', color: 'bg-blue-500' },
        { value: cancelados, label: 'Actividades Canceladas', color: 'bg-red-500' },
    ];


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
                {loading ? (
                    <p className="text-center text-gray-500 py-8 bg-white p-4 rounded-xl shadow-md border">Cargando actividades...</p>
                ) : actividades.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 bg-white p-4 rounded-xl shadow-md border">No hay actividades registradas.</p>
                ) : (
                    actividades.map((actividad) => (
                        <div key={actividad.id} className="bg-white p-4 rounded-xl shadow-md border flex items-center">
                            <div className="pr-4 text-2xl">📄</div>
                            <div className="flex-grow">
                                <div className="flex items-center space-x-3">
                                    <h3 className="font-semibold text-gray-800">{actividad.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(actividad.Status)}`}>{actividad.Status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 text-xs text-gray-500 mt-2">
                                    <p>Docente: {actividad.DocenteNombre} {actividad.DocenteApellidos}</p>
                                    <p>Preparatoria: {actividad.PreparatoriaNombre}</p>
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
                {loading ? (
                    <p className="text-center text-gray-500 col-span-full">Cargando estadísticas del resumen de promoción...</p>
                ) : (
                    statsDataCalculated.map((stat, index) => (
                        <StatCard key={index} value={stat.value} label={stat.label} colorClassName={stat.color} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RegistrosActividades;