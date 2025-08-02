import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { RestaurantDetail } from '../types';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurantDetail = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRestaurantDetail(parseInt(id));
        setRestaurant(data);
      } catch (err) {
        setError('식당 정보를 가져오는데 실패했습니다.');
        console.error('식당 상세 정보 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetail();
  }, [id]);

  const handleSelectRestaurant = async () => {
    if (!restaurant) return;

    try {
      setSelecting(true);
      await apiService.postHistory(restaurant.id);
      
      // 성공 메시지 표시 후 홈으로 이동
      alert(`${restaurant.name}을(를) 선택했습니다!`);
      navigate('/');
    } catch (err) {
      setError('식당 선택에 실패했습니다.');
      console.error('식당 선택 에러:', err);
    } finally {
      setSelecting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-xl">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-xl">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-xl">
          ☆
        </span>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">식당 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error || '식당을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              뒤로가기
            </button>
            <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="w-20"></div> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 메인 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* 이미지 */}
          <div className="relative h-64 md:h-80">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=식당+이미지';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {restaurant.category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {restaurant.distance}m
              </span>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(restaurant.rating)}
                    <span className="text-gray-600 ml-2">{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{restaurant.priceRange}</span>
                </div>
              </div>
              <button
                onClick={handleSelectRestaurant}
                disabled={selecting}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {selecting ? '선택 중...' : '이 식당으로 선택하기'}
              </button>
            </div>

            <p className="text-gray-700 text-lg mb-6">{restaurant.description}</p>

            {/* 상세 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📍 주소</h3>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📞 연락처</h3>
                <p className="text-gray-600">{restaurant.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🕒 영업시간</h3>
                <p className="text-gray-600">{restaurant.openingHours}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💰 가격대</h3>
                <p className="text-gray-600">{restaurant.priceRange}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        {restaurant.menu && restaurant.menu.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🍽️ 메뉴</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  )}
                  <p className="text-blue-600 font-semibold">{item.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 섹션 */}
        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">💬 리뷰</h3>
            <div className="space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{review.userName}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage; 