import React from 'react';

const MetricDisplay = ({ value, label, trend, Icon }) => {
    return (
        <div className="flex flex-col p-5 bg-white rounded-xl shadow border border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                </h3>
                {Icon && <div className="text-gray-400">{Icon}</div>}
            </div>
            <div className="mt-1 flex items-baseline justify-between">
                <p className="text-4xl font-bold text-gray-900">{value}</p>
                <p className={`ml-2 text-xs font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {trend}
                </p>
            </div>
        </div>
    );
};

export default MetricDisplay;