import React from 'react';

const Shimmer = ({ type = 'category', count = 1, className = '' }) => {
  const shimmerCard = "bg-gray-200 rounded animate-pulse";
  
  const CategoryShimmer = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${shimmerCard} h-32`}></div>
      <div className="p-4">
        <div className={`${shimmerCard} h-4 w-3/4 mb-2`}></div>
        <div className={`${shimmerCard} h-3 w-full`}></div>
      </div>
    </div>
  );

  const ProductShimmer = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${shimmerCard} h-48`}></div>
      <div className="p-4">
        <div className={`${shimmerCard} h-4 w-3/4 mb-2`}></div>
        <div className={`${shimmerCard} h-4 w-1/2 mb-3`}></div>
        <div className={`${shimmerCard} h-6 w-1/3`}></div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }, (_, index) => (
          <div key={index}>
            {type === 'category' ? <CategoryShimmer /> : <ProductShimmer />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;
