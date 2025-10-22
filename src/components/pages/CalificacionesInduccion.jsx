import React from 'react';
import SecondaryButton from '../atoms/SecondaryButton';

// A sub-component to render the grade table to avoid repetition
const GradeTable = () => {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rows = 5; // Number of empty rows to display

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col} className="border border-gray-300 p-2 text-sm font-medium text-gray-600 bg-gray-50">{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {[...Array(rows)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map(colIndex => (
                            <td key={`${rowIndex}-${colIndex}`} className="border border-gray-300 h-10"></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const CalificacionesInduccion = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Calificaciones De Inducción</h1>
                <p className="text-gray-500 mt-1">Consulte reportes detallados para el análisis externo</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SecondaryButton Icon={'📤'}>Subir Calificaciones De Inducción</SecondaryButton>
                <SecondaryButton Icon={'📄'}>Estadísticas de Inducción (Excel)</SecondaryButton>
                <SecondaryButton Icon={'📑'}>Reporte Completo (PDF)</SecondaryButton>
            </div>

            {/* Grade Tables */}
            <div className="space-y-8">
                <GradeTable />
                <GradeTable />
                <GradeTable />
            </div>
        </div>
    );
};

export default CalificacionesInduccion;