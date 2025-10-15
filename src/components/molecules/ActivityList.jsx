import React from 'react';

const ActivityList = ({ title, activities, ActivityItemComponent }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {title}
            </h2>

            <div className="space-y-1">
                {activities.map((item, index) => (
                    <ActivityItemComponent
                        key={index}
                        activity={item.activity}
                        details={item.details}
                        time={item.time}
                        Icon={item.Icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default ActivityList;