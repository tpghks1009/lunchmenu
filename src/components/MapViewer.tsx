import React, { useEffect, useRef, useState } from 'react';
import { MapRestaurant } from '../types/google-map';

interface MapViewerProps {
  restaurants: MapRestaurant[];
  center?: {
    latitude: number;
    longitude: number;
  };
  onRestaurantClick?: (restaurant: MapRestaurant) => void;
}

const MapViewer: React.FC<MapViewerProps> = ({
  restaurants,
  center,
  onRestaurantClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Maps API 로드
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY || 'YOUR_GOOGLE_MAP_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setError('구글 지도 API를 로드할 수 없습니다.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!window.google || !window.google.maps || !mapRef.current || isLoading) return;

    try {
      const defaultCenter = center || {
        latitude: 37.5665,
        longitude: 126.9780
      };

      const mapOptions = {
        center: { 
          lat: defaultCenter.latitude, 
          lng: defaultCenter.longitude 
        },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      };

      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(googleMap);

      // 정보창 생성
      const infoWindowInstance = new window.google.maps.InfoWindow();
      setInfoWindow(infoWindowInstance);

    } catch (err) {
      setError('지도를 초기화할 수 없습니다.');
      console.error('지도 초기화 에러:', err);
    }
  }, [isLoading, center]);

  // 마커 생성 및 관리
  useEffect(() => {
    if (!map || !window.google || !window.google.maps) return;

    // 기존 마커들 제거
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    restaurants.forEach((restaurant) => {
      const markerPosition = { 
        lat: restaurant.latitude, 
        lng: restaurant.longitude 
      };

      // 마커 생성
      const marker = new window.google.maps.Marker({
        position: markerPosition,
        map: map,
        title: restaurant.name,
        icon: {
          url: getMarkerIconUrl(restaurant.category),
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 30)
        },
        animation: window.google.maps.Animation.DROP
      });

      // 마커 클릭 이벤트
      marker.addListener('click', () => {
        const content = `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${restaurant.name}</h3>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${restaurant.category}</p>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${restaurant.address}</p>
            ${restaurant.rating ? `<p style="margin: 0 0 8px 0; color: #f39c12;">⭐ ${restaurant.rating}</p>` : ''}
            <button 
              onclick="window.selectRestaurant(${restaurant.id})"
              style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;"
            >
              선택하기
            </button>
          </div>
        `;

        infoWindow.setContent(content);
        infoWindow.open(map, marker);

        // 전역 함수로 선택 이벤트 처리
        (window as any).selectRestaurant = (id: number) => {
          const selectedRestaurant = restaurants.find(r => r.id === id);
          if (selectedRestaurant && onRestaurantClick) {
            onRestaurantClick(selectedRestaurant);
          }
          infoWindow.close();
        };
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, restaurants, infoWindow, onRestaurantClick]);

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);
        map.setZoom(15);

        // 현재 위치 마커 추가
        new window.google.maps.Marker({
          position: pos,
          map: map,
          title: '현재 위치',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });
      },
      (error) => {
        console.error('현재 위치를 가져올 수 없습니다:', error);
      }
    );
  };

  // 마커 아이콘 URL 생성
  const getMarkerIconUrl = (category: string): string => {
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

    const color = colors[category] || '#95a5a6';
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🍽️</text>
      </svg>
    `)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 지도 컨트롤 */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={moveToCurrentLocation}
          className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-md transition-colors"
          title="현재 위치로 이동"
        >
          📍
        </button>
      </div>
      
      {/* 지도 컨테이너 */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default MapViewer; 