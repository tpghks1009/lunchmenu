import { RestaurantDetail } from '../types';

export const sampleRestaurants: RestaurantDetail[] = [
  {
    id: 1,
    name: "맛있는 한식당",
    description: "정통 한식의 맛을 느낄 수 있는 곳입니다. 깔끔한 분위기와 맛있는 음식으로 손님들의 사랑을 받고 있습니다.",
    category: "한식",
    image: "https://via.placeholder.com/800x400/ff6b6b/ffffff?text=한식당",
    address: "서울특별시 강남구 테헤란로 123",
    rating: 4.5,
    distance: 150,
    phone: "02-1234-5678",
    openingHours: "11:00 - 22:00",
    priceRange: "1만원대",
    latitude: 37.5665,
    longitude: 126.9780,
    menu: [
      {
        id: 1,
        name: "불고기",
        price: 15000,
        description: "정통 불고기 맛",
        image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=불고기"
      },
      {
        id: 2,
        name: "비빔밥",
        price: 12000,
        description: "신선한 채소와 함께",
        image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=비빔밥"
      },
      {
        id: 3,
        name: "된장찌개",
        price: 8000,
        description: "집에서 먹는 맛",
        image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=된장찌개"
      }
    ],
    reviews: [
      {
        id: 1,
        userName: "김철수",
        rating: 5,
        comment: "정말 맛있어요! 다음에 또 올 예정입니다.",
        date: "2024-01-15"
      },
      {
        id: 2,
        userName: "이영희",
        rating: 4,
        comment: "분위기도 좋고 음식도 맛있어요.",
        date: "2024-01-10"
      }
    ]
  },
  {
    id: 2,
    name: "이탈리안 피자",
    description: "정통 나폴리 피자를 만드는 곳입니다. 도우부터 신선한 재료까지 모든 것이 완벽합니다.",
    category: "양식",
    image: "https://via.placeholder.com/800x400/4ecdc4/ffffff?text=피자",
    address: "서울특별시 강남구 테헤란로 456",
    rating: 4.2,
    distance: 300,
    phone: "02-2345-6789",
    openingHours: "12:00 - 23:00",
    priceRange: "2만원대",
    latitude: 37.5668,
    longitude: 126.9785,
    menu: [
      {
        id: 4,
        name: "마르게리타 피자",
        price: 22000,
        description: "클래식한 마르게리타",
        image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=마르게리타"
      },
      {
        id: 5,
        name: "페퍼로니 피자",
        price: 25000,
        description: "매콤달콤한 페퍼로니",
        image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=페퍼로니"
      }
    ],
    reviews: [
      {
        id: 3,
        userName: "박민수",
        rating: 4,
        comment: "피자가 정말 맛있어요! 도우가 쫄깃해요.",
        date: "2024-01-12"
      }
    ]
  },
  {
    id: 3,
    name: "스시로",
    description: "신선한 회와 정통 스시를 즐길 수 있는 곳입니다. 셰프의 손길이 느껴지는 맛있는 요리들.",
    category: "일식",
    image: "https://via.placeholder.com/800x400/45b7d1/ffffff?text=스시",
    address: "서울특별시 강남구 테헤란로 789",
    rating: 4.8,
    distance: 500,
    phone: "02-3456-7890",
    openingHours: "11:30 - 22:30",
    priceRange: "3만원대",
    latitude: 37.5662,
    longitude: 126.9775,
    menu: [
      {
        id: 6,
        name: "초밥 세트",
        price: 35000,
        description: "신선한 회로 만든 초밥",
        image: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=초밥"
      },
      {
        id: 7,
        name: "우동",
        price: 12000,
        description: "쫄깃한 면발의 우동",
        image: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=우동"
      }
    ],
    reviews: [
      {
        id: 4,
        userName: "최지영",
        rating: 5,
        comment: "회가 정말 신선하고 맛있어요!",
        date: "2024-01-14"
      },
      {
        id: 5,
        userName: "정수민",
        rating: 5,
        comment: "셰프님이 정말 친절하세요.",
        date: "2024-01-08"
      }
    ]
  },
  {
    id: 4,
    name: "중국집",
    description: "정통 중국 요리를 맛볼 수 있는 곳입니다. 짜장면부터 탕수육까지 모든 메뉴가 맛있습니다.",
    category: "중식",
    image: "https://via.placeholder.com/800x400/96ceb4/ffffff?text=중국집",
    address: "서울특별시 강남구 테헤란로 321",
    rating: 4.0,
    distance: 200,
    phone: "02-4567-8901",
    openingHours: "11:00 - 21:30",
    priceRange: "1만원대",
    latitude: 37.5670,
    longitude: 126.9790,
    menu: [
      {
        id: 8,
        name: "짜장면",
        price: 8000,
        description: "정통 짜장면",
        image: "https://via.placeholder.com/300x200/96ceb4/ffffff?text=짜장면"
      },
      {
        id: 9,
        name: "탕수육",
        price: 15000,
        description: "바삭한 탕수육",
        image: "https://via.placeholder.com/300x200/96ceb4/ffffff?text=탕수육"
      }
    ],
    reviews: [
      {
        id: 6,
        userName: "김영수",
        rating: 4,
        comment: "짜장면이 정말 맛있어요!",
        date: "2024-01-13"
      }
    ]
  },
  {
    id: 5,
    name: "분식당",
    description: "학교 앞 분식의 추억을 느낄 수 있는 곳입니다. 떡볶이부터 순대까지 모든 것이 맛있어요.",
    category: "분식",
    image: "https://via.placeholder.com/800x400/feca57/ffffff?text=분식",
    address: "서울특별시 강남구 테헤란로 654",
    rating: 4.3,
    distance: 100,
    phone: "02-5678-9012",
    openingHours: "10:00 - 20:00",
    priceRange: "5천원대",
    latitude: 37.5658,
    longitude: 126.9770,
    menu: [
      {
        id: 10,
        name: "떡볶이",
        price: 4000,
        description: "매콤달콤한 떡볶이",
        image: "https://via.placeholder.com/300x200/feca57/ffffff?text=떡볶이"
      },
      {
        id: 11,
        name: "순대",
        price: 3000,
        description: "쫄깃한 순대",
        image: "https://via.placeholder.com/300x200/feca57/ffffff?text=순대"
      }
    ],
    reviews: [
      {
        id: 7,
        userName: "박지민",
        rating: 4,
        comment: "학교 앞 분식 맛이에요!",
        date: "2024-01-11"
      }
    ]
  },
  {
    id: 6,
    name: "샐러드바",
    description: "신선한 채소와 건강한 식단을 즐길 수 있는 곳입니다. 다양한 토핑으로 나만의 샐러드를 만들어보세요.",
    category: "샐러드",
    image: "https://via.placeholder.com/800x400/26de81/ffffff?text=샐러드",
    address: "서울특별시 강남구 테헤란로 987",
    rating: 4.6,
    distance: 400,
    phone: "02-6789-0123",
    openingHours: "08:00 - 18:00",
    priceRange: "1만원대",
    latitude: 37.5672,
    longitude: 126.9788,
    menu: [
      {
        id: 12,
        name: "그린샐러드",
        price: 12000,
        description: "신선한 채소 샐러드",
        image: "https://via.placeholder.com/300x200/26de81/ffffff?text=샐러드"
      },
      {
        id: 13,
        name: "퀴노아볼",
        price: 15000,
        description: "건강한 퀴노아 볼",
        image: "https://via.placeholder.com/300x200/26de81/ffffff?text=퀴노아"
      }
    ],
    reviews: [
      {
        id: 8,
        userName: "이미영",
        rating: 5,
        comment: "건강하고 맛있어요!",
        date: "2024-01-09"
      }
    ]
  },
  {
    id: 7,
    name: "카페모카",
    description: "따뜻한 커피와 달콤한 디저트를 즐길 수 있는 카페입니다. 편안한 분위기에서 여유를 느껴보세요.",
    category: "카페",
    image: "https://via.placeholder.com/800x400/fed330/ffffff?text=카페",
    address: "서울특별시 강남구 테헤란로 147",
    rating: 4.4,
    distance: 250,
    phone: "02-7890-1234",
    openingHours: "07:00 - 22:00",
    priceRange: "5천원대",
    latitude: 37.5666,
    longitude: 126.9782,
    menu: [
      {
        id: 14,
        name: "아메리카노",
        price: 4500,
        description: "깊은 맛의 아메리카노",
        image: "https://via.placeholder.com/300x200/fed330/ffffff?text=커피"
      },
      {
        id: 15,
        name: "카페라떼",
        price: 5500,
        description: "부드러운 카페라떼",
        image: "https://via.placeholder.com/300x200/fed330/ffffff?text=라떼"
      }
    ],
    reviews: [
      {
        id: 9,
        userName: "최민호",
        rating: 4,
        comment: "커피가 정말 맛있어요!",
        date: "2024-01-07"
      }
    ]
  },
  {
    id: 8,
    name: "디저트하우스",
    description: "달콤한 디저트의 천국입니다. 케이크부터 마카롱까지 모든 디저트가 예쁘고 맛있어요.",
    category: "디저트",
    image: "https://via.placeholder.com/800x400/fc5c65/ffffff?text=디저트",
    address: "서울특별시 강남구 테헤란로 258",
    rating: 4.7,
    distance: 350,
    phone: "02-8901-2345",
    openingHours: "10:00 - 21:00",
    priceRange: "1만원대",
    latitude: 37.5669,
    longitude: 126.9787,
    menu: [
      {
        id: 16,
        name: "티라미수",
        price: 8000,
        description: "부드러운 티라미수",
        image: "https://via.placeholder.com/300x200/fc5c65/ffffff?text=티라미수"
      },
      {
        id: 17,
        name: "마카롱 세트",
        price: 12000,
        description: "다양한 맛의 마카롱",
        image: "https://via.placeholder.com/300x200/fc5c65/ffffff?text=마카롱"
      }
    ],
    reviews: [
      {
        id: 10,
        userName: "김소영",
        rating: 5,
        comment: "디저트가 너무 예뻐요!",
        date: "2024-01-06"
      }
    ]
  }
]; 