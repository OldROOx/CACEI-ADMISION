import React from 'react';

const StatsOverview = ({ stats, MetricCardComponent }) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <MetricCardComponent
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    trend={stat.trend}
                    Icon={stat.Icon}
                />
            ))}
        </div>
    );
};

export default StatsOverview;