import React from 'react';

const Loader = ({ 
  size = 'medium', 
  text = 'Loading...', 
  center = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const containerClasses = center 
    ? 'flex justify-center items-center' 
    : '';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className={`${textSizes[size]} text-gray-600`}>{text}</p>
      </div>
    </div>
  );
};

export default Loader;
