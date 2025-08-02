import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { HistoryItem, CategoryStats } from '../types';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHistory();
      
      // 최근 1주일 데이터만 필터링
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const filteredHistory = data.filter(item => {
        const itemDate = new Date(item.selectedAt);
        return itemDate >= oneWeekAgo;
      });

      setHistory(filteredHistory);
      calculateCategoryStats(filteredHistory);
    } catch (err) {
      setError('히스토리를 가져오는데 실패했습니다.');
      console.error('히스토리 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryStats = (historyData: HistoryItem[]) => {
    const categoryCount: { [key: string]: number } = {};
    const total = historyData.length;

    historyData.forEach(item => {
      categoryCount[item.restaurantCategory] = (categoryCount[item.restaurantCategory] || 0) + 1;
    });

    const stats: CategoryStats[] = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    setCategoryStats(stats);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '한식': '#ff6b6b',
      '중식': '#feca57',
      '일식': '#45b7d1',
      '양식': '#4ecdc4',
      '분식': '#a55eea',
      '샐러드': '#26de81',
      '카페': '#fed330',
      '디저트': '#fc5c65'
    };
    return colors[category] || '#95a5a6';
  };

  const handleRestaurantClick = (restaurantId: number) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">히스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내가 고른 점심 히스토리</h1>
            <p className="text-gray-600">최근 1주일간의 선택 기록입니다</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            홈으로
          </button>
        </div>

        {/* 통계 섹션 */}
        {categoryStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">음식 종류 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 파이 차트 (CSS로 구현) */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">카테고리별 비율</h3>
                <div className="relative w-64 h-64 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {categoryStats.map((stat, index) => {
                      const previousStats = categoryStats.slice(0, index);
                      const previousPercentage = previousStats.reduce((sum, s) => sum + s.percentage, 0);
                      const startAngle = (previousPercentage / 100) * 360;
                      const endAngle = ((previousPercentage + stat.percentage) / 100) * 360;
                      
                      const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                      
                      const largeArcFlag = stat.percentage > 50 ? 1 : 0;
                      
                      return (
                        <path
                          key={stat.category}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={getCategoryColor(stat.category)}
                          stroke="white"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* 범례 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">카테고리별 상세</h3>
                <div className="space-y-3">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getCategoryColor(stat.category) }}
                        />
                        <span className="font-medium text-gray-900">{stat.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{stat.count}회</div>
                        <div className="text-sm text-gray-500">{stat.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 히스토리 리스트 */}
        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">선택 기록</h2>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRestaurantClick(item.restaurantId)}
                >
                  <img
                    src={item.restaurantImage}
                    alt={item.restaurantName}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=식당';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.restaurantName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {item.restaurantCategory}
                      </span>
                      <span>{formatDate(item.selectedAt)}</span>
                      <span>{formatTime(item.selectedAt)}</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              아직 선택한 식당이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              홈에서 "오늘 뭐 먹지?" 버튼을 눌러 식당을 선택해보세요
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 