// src/components/atoms/FormAtoms.jsx

import React from 'react';

const BaseInputClasses = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2";

/**
 * Componente modular para Inputs, Selects y Textareas.
 * Usa elementos HTML nativos directamente con clases Tailwind.
 */
export const FormField = ({ label, placeholder, type = 'text', required = false, colSpan = 'col-span-1', helperText, children }) => {

    const inputElement = React.useMemo(() => {
        if (type === 'textarea') {
            return (
                <textarea
                    rows="3"
                    placeholder={placeholder}
                    className={BaseInputClasses}
                />
            );
        }
        if (type === 'select') {
            return (
                <select
                    className={`${BaseInputClasses} bg-white`}
                >
                    <option value="" disabled defaultValue>{placeholder}</option>
                    {children}
                </select>
            );
        }

        let actualType = type;
        if (type === 'date') {
            // Se mantiene como text para facilitar el placeholder dd/mm/aaaa
            actualType = 'text';
        }

        return (
            <input
                type={actualType}
                placeholder={placeholder}
                className={BaseInputClasses}
            />
        );
    }, [type, placeholder, children]);

    return (
        <div className={`mb-4 ${colSpan}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}{required && ' *'}
            </label>
            {inputElement}
            {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
        </div>
    );
};

/**
 * Componente para el título y subtítulo principal del formulario.
 */
export const FormHeader = ({ title, subtitle, showBack = true }) => (
    <header className="mb-8">
        <div className="flex items-center space-x-2 text-gray-500 mb-2">
            {showBack && <span className="cursor-pointer text-xl">←</span>}
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
    </header>
);

/**
 * Componente para las secciones agrupadas del formulario.
 */
export const FormSection = ({ title, subtitle, icon = '•', children }) => (
    <div className="space-y-4 mb-8 p-4 border border-gray-200 rounded-lg">
        {title && (
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
                {icon && <span className="mr-2 text-blue-600">{icon}</span>} {title}
            </h3>
        )}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {children}
    </div>
);