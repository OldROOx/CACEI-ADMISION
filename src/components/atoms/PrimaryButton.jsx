import React from 'react';
import { Link } from 'react-router-dom';

const PrimaryButton = ({ children, onClick, Icon, to }) => {
    const Component = to ? Link : 'button';
    const props = to ? { to } : { onClick };

    return (
        <Component
            {...props}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
        >
            {Icon && <span className="mr-2 h-5 w-5">{Icon}</span>}
            {children}
        </Component>
    );
};

export default PrimaryButton;