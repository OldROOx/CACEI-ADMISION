import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = ({ SidebarItemComponent }) => {
    // Nota: SidebarItemComponent ahora es el componente modificado.

    const mockSidebarStructure = [
        // --- SECCIÓN PRINCIPAL (Fuera de grupos) ---
        { name: 'Dashboard', to: '/dashboard', Icon: '🏠', type: 'link' },

        // --- GRUPO: PROMOCIONES ---
        // El título "Promociones" en la imagen actúa como un encabezado/grupo
        { name: 'Promociones', type: 'groupHeader', Icon: '📖' },
        { name: 'Promociones', to: '/promociones', Icon: '👤', type: 'link' }, // Sub-item
        { name: 'Prep. Visitante Promociones', to: '/prep-visitante-promociones', Icon: '👥', type: 'link' }, // Sub-item
        { name: 'Promocion Digital', to: '/promocion-digital', Icon: '💻', type: 'link' }, // Sub-item
        { name: 'Registrar tutor', to: '/registrar-tutor', Icon: '🧑‍💻', type: 'link' }, // Sub-item
        { name: 'Registrar Preparatoria', to: '/registrar-preparatoria', Icon: '🔒', type: 'link' }, // Sub-item
        { name: 'Registrar Actividad', to: '/registrar-actividad', Icon: '📝', type: 'link' }, // Sub-item
        { name: 'Ver Registros', to: '/registros', Icon: '📄', type: 'link' }, // Sub-item

        // --- GRUPO: INDUCCIÓN ---
        { name: 'Inducción', to: '/induccion', Icon: '👥', type: 'groupHeader' },
        { name: 'Encuestas', to: '/induccion/encuestas', Icon: '📋', type: 'link' }, // Sub-item
        { name: 'Clases Nivelación', to: '/induccion/nivelacion', Icon: '📚', type: 'link' }, // Sub-item
        { name: 'Control Asistencia', to: '/induccion/asistencia', Icon: '🧑‍🎓', type: 'link' }, // Sub-item
    ];

    return (
        // FIX DE COLORES Y FULL SCREEN: h-screen, w-screen. Fondo del layout negro (#242424) para la sombra.
        <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">

            {/* 1. Barra Lateral (Sidebar) - Fondo oscuro, como en tu imagen */}
            <nav className="w-64 flex-shrink-0 bg-gray-800 shadow-xl flex flex-col">
                {/* Título superior "Sistema Educativo" */}
                <div className="px-4 py-4 text-white text-xl font-medium border-b border-gray-700 flex items-center">
                    <span className="mr-3">🎓</span> Sistema Educativo
                </div>

                <div className="flex flex-col space-y-1 overflow-y-auto py-2">
                    {mockSidebarStructure.map((item, index) => {
                        const isGroupHeader = item.type === 'groupHeader';

                        return (
                            <SidebarItemComponent
                                key={index}
                                name={item.name}
                                Icon={item.Icon}
                                to={item.to}
                                isGroupHeader={isGroupHeader}
                            />
                        );
                    })}
                </div>

                {/* Cerrar Sesión (al final) */}
                <div className="mt-auto px-4 py-4 border-t border-gray-700">
                    <SidebarItemComponent
                        name="Cerrar Sesión"
                        to="/logout"
                        Icon="⬅️"
                        isLogout={true}
                    />
                </div>
            </nav>

            {/* 2. Contenido Principal (Panel de la derecha) */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">

                    {/* Encabezado fijo o context-based (como en la imagen original del dashboard) */}
                    <div className="flex items-center justify-between pb-4 mb-6 bg-white p-6 rounded-xl shadow-md">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <input type="text" placeholder="Buscar..." className="p-2 border rounded-lg w-64 text-gray-700" />
                            <span className="text-yellow-500">🔔</span>
                            <span className="text-gray-500">⚙️</span>
                        </div>
                    </div>

                    {/* Contenido de la Ruta */}
                    <Outlet />

                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;