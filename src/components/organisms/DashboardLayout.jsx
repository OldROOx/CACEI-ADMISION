import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarItem from '../atoms/SidebarItem';
import { useAuth } from '../../context/AuthContext'; // Importar el hook de autenticación

const DashboardLayout = ({ SidebarItemComponent = SidebarItem }) => {
    const { userRole, logout } = useAuth(); // Obtener el rol y la función de logout

    const allSidebarItems = [
        { name: 'Dashboard', to: '/dashboard', Icon: '🏠', type: 'link' },
        { name: 'Promociones', type: 'groupHeader', Icon: '📖' },
        { name: 'Promociones', to: '/promociones', Icon: '📢', type: 'link' },
        { name: 'Prep. Visitante', to: '/prep-visitante-promociones', Icon: '👥', type: 'link' },
        { name: 'Promocion Digital', to: '/promocion-digital', Icon: '💻', type: 'link' },
        { name: 'Registrar Preparatoria', to: '/registrar-preparatoria', Icon: '🏫', type: 'link' },
        { name: 'Registrar Actividad', to: '/registrar-actividad', Icon: '📝', type: 'link' },
        { name: 'Reportes', to: '/reportes', Icon: '📊', type: 'link' },
        { name: 'Registros', to: '/registros', Icon: '📄', type: 'link' },
        { name: 'Registrar tutor', to: '/registrar-tutor', Icon: '🧑‍🏫', type: 'link', role: 'director' }, // Añadir rol requerido
        { name: 'Inducción', type: 'groupHeader', Icon: '🧑‍🎓' },
        { name: 'Evidencias', to: '/induccion/evidencias', Icon: '📑', type: 'link' },
        { name: 'Encuestas', to: '/induccion/encuestas', Icon: '📊', type: 'link' },
        { name: 'Clases Nivelación', to: '/induccion/nivelacion', Icon: '📚', type: 'link' },
        { name: 'Control Asistencia', to: '/induccion/asistencia', Icon: '✅', type: 'link' },
    ];

    // Filtrar los items del menú basados en el rol del usuario
    const mockSidebarStructure = allSidebarItems.filter(item => {
        return !item.role || item.role === userRole;
    });

    return (
        <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
            <nav className="w-64 flex-shrink-0 bg-gray-800 shadow-xl flex flex-col">
                <div className="px-4 py-4 text-white text-xl font-medium border-b border-gray-700 flex items-center">
                    <span className="mr-3">🎓</span> Sistema Educativo
                </div>
                <div className="flex flex-col space-y-1 overflow-y-auto py-2">
                    {mockSidebarStructure.map((item, index) => (
                        <SidebarItemComponent
                            key={index}
                            name={item.name}
                            Icon={item.Icon}
                            to={item.to}
                            isGroupHeader={item.type === 'groupHeader'}
                        />
                    ))}
                </div>
                <div className="mt-auto px-4 py-4 border-t border-gray-700">
                    <SidebarItemComponent
                        name="Cerrar Sesión"
                        Icon="⬅️"
                        isLogout={true}
                        onClick={logout} // Funcionalidad de logout
                    />
                </div>
            </nav>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;