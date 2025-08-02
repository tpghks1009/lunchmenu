import axios, { AxiosResponse, AxiosError } from 'axios';
import { Restaurant, RestaurantDetail, HistoryItem } from '../types';
import { sampleRestaurants } from '../data/sampleRestaurants';
import { sampleHistory } from '../data/sampleHistory';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 정적 호스팅을 위한 플래그 (환경 변수로 제어 가능)
const USE_SAMPLE_DATA = process.env.NODE_ENV === 'production';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (로깅, 토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리, 로깅 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // 에러 메시지 처리
    if (error.response?.status === 404) {
      throw new Error('요청한 리소스를 찾을 수 없습니다.');
    } else if (error.response?.status === 500) {
      throw new Error('서버 오류가 발생했습니다.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('요청 시간이 초과되었습니다.');
    } else if (!error.response) {
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
);

// 샘플 데이터에서 랜덤 선택 함수
const getRandomRestaurantFromSample = (): Restaurant => {
  const randomIndex = Math.floor(Math.random() * sampleRestaurants.length);
  return sampleRestaurants[randomIndex];
};

// 샘플 데이터에서 카테고리별 필터링 함수
const getRestaurantsByCategoryFromSample = (category: string): Restaurant[] => {
  return sampleRestaurants.filter(restaurant => restaurant.category === category);
};

// 샘플 데이터에서 검색 함수
const searchRestaurantsFromSample = (query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase();
  return sampleRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(lowerQuery) ||
    restaurant.description.toLowerCase().includes(lowerQuery) ||
    restaurant.category.toLowerCase().includes(lowerQuery)
  );
};

// API 서비스 클래스
class ApiService {
  /**
   * 식당 목록 조회 (위치 기반, 카테고리 필터링 가능)
   * @param lat 위도
   * @param lng 경도
   * @param category 카테고리 (선택사항)
   * @returns 식당 목록
   */
  async getRestaurants(lat: number, lng: number, category?: string): Promise<Restaurant[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        if (category) {
          return getRestaurantsByCategoryFromSample(category);
        }
        return sampleRestaurants;
      }

      // 실제 API 호출
      const params: any = { lat, lng };
      if (category) {
        params.category = category;
      }

      const response = await apiClient.get<Restaurant[]>('/api/restaurants', { params });
      return response.data;
    } catch (error) {
      console.error('getRestaurants error:', error);
      throw error;
    }
  }

  /**
   * AI 기반 식당 추천 (위치 기반)
   * @param lat 위도
   * @param lng 경도
   * @returns AI 추천 식당 목록
   */
  async getRandomRestaurant(lat: number, lng: number): Promise<{recommendations: Array<{id: number, reason: string}>, total_count: number, user_location: string}> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션
        const randomRestaurant = getRandomRestaurantFromSample();
        return {
          recommendations: [{ id: randomRestaurant.id, reason: "샘플 데이터 추천" }],
          total_count: 1,
          user_location: "샘플 위치"
        };
      }

      // 실제 API 호출
      const response = await apiClient.get<{recommendations: Array<{id: number, reason: string}>, total_count: number, user_location: string}>('/api/restaurants/random', {
        params: { lat, lng }
      });
      return response.data;
    } catch (error) {
      console.error('getRandomRestaurant error:', error);
      throw error;
    }
  }

  /**
   * 식당 상세 정보 조회
   * @param id 식당 ID
   * @returns 식당 상세 정보
   */
  async getRestaurantDetail(id: number): Promise<RestaurantDetail> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터에서 상세 정보 찾기
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        const restaurant = sampleRestaurants.find(r => r.id === id);
        if (!restaurant) {
          throw new Error('식당을 찾을 수 없습니다.');
        }
        
        // RestaurantDetail 형태로 변환 (샘플 데이터에 없는 필드들은 기본값 사용)
        const detail: RestaurantDetail = {
          ...restaurant,
          phone: restaurant.phone || '02-1234-5678',
          openingHours: restaurant.openingHours || '11:00 - 22:00',
          priceRange: restaurant.priceRange || '1만원 - 2만원',
          menu: restaurant.menu || [
            { id: 1, name: '대표 메뉴', price: 15000, description: '맛있는 대표 메뉴입니다.' }
          ],
          reviews: restaurant.reviews || [
            { id: 1, userName: '고객1', rating: 4.5, comment: '맛있어요!', date: '2024-01-15' }
          ],
          latitude: restaurant.latitude || 37.5665,
          longitude: restaurant.longitude || 126.9780
        };
        
        return detail;
      }

      // 실제 API 호출
      const response = await apiClient.get<RestaurantDetail>(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('getRestaurantDetail error:', error);
      throw error;
    }
  }

  /**
   * 히스토리 저장
   * @param restaurantId 식당 ID
   */
  async postHistory(restaurantId: number): Promise<void> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터에서는 콘솔에만 로그
        console.log('히스토리 저장:', restaurantId);
        await new Promise(resolve => setTimeout(resolve, 200)); // 로딩 시뮬레이션
        return;
      }

      // 실제 API 호출
      await apiClient.post('/api/history', { restaurantId });
    } catch (error) {
      console.error('postHistory error:', error);
      throw error;
    }
  }

  /**
   * 히스토리 조회
   * @returns 히스토리 목록
   */
  async getHistory(): Promise<HistoryItem[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 400)); // 로딩 시뮬레이션
        return sampleHistory;
      }

      // 실제 API 호출
      const response = await apiClient.get<HistoryItem[]>('/api/history');
      return response.data;
    } catch (error) {
      console.error('getHistory error:', error);
      throw error;
    }
  }

  /**
   * 기간별 히스토리 조회
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * @returns 히스토리 목록
   */
  async getHistoryByDateRange(startDate: string, endDate: string): Promise<HistoryItem[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터에서 날짜 필터링
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return sampleHistory.filter(item => {
          const itemDate = new Date(item.selectedAt);
          return itemDate >= start && itemDate <= end;
        });
      }

      // 실제 API 호출
      const response = await apiClient.get<HistoryItem[]>('/api/history/range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('getHistoryByDateRange error:', error);
      throw error;
    }
  }

  /**
   * 카테고리별 식당 조회
   * @param category 카테고리
   * @returns 식당 목록
   */
  async getRestaurantsByCategory(category: string): Promise<Restaurant[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 400)); // 로딩 시뮬레이션
        return getRestaurantsByCategoryFromSample(category);
      }

      // 실제 API 호출
      const response = await apiClient.get<Restaurant[]>(`/api/restaurants/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('getRestaurantsByCategory error:', error);
      throw error;
    }
  }

  /**
   * 식당 검색
   * @param query 검색어
   * @returns 식당 목록
   */
  async searchRestaurants(query: string): Promise<Restaurant[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        return searchRestaurantsFromSample(query);
      }

      // 실제 API 호출
      const response = await apiClient.get<Restaurant[]>('/api/restaurants/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('searchRestaurants error:', error);
      throw error;
    }
  }

  /**
   * 히스토리 삭제
   * @param historyId 히스토리 ID
   */
  async deleteHistory(historyId: number): Promise<void> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터에서는 콘솔에만 로그
        console.log('히스토리 삭제:', historyId);
        await new Promise(resolve => setTimeout(resolve, 200)); // 로딩 시뮬레이션
        return;
      }

      // 실제 API 호출
      await apiClient.delete(`/api/history/${historyId}`);
    } catch (error) {
      console.error('deleteHistory error:', error);
      throw error;
    }
  }

  /**
   * 선호도 업데이트
   * @param restaurantId 식당 ID
   * @param rating 평점
   * @param comment 코멘트 (선택사항)
   */
  async updatePreference(restaurantId: number, rating: number, comment?: string): Promise<void> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터에서는 콘솔에만 로그
        console.log('선호도 업데이트:', { restaurantId, rating, comment });
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        return;
      }

      // 실제 API 호출
      await apiClient.put(`/api/preferences/${restaurantId}`, { rating, comment });
    } catch (error) {
      console.error('updatePreference error:', error);
      throw error;
    }
  }

  /**
   * Kakao Nearby API를 통한 주변 식당 조회
   * @param lat 위도
   * @param lng 경도
   * @param radius 검색 반경 (미터, 기본값: 1000)
   * @returns 주변 식당 목록
   */
  async getKakaoNearbyRestaurants(lat: number, lng: number, radius: number = 1000): Promise<Restaurant[]> {
    try {
      if (USE_SAMPLE_DATA) {
        // 샘플 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        return sampleRestaurants;
      }

      // 실제 API 호출 (KakaoRestaurant 타입으로 받음)
      const response = await apiClient.get<any[]>('/api/restaurants/kakao-nearby', {
        params: { lat, lng, radius }
      });
      
      // KakaoRestaurant를 Restaurant 타입으로 변환 (URL 포함)
      const restaurants: Restaurant[] = response.data.map((item: any, index: number) => ({
        id: index + 1, // 임시 ID 생성
        name: item.name,
        description: item.category || '음식점',
        category: item.category || '기타',
        image: '/images/restaurant-default.jpg', // 기본 이미지
        address: item.address || item.road_address || '주소 정보 없음',
        rating: 4.0, // 기본 평점
        distance: item.distance || 0,
        latitude: item.lat,
        longitude: item.lng,
        url: item.url, // Kakao URL 추가
        phone: item.phone, // 전화번호 추가
        roadAddress: item.road_address // 도로명주소 추가
      }));
      
      return restaurants;
    } catch (error) {
      console.error('getKakaoNearbyRestaurants error:', error);
      throw error;
    }
  }
}

// API 서비스 인스턴스 생성 및 내보내기
export const apiService = new ApiService(); 