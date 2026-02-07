import React from 'react';

const SimpleBarChart = ({ data, title, color = 'pink' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const colorClasses = {
        pink: 'bg-pink-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700 truncate">{item.label}</span>
                                <span className="font-medium text-gray-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'];
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{item.value}</span>
                            <span className="text-xs text-gray-500">
                                ({((item.value / total) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, change, icon: Icon, color = 'pink' }) => {
    const colorClasses = {
        pink: 'bg-pink-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
                    <Icon className={`text-2xl ${colorClasses[color].replace('bg-', 'text-')}`} />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                    change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                    {change > 0 ? '+' : ''}{change}%
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
    );
};

export { SimpleBarChart, SimplePieChart, StatsCard };
