import React from 'react';

const SecondaryButton = ({ children, onClick, Icon }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
            {Icon && <span className="mr-2 h-5 w-5 text-gray-500">{Icon}</span>}
            {children}
        </button>
    );
};

export default SecondaryButton;