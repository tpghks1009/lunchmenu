import React from 'react';
import RestaurantCard from './RestaurantCard';

const RestaurantCardDemo: React.FC = () => {
  const demoRestaurants = [
    {
      id: 1,
      name: "맛있는 한식당",
      category: "한식",
      distance: 150,
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=한식당",
      description: "정통 한식의 맛을 느낄 수 있는 곳입니다. 깔끔한 분위기와 맛있는 음식으로 손님들의 사랑을 받고 있습니다."
    },
    {
      id: 2,
      name: "이탈리안 피자",
      category: "양식",
      distance: 300,
      rating: 4.2,
      imageUrl: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=피자",
      description: "정통 나폴리 피자를 만드는 곳입니다. 도우부터 신선한 재료까지 모든 것이 완벽합니다."
    },
    {
      id: 3,
      name: "스시로",
      category: "일식",
      distance: 500,
      rating: 4.8,
      imageUrl: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=스시",
      description: "신선한 회와 정통 스시를 즐길 수 있는 곳입니다. 셰프의 손길이 느껴지는 맛있는 요리들."
    },
    {
      id: 4,
      name: "중국집",
      category: "중식",
      distance: 200,
      rating: 4.0,
      imageUrl: "https://via.placeholder.com/300x200/96ceb4/ffffff?text=중국집",
      description: "정통 중국 요리를 맛볼 수 있는 곳입니다. 짜장면부터 탕수육까지 모든 메뉴가 맛있습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          RestaurantCard 컴포넌트 데모
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {demoRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              category={restaurant.category}
              distance={restaurant.distance}
              rating={restaurant.rating}
              imageUrl={restaurant.imageUrl}
              description={restaurant.description}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">컴포넌트 특징</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 개별 props로 데이터 전달 (name, category, distance, rating, imageUrl, id)</li>
            <li>• 클릭 시 RestaurantDetail 페이지로 자동 이동</li>
            <li>• Tailwind CSS로 스타일링</li>
            <li>• 호버 효과와 애니메이션</li>
            <li>• 별점 시각화 (5점 만점)</li>
            <li>• 거리 표시 (m/km 자동 변환)</li>
            <li>• 이미지 로드 실패 시 플레이스홀더 표시</li>
            <li>• 반응형 디자인</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardDemo; 