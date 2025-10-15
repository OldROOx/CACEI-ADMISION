import React from 'react';

const ActivityLogItem = ({ activity, details, time, Icon }) => {
    return (
        <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-100">
            <div className="flex-shrink-0 mt-1 p-2 bg-purple-100 rounded-full text-purple-600">
                <span className="h-5 w-5">{Icon}</span>
            </div>

            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">
                    {activity}
                </p>
                <p className="text-xs text-gray-500">
                    {details}
                </p>
            </div>

            <p className="flex-shrink-0 text-xs text-gray-400 mt-1">
                {time}
            </p>
        </div>
    );
};

export default ActivityLogItem;