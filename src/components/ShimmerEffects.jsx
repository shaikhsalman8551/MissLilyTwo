import React from 'react';

const ShimmerCard = ({ height = 'h-24', className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
          <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
        </div>
        <div className="w-24 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-shimmer"></div>
        <div className="w-32 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
      </div>
    </div>
  );
};

const ShimmerStatsCard = ({ height = 'h-24' }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
        <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
      </div>
      <div className="w-20 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-shimmer"></div>
      <div className="w-28 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
    </div>
  );
};

const ShimmerChart = ({ height = 'h-80' }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="animate-pulse">
        <div className="w-48 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-shimmer"></div>
        <div className={`${height} bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-shimmer`}></div>
      </div>
    </div>
  );
};

const ShimmerListItem = ({ lines = 2 }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
      <div className="flex-1">
        <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-shimmer"></div>
        {lines > 1 && <div className="w-1/2 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>}
      </div>
      <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
    </div>
  );
};

const ShimmerList = ({ items = 3, lines = 2 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <ShimmerListItem key={index} lines={lines} />
      ))}
    </div>
  );
};

const ShimmerGrid = ({ cols = 4, items = 4 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
      {Array.from({ length: items }).map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
};

const ShimmerButton = ({ width = 'w-full', height = 'h-12' }) => {
  return (
    <div className={`${width} ${height} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer`}></div>
  );
};

const ShimmerText = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div className={`${width} ${height} bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer ${className}`}></div>
  );
};

export {
  ShimmerCard,
  ShimmerStatsCard,
  ShimmerChart,
  ShimmerListItem,
  ShimmerList,
  ShimmerGrid,
  ShimmerButton,
  ShimmerText
};
