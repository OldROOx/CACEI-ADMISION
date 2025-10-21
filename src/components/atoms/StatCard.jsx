import React from 'react';

const StatCard = ({ value, label, colorClassName }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
            <p className={`text-4xl font-bold ${colorClassName}`}>
                {value}
            </p>
            <p className="text-sm text-gray-500 mt-1">
                {label}
            </p>
        </div>
    );
};

export default StatCard;