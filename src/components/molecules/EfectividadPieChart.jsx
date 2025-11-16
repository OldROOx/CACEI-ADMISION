import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const EfectividadPieChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                <p>No hay datos disponibles para mostrar.</p>
            </div>
        );
    }

    // Calcular total para porcentajes
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">
                        Estudiantes: <span className="font-bold text-blue-600">{payload[0].value}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Porcentaje: <span className="font-bold text-green-600">{percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Etiqueta personalizada
    const renderCustomLabel = (entry) => {
        const percentage = ((entry.value / total) * 100).toFixed(1);
        return `${percentage}%`;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '12px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EfectividadPieChart;