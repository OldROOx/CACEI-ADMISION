import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ name, Icon, to, isGroupHeader = false, isLogout = false, onClick }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));

    let classes = 'group flex items-center px-4 py-3 text-sm font-medium transition duration-150 ease-in-out cursor-pointer';

    if (isLogout) {
        classes += ' text-red-500 hover:bg-gray-700';
    } else if (isGroupHeader) {
        classes = 'group flex items-center px-4 py-1 text-xs font-semibold uppercase text-gray-400 mt-4 pointer-events-none';
    } else if (isActive) {
        classes += ' bg-blue-600 text-white';
    } else {
        classes += ' text-gray-200 hover:bg-gray-700';
    }

    const Component = to && !isGroupHeader ? Link : 'div';
    // Modificación: Pasa 'onClick' si no es un Link
    const props = to && !isGroupHeader ? { to } : { onClick };

    return (
        <Component {...props} className={classes}>
            {Icon && <span className="mr-3 flex-shrink-0 h-5 w-5">{Icon}</span>}
            {name}
        </Component>
    );
};

export default SidebarItem;