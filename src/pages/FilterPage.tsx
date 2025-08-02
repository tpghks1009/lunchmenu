import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { apiService } from '../services/api';
import { Restaurant } from '../types';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const FilterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = [
    { id: '한식', name: '한식', icon: '🍚', color: 'bg-red-500' },
    { id: '중식', name: '중식', icon: '🥢', color: 'bg-orange-500' },
    { id: '일식', name: '일식', icon: '🍣', color: 'bg-blue-500' },
    { id: '양식', name: '양식', icon: '🍝', color: 'bg-green-500' },
    { id: '분식', name: '분식', icon: '🍜', color: 'bg-purple-500' },
    { id: '샐러드', name: '샐러드', icon: '🥗', color: 'bg-teal-500' },
    { id: '카페', name: '카페', icon: '☕', color: 'bg-yellow-500' },
    { id: '디저트', name: '디저트', icon: '🍰', color: 'bg-pink-500' },
  ];

  const handleCategorySelect = async (category: string) => {
    if (selectedCategory === category) {
      // 같은 카테고리 클릭 시 선택 해제
      setSelectedCategory('');
      setRestaurants([]);
      return;
    }

    setSelectedCategory(category);
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getRestaurantsByCategory(category);
      setRestaurants(data);
    } catch (err) {
      setError('카테고리별 식당 정보를 가져오는데 실패했습니다.');
      console.error('카테고리 필터 에러:', err);
    } finally {
      setLoading(false);
    }
  };



  const clearFilter = () => {
    setSelectedCategory('');
    setRestaurants([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">카테고리 필터</h1>
            <p className="text-gray-600">원하는 음식 카테고리를 선택하세요</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            홈으로
          </button>
        </div>

        {/* 카테고리 선택 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">음식 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white border-transparent shadow-lg transform scale-105`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 카테고리 표시 */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCategory} 카테고리
                  </h3>
                  <p className="text-gray-600">
                    {restaurants.length}개의 식당을 찾았습니다
                  </p>
                </div>
              </div>
              <button
                onClick={clearFilter}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{selectedCategory} 카테고리 검색 중...</p>
            </div>
          </div>
        )}

        {/* 결과 없음 */}
        {!loading && selectedCategory && restaurants.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedCategory} 카테고리 식당이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              다른 카테고리를 선택해보세요
            </p>
            <button
              onClick={clearFilter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              카테고리 다시 선택
            </button>
          </div>
        )}

        {/* 식당 리스트 */}
        {!loading && restaurants.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {selectedCategory} 카테고리 식당
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  category={restaurant.category}
                  distance={restaurant.distance}
                  rating={restaurant.rating}
                  imageUrl={restaurant.image}
                  description={restaurant.description}
                />
              ))}
            </div>
          </div>
        )}

        {/* 초기 상태 안내 */}
        {!selectedCategory && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              카테고리를 선택해주세요
            </h3>
            <p className="text-gray-600">
              위의 카테고리 버튼을 클릭하여 원하는 음식 종류를 선택하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage; 