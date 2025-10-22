import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Municipio A - Escuela 1', value: 400 },
    { name: 'Municipio B - Escuela 2', value: 300 },
    { name: 'Municipio C - Escuela 3', value: 300 },
    { name: 'Municipio D - Escuela 4', value: 200 },
    { name: 'Municipio E - Escuela 5', value: 278 },
];

const COLORS = ['#FF8042', '#FFBB28', '#0088FE', '#00C49F', '#20B2AA'];

const EfectividadPieChart = () => {
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