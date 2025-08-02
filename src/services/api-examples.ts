import { apiService } from './api';

/**
 * API 서비스 사용 예시
 * 이 파일은 개발 참고용으로만 사용됩니다.
 */

// 1. 식당 목록 조회 (위치 기반)
export const exampleGetRestaurants = async () => {
  try {
    const restaurants = await apiService.getRestaurants(37.5665, 126.9780);
    console.log('주변 식당 목록:', restaurants);
    return restaurants;
  } catch (error) {
    console.error('식당 목록 조회 실패:', error);
  }
};

// 2. 카테고리별 식당 조회
export const exampleGetRestaurantsByCategory = async () => {
  try {
    const koreanRestaurants = await apiService.getRestaurantsByCategory('한식');
    console.log('한식 식당 목록:', koreanRestaurants);
    return koreanRestaurants;
  } catch (error) {
    console.error('카테고리별 식당 조회 실패:', error);
  }
};

// 3. 랜덤 식당 추천
export const exampleGetRandomRestaurant = async () => {
  try {
    const randomRestaurant = await apiService.getRandomRestaurant(37.5665, 126.9780);
    console.log('랜덤 추천 식당:', randomRestaurant);
    return randomRestaurant;
  } catch (error) {
    console.error('랜덤 추천 실패:', error);
  }
};

// 4. 식당 상세 정보 조회
export const exampleGetRestaurantDetail = async () => {
  try {
    const restaurantDetail = await apiService.getRestaurantDetail(1);
    console.log('식당 상세 정보:', restaurantDetail);
    return restaurantDetail;
  } catch (error) {
    console.error('식당 상세 정보 조회 실패:', error);
  }
};

// 5. 히스토리 저장
export const examplePostHistory = async () => {
  try {
    await apiService.postHistory(1);
    console.log('히스토리 저장 성공');
  } catch (error) {
    console.error('히스토리 저장 실패:', error);
  }
};

// 6. 히스토리 목록 조회
export const exampleGetHistory = async () => {
  try {
    const history = await apiService.getHistory();
    console.log('히스토리 목록:', history);
    return history;
  } catch (error) {
    console.error('히스토리 조회 실패:', error);
  }
};

// 7. 특정 기간 히스토리 조회
export const exampleGetHistoryByDateRange = async () => {
  try {
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const history = await apiService.getHistoryByDateRange(startDate, endDate);
    console.log('기간별 히스토리:', history);
    return history;
  } catch (error) {
    console.error('기간별 히스토리 조회 실패:', error);
  }
};

// 8. 식당 검색
export const exampleSearchRestaurants = async () => {
  try {
    const searchResults = await apiService.searchRestaurants('피자');
    console.log('검색 결과:', searchResults);
    return searchResults;
  } catch (error) {
    console.error('식당 검색 실패:', error);
  }
};

// 9. 히스토리 삭제
export const exampleDeleteHistory = async () => {
  try {
    await apiService.deleteHistory(1);
    console.log('히스토리 삭제 성공');
  } catch (error) {
    console.error('히스토리 삭제 실패:', error);
  }
};

// 10. 사용자 선호도 업데이트
export const exampleUpdatePreference = async () => {
  try {
    await apiService.updatePreference(1, 5, '정말 맛있었어요!');
    console.log('선호도 업데이트 성공');
  } catch (error) {
    console.error('선호도 업데이트 실패:', error);
  }
};

// 11. 복합 예시: 랜덤 추천 후 히스토리 저장
export const exampleRandomRecommendationFlow = async () => {
  try {
    // 1. 랜덤 식당 추천
    const randomRecommendation = await apiService.getRandomRestaurant(37.5665, 126.9780);
    console.log('추천 결과:', randomRecommendation);

    // 추천된 식당 ID로 상세 정보 조회
    if (randomRecommendation.recommendations.length > 0) {
      const recommendedId = randomRecommendation.recommendations[0].id;
      
      // 2. 상세 정보 조회
      const detail = await apiService.getRestaurantDetail(recommendedId);
      console.log('상세 정보:', detail);

      // 3. 히스토리에 저장
      await apiService.postHistory(recommendedId);
      console.log('히스토리 저장 완료');

      return { recommendation: randomRecommendation, detail };
    } else {
      console.log('추천된 식당이 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('랜덤 추천 플로우 실패:', error);
  }
};

// 12. 에러 처리 예시
export const exampleErrorHandling = async () => {
  try {
    // 존재하지 않는 식당 ID로 테스트
    await apiService.getRestaurantDetail(99999);
  } catch (error) {
    if (error instanceof Error) {
      console.log('에러 메시지:', error.message);
      
      // 에러 타입에 따른 처리
      if (error.message.includes('404')) {
        console.log('식당을 찾을 수 없습니다.');
      } else if (error.message.includes('500')) {
        console.log('서버 오류가 발생했습니다.');
      } else if (error.message.includes('시간이 초과')) {
        console.log('요청 시간이 초과되었습니다.');
      } else if (error.message.includes('네트워크')) {
        console.log('네트워크 연결을 확인해주세요.');
      }
    }
  }
}; 