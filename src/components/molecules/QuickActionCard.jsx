import React from 'react';

const QuickActionCard = ({ title, subtitle, actions, ButtonPrimary, ButtonSecondary }) => {
    return (
        <div className="flex flex-col p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

            <div className="space-y-3 flex-grow">
                {actions.map((action, index) => {
                    const ButtonComponent = action.type === 'primary' ? ButtonPrimary : ButtonSecondary;

                    return (
                        <ButtonComponent key={index} onClick={action.onClick} Icon={action.Icon} to={action.to}>
                            {action.label}
                        </ButtonComponent>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActionCard;