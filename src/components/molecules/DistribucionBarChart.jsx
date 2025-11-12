// src/components/molecules/DistribucionBarChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data: Simula el número de estudiantes interesados o promovidos por carrera
const data = [
    { name: 'Sistemas', Estudiantes: 55, Promoción: 45 },
    { name: 'Mecatrónica', Estudiantes: 40, Promoción: 30 },
    { name: 'Industrial', Estudiantes: 30, Promoción: 20 },
    { name: 'Civil', Estudiantes: 25, Promoción: 15 },
    { name: 'Administración', Estudiantes: 15, Promoción: 10 },
];

const DistribucionBarChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical" // Gráfico de barras horizontal para nombres de carreras largos
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" stroke="#555" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Estudiantes" fill="#8884d8" name="Estudiantes Alcanzados" />
                <Bar dataKey="Promoción" fill="#82ca9d" name="Inscritos Potenciales" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DistribucionBarChart;