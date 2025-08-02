declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleMapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId?: string;
}

export interface GoogleMarkerOptions {
  position: { lat: number; lng: number };
  map?: any;
  title?: string;
  icon?: string;
  animation?: number;
}

export interface GoogleInfoWindowOptions {
  content: string;
  position?: { lat: number; lng: number };
  maxWidth?: number;
}

export interface MapRestaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  rating?: number;
  priceRange?: string;
  url?: string; // Kakao URL (선택사항)
  phone?: string; // 전화번호 (선택사항)
  roadAddress?: string; // 도로명주소 (선택사항)
  distance?: number; // 거리 (선택사항)
} 