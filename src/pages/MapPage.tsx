import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapViewer from '../components/MapViewer';
import { MapRestaurant } from '../types/google-map';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapRestaurant | null>(null);

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const sampleRestaurants: MapRestaurant[] = [
    {
      id: 1,
      name: "맛있는 한식당",
      latitude: 37.5665,
      longitude: 126.9780,
      category: "한식",
      address: "서울특별시 강남구 테헤란로 123"
    },
    {
      id: 2,
      name: "이탈리안 피자",
      latitude: 37.5668,
      longitude: 126.9785,
      category: "양식",
      address: "서울특별시 강남구 테헤란로 456"
    },
    {
      id: 3,
      name: "스시로",
      latitude: 37.5662,
      longitude: 126.9775,
      category: "일식",
      address: "서울특별시 강남구 테헤란로 789"
    },
    {
      id: 4,
      name: "중국집",
      latitude: 37.5670,
      longitude: 126.9790,
      category: "중식",
      address: "서울특별시 강남구 테헤란로 321"
    },
    {
      id: 5,
      name: "분식당",
      latitude: 37.5658,
      longitude: 126.9770,
      category: "분식",
      address: "서울특별시 강남구 테헤란로 654"
    }
  ];

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 권한을 가져올 수 없습니다:', error);
          // 기본 위치 설정 (서울 시청)
          setCurrentLocation({
            latitude: 37.5665,
            longitude: 126.9780,
          });
        }
      );
    } else {
      // 기본 위치 설정
      setCurrentLocation({
        latitude: 37.5665,
        longitude: 126.9780,
      });
    }

    // 샘플 데이터 설정
    setRestaurants(sampleRestaurants);
  }, []);

  const handleRestaurantClick = (restaurant: MapRestaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleRestaurantSelect = (restaurant: MapRestaurant) => {
    // 선택한 식당으로 이동
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">지도 보기</h1>
            <p className="text-gray-600">주변 식당을 지도에서 확인하세요</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            홈으로
          </button>
        </div>

        {/* 지도 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">주변 식당 지도</h2>
            <p className="text-gray-600">
              현재 위치 기준으로 주변 식당 {restaurants.length}곳을 찾았습니다.
            </p>
          </div>
          
          <MapViewer
            restaurants={restaurants}
            center={currentLocation || undefined}
            onRestaurantClick={handleRestaurantClick}
          />
        </div>

        {/* 선택된 식당 정보 */}
        {selectedRestaurant && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">선택된 식당</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedRestaurant.name}</h4>
                <p className="text-gray-600">{selectedRestaurant.category}</p>
                <p className="text-sm text-gray-500">{selectedRestaurant.address}</p>
              </div>
              <button
                onClick={() => handleRestaurantSelect(selectedRestaurant)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                상세보기
              </button>
            </div>
          </div>
        )}

        {/* 식당 리스트 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주변 식당 목록</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(restaurant.category)
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600">{restaurant.category}</p>
                    <p className="text-xs text-gray-500">{restaurant.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 카테고리별 색상 반환
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    '한식': '#ff6b6b',
    '양식': '#4ecdc4',
    '일식': '#45b7d1',
    '중식': '#96ceb4',
    '분식': '#feca57',
    '카페': '#ff9ff3',
    '기타': '#54a0ff'
  };
  return colors[category] || colors['기타'];
};

export default MapPage; 