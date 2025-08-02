import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { apiService } from '../services/api';
import { Restaurant, Location } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<{recommendations: Array<{id: number, reason: string}>, total_count: number, user_location: string} | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 위치 권한 요청
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 권한을 가져올 수 없습니다:', error);
          // 위치 권한이 거부되면 기본 위치(서울) 사용
          setLocation({
            latitude: 37.5665,
            longitude: 126.9780,
          });
          setError('위치 권한이 거부되어 서울 지역의 식당을 보여드립니다.');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5분
        }
      );
    } else {
      // 위치 서비스를 지원하지 않는 브라우저
      setLocation({
        latitude: 37.5665,
        longitude: 126.9780,
      });
      setError('이 브라우저는 위치 서비스를 지원하지 않아 서울 지역의 식당을 보여드립니다.');
    }
  }, []);

  const loadNearbyRestaurants = useCallback(async () => {
    const currentLocation = location || {
      latitude: 37.5665,
      longitude: 126.9780,
    };
    
    try {
      const restaurants = await apiService.getRestaurants(
        currentLocation.latitude,
        currentLocation.longitude
      );
      setNearbyRestaurants(restaurants.slice(0, 5)); // 최대 5개만 표시
    } catch (error) {
      console.error('주변 식당 정보를 가져오는데 실패했습니다:', error);
    }
  }, [location]);

  // 주변 식당 정보 가져오기
  useEffect(() => {
    if (location) {
      loadNearbyRestaurants();
    }
  }, [location, loadNearbyRestaurants]);

  const handleAIRecommendation = async () => {
    // 위치 정보가 없으면 기본 위치 사용
    const currentLocation = location || {
      latitude: 37.5665,
      longitude: 126.9780,
    };

    setLoading(true);
    setError(null);
    
    try {
      const recommendations = await apiService.getRandomRestaurant(
        currentLocation.latitude,
        currentLocation.longitude
      );
      setAiRecommendations(recommendations);
      
      // 첫 번째 추천을 히스토리에 저장
      if (recommendations.recommendations.length > 0) {
        await apiService.postHistory(recommendations.recommendations[0].id);
      }
    } catch (error) {
      setError('AI 추천을 가져오는데 실패했습니다.');
      console.error('AI 추천 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-white">
      {/* 상단 헤더 영역 */}
      <div className="relative pt-12 pb-8 px-6">
        {/* 배경 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 via-orange-100/30 to-transparent"></div>
        
        {/* 헤더 컨텐츠 */}
        <div className="relative text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            점심 메뉴 추천
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            오늘 뭐 먹을지 정해볼까요?
          </p>
        </div>
      </div>

              {/* 위치 권한 안내 */}
        {error && (
          <div className="mx-6 mb-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-4 py-3 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <span className="text-xl mr-2">ℹ️</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 px-6 pb-32">
        {/* 중앙 메인 버튼 */}
        <div className="flex justify-center items-center mb-12">
          <button
            onClick={handleAIRecommendation}
            disabled={loading}
            className={`
              relative w-52 h-52 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95
              ${loading 
                ? 'bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 hover:from-orange-500 hover:via-red-600 hover:to-pink-600 shadow-orange-500/30'
              }
            `}
          >
            {/* 내부 그라데이션 오버레이 */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            
            {/* 메인 컨텐츠 */}
            <div className="relative flex flex-col items-center justify-center h-full text-white">
              <span className="text-5xl mb-4 drop-shadow-lg">
                {loading ? '⏳' : '🍽️'}
              </span>
              <span className="text-xl font-bold drop-shadow-md">
                {loading ? '추천 중...' : '오늘 뭐 먹지?'}
              </span>
            </div>
          </button>
        </div>

        {/* AI 추천 섹션 */}
        {aiRecommendations && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🤖 AI 추천 메뉴</h2>
              <p className="text-sm text-gray-600 mb-2">{aiRecommendations.user_location}</p>
              <p className="text-sm text-gray-500">총 {aiRecommendations.total_count}개 중 추천</p>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto"></div>
            </div>
            
            {/* 추천 목록 */}
            <div className="space-y-4">
              {aiRecommendations.recommendations.map((rec, index) => (
                <div key={rec.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          추천 #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {rec.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-orange-600">
                        AI 추천
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <span className="font-medium">추천 이유:</span> {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주변 식당 리스트 */}
        {nearbyRestaurants.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">주변 식당</h2>
              <span className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                {nearbyRestaurants.length}개
              </span>
            </div>
            <div className="space-y-4">
              {nearbyRestaurants.map((restaurant) => (
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
      </div>

      {/* 하단 탭바 네비게이션 (iOS 스타일) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-2xl">
        <div className="flex justify-around items-center py-4 px-6">
          <button
            onClick={() => navigate('/filter')}
            className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🍱</span>
            </div>
            <span className="text-xs font-medium text-gray-700">필터</span>
          </button>
          
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🗺️</span>
            </div>
            <span className="text-xs font-medium text-gray-700">지도</span>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">📜</span>
            </div>
            <span className="text-xs font-medium text-gray-700">히스토리</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 