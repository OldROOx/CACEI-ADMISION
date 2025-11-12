// src/components/molecules/EfectividadPieChart.jsx

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Datos simulados ELIMINADOS
// La data ahora se recibe como prop

const COLORS = ['#FF8042', '#FFBB28', '#0088FE', '#00C49F', '#20B2AA'];

const EfectividadPieChart = ({ data }) => { // Aceptamos data como prop
    // Mensaje de carga si no hay datos
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                <p>Cargando datos o no hay registros de efectividad.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EfectividadPieChart;