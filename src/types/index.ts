export interface Restaurant {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  address: string;
  rating: number;
  distance: number;
  latitude: number;
  longitude: number;
  url?: string; // Kakao URL (선택사항)
  phone?: string; // 전화번호 (선택사항)
  roadAddress?: string; // 도로명주소 (선택사항)
}

export interface RestaurantDetail extends Restaurant {
  phone: string;
  openingHours: string;
  priceRange: string;
  menu: MenuItem[];
  reviews: Review[];
  latitude: number;
  longitude: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface HistoryItem {
  id: number;
  restaurantId: number;
  restaurantName: string;
  restaurantCategory: string;
  restaurantImage: string;
  selectedAt: string;
  date: string;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
} 