import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Colores para cada tipo de actividad
const COLORS = {
    'Visitada': '#3B82F6',      // Azul
    'Invitada': '#A855F7',      // Púrpura
    'Digital': '#10B981',       // Verde
    'Sin Tipo': '#6B7280'       // Gris
};

const DistribucionBarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                <p>No hay datos disponibles para mostrar.</p>
            </div>
        );
    }

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
                    <p className="text-sm text-gray-600">
                        Cantidad: <span className="font-bold text-blue-600">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#D1D5DB' }}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="circle"
                />
                <Bar
                    dataKey="value"
                    name="Cantidad de Actividades"
                    radius={[8, 8, 0, 0]}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6B7280'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DistribucionBarChart;