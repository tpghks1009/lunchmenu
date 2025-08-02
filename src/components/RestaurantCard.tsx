import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RestaurantCardProps {
  id: number;
  name: string;
  category: string;
  distance: number;
  rating: number;
  imageUrl: string;
  description?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  category,
  distance,
  rating,
  imageUrl,
  description
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${id}`);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
      onClick={handleClick}
    >
      {/* 이미지 섹션 */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=식당+이미지';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {formatDistance(distance)}
          </span>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(rating)}
            <span className="text-sm text-gray-600 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {formatDistance(distance)}
            </span>
          </div>
        </div>

        {/* 호버 시 나타나는 액션 버튼 */}
        <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            상세보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 