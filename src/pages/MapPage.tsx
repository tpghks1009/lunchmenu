import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapViewer from '../components/MapViewer';
import { MapRestaurant } from '../types/google-map';
import { apiService } from '../services/api';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapRestaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 주변 식당 데이터 가져오기
  const loadNearbyRestaurants = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const nearbyRestaurants = await apiService.getKakaoNearbyRestaurants(lat, lng, 1000);
      
      // Restaurant 타입을 MapRestaurant 타입으로 변환
      const mapRestaurants: MapRestaurant[] = nearbyRestaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        category: restaurant.category,
        address: restaurant.address || restaurant.description || '주소 정보 없음',
        url: restaurant.url, // Kakao URL 추가
        phone: restaurant.phone, // 전화번호 추가
        roadAddress: restaurant.roadAddress, // 도로명주소 추가
        distance: restaurant.distance // 거리 추가
      }));
      
      setRestaurants(mapRestaurants);
    } catch (error) {
      console.error('주변 식당 정보를 가져오는데 실패했습니다:', error);
      setError('주변 식당 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 현재 위치 가져오기 및 주변 식당 데이터 로드
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          // 위치 정보를 받으면 주변 식당 데이터 로드
          loadNearbyRestaurants(location.latitude, location.longitude);
        },
        (error) => {
          console.error('위치 권한을 가져올 수 없습니다:', error);
          // 기본 위치 설정 (서울 시청)
          const defaultLocation = {
            latitude: 37.5665,
            longitude: 126.9780,
          };
          setCurrentLocation(defaultLocation);
          // 기본 위치로 주변 식당 데이터 로드
          loadNearbyRestaurants(defaultLocation.latitude, defaultLocation.longitude);
        }
      );
    } else {
      // 기본 위치 설정
      const defaultLocation = {
        latitude: 37.5665,
        longitude: 126.9780,
      };
      setCurrentLocation(defaultLocation);
      // 기본 위치로 주변 식당 데이터 로드
      loadNearbyRestaurants(defaultLocation.latitude, defaultLocation.longitude);
    }
  }, [loadNearbyRestaurants]);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-4xl">🗺️</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                지도 보기
              </span>
            </h1>
            <p className="text-gray-600 text-lg">주변 식당을 지도에서 확인하세요</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center">
              <span className="mr-2">🏠</span>
              홈으로
            </span>
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 지도 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">주변 식당 지도</h2>
            <p className="text-gray-600">
              {loading 
                ? '주변 식당을 찾는 중...' 
                : `현재 위치 기준으로 주변 식당 ${restaurants.length}곳을 찾았습니다.`
              }
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">주변 식당을 검색하는 중...</p>
              </div>
            </div>
          ) : (
            <MapViewer
              restaurants={restaurants}
              center={currentLocation || undefined}
              onRestaurantClick={handleRestaurantClick}
            />
          )}
        </div>

        {/* 선택된 식당 정보 */}
        {selectedRestaurant && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🎯</span>
                선택된 식당
              </h3>
              <div className="flex space-x-2">
                {selectedRestaurant.url ? (
                  <a
                    href={selectedRestaurant.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <span className="flex items-center">
                      <span className="mr-1">🔍</span>
                      상세보기
                    </span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleRestaurantSelect(selectedRestaurant)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <span className="flex items-center">
                      <span className="mr-1">📋</span>
                      상세보기
                    </span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: getCategoryColor(parseCategory(selectedRestaurant.category).main) }}
                >
                  {selectedRestaurant.name.charAt(0)}
                </div>
                                 <div className="flex-1">
                   <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedRestaurant.name}</h4>
                   <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                     <span className="px-2 py-1 bg-gray-100 rounded-full">
                       {parseCategory(selectedRestaurant.category).main}
                     </span>
                     {selectedRestaurant.distance && (
                       <span className="flex items-center px-2 py-1 bg-gray-50 rounded-full">
                         <span className="mr-1">📍</span>
                         {formatDistance(selectedRestaurant.distance)}
                       </span>
                     )}
                   </div>
                  <div className="space-y-1">
                    {selectedRestaurant.roadAddress && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="text-gray-400 mr-2">📍</span>
                        {selectedRestaurant.roadAddress}
                      </p>
                    )}
                    {selectedRestaurant.phone && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="text-gray-400 mr-2">📞</span>
                        {selectedRestaurant.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 식당 리스트 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주변 식당 목록</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">식당 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => {
                const categoryInfo = parseCategory(restaurant.category);
                return (
                  <div
                    key={restaurant.id}
                    className={`group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer ${
                      selectedRestaurant?.id === restaurant.id
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg'
                        : 'bg-white border-gray-100'
                    }`}
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    {/* 식당 정보 */}
                    <div className="p-6">
                      {/* 카테고리 배지와 거리 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                            style={{ backgroundColor: getCategoryColor(categoryInfo.main) }}
                          >
                            {categoryInfo.main}
                          </div>
                          {selectedRestaurant?.id === restaurant.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        {restaurant.distance && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            📍 {formatDistance(restaurant.distance)}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className={`text-lg font-bold mb-2 line-clamp-2 transition-colors ${
                          selectedRestaurant?.id === restaurant.id
                            ? 'text-blue-700'
                            : 'text-gray-900 group-hover:text-blue-600'
                        }`}>
                          {restaurant.name}
                        </h4>
                        {categoryInfo.sub && (
                          <p className="text-sm text-gray-500 mb-2">
                            {categoryInfo.sub}
                          </p>
                        )}
                        <div className="space-y-1">
                          {restaurant.roadAddress && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="text-gray-400 mr-2">📍</span>
                              {restaurant.roadAddress}
                            </p>
                          )}
                          {restaurant.phone && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="text-gray-400 mr-2">📞</span>
                              {restaurant.phone}
                            </p>
                          )}
                        </div>
                      </div>


                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">주변에 식당이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 카테고리 파싱 함수
const parseCategory = (category: string): { main: string; sub: string } => {
  const parts = category.split(' > ');
  if (parts.length >= 3) {
    return {
      main: parts[1] || '기타',
      sub: parts[2] || ''
    };
  }
  return {
    main: category.includes('한식') ? '한식' : 
          category.includes('양식') ? '양식' : 
          category.includes('일식') ? '일식' : 
          category.includes('중식') ? '중식' : 
          category.includes('분식') ? '분식' : 
          category.includes('카페') ? '카페' : '기타',
    sub: ''
  };
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

// 거리 포맷팅 함수
const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${distance}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
};

export default MapPage; 