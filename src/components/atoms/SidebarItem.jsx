import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Propiedad 'isGroupHeader' para manejar Promociones/Inducción como títulos.
const SidebarItem = ({ name, Icon, to, isGroupHeader = false, isLogout = false }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Activo si la ruta actual coincide exactamente o comienza con la ruta del item (para grupos)
    const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));

    // Clases base
    let classes = 'group flex items-center px-4 py-3 text-sm font-medium transition duration-150 ease-in-out cursor-pointer';

    if (isLogout) {
        classes += ' text-red-500 hover:bg-gray-700'; // Estilo para Cerrar Sesión
    } else if (isGroupHeader) {
        classes = 'group flex items-center px-4 py-1 text-xs font-semibold uppercase text-gray-400 mt-4 pointer-events-none'; // Estilo para Encabezado de Grupo
    } else if (isActive) {
        classes += ' bg-blue-600 text-white'; // Estilo para Item Activo
    } else {
        classes += ' text-gray-200 hover:bg-gray-700'; // Estilo para Item Normal
    }

    // Si es un enlace navegable, usa <Link>. Si es un encabezado, usa <div>.
    const Component = to && !isGroupHeader ? Link : 'div';
    const props = to && !isGroupHeader ? { to } : {};

    return (
        <Component {...props} className={classes}>
            {Icon && <span className="mr-3 flex-shrink-0 h-5 w-5">{Icon}</span>}
            {name}
        </Component>
    );
};

export default SidebarItem;