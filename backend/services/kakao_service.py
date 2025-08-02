import aiohttp
import logging
from typing import List, Dict, Any, Optional
from ..config import KAKAO_REST_API_KEY

logger = logging.getLogger(__name__)

class KakaoService:
    """카카오 로컬 API 서비스"""
    
    BASE_URL = "https://dapi.kakao.com/v2/local/search/category.json"
    
    @staticmethod
    def extract_place_id(place_url: str) -> str:
        """place_url에서 place_id 추출"""
        try:
            # place_url의 마지막 세그먼트를 place_id로 사용
            return place_url.split('/')[-1]
        except:
            return "unknown"
    
    @staticmethod
    async def search_nearby_restaurants(
        lat: float, 
        lng: float, 
        radius: int = 1000
    ) -> List[Dict[str, Any]]:
        """근처 음식점 검색"""
        
        if not KAKAO_REST_API_KEY:
            logger.error("❌ KAKAO_REST_API_KEY가 설정되지 않았습니다.")
            return []
        
        headers = {
            "Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"
        }
        
        params = {
            "category_group_code": "FD6",  # 음식점 카테고리
            "x": str(lng),  # 경도
            "y": str(lat),  # 위도
            "radius": str(radius),  # 검색 반경 (미터)
            "sort": "distance",  # 거리순 정렬
            "size": "10"  # 검색 결과 수
        }
        
        try:
            logger.info(f"🔍 카카오 API 호출 - 위치: ({lat}, {lng}), 반경: {radius}m")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    KakaoService.BASE_URL, 
                    headers=headers, 
                    params=params
                ) as response:
                    
                    if response.status != 200:
                        logger.error(f"❌ 카카오 API 호출 실패: {response.status}")
                        return []
                    
                    data = await response.json()
                    logger.info(f"✅ 카카오 API 응답 받음: {len(data.get('documents', []))}개 결과")
                    
                    # 응답 데이터 정제
                    restaurants = []
                    for place in data.get('documents', []):
                        restaurant = {
                            "id": KakaoService.extract_place_id(place.get('place_url', '')),
                            "name": place.get('place_name', ''),
                            "category": place.get('category_name', ''),
                            "distance": int(place.get('distance', 0)),
                            "address": place.get('address_name', ''),
                            "lat": float(place.get('y', 0)),
                            "lng": float(place.get('x', 0)),
                            "url": place.get('place_url', ''),
                            "phone": place.get('phone', ''),
                            "category_group": place.get('category_group_name', ''),
                            "road_address": place.get('road_address_name', '')
                        }
                        restaurants.append(restaurant)
                    
                    logger.info(f"🍽️ 정제된 음식점 데이터: {len(restaurants)}개")
                    return restaurants
                    
        except Exception as e:
            logger.error(f"❌ 카카오 API 호출 중 에러 발생: {e}")
            return [] 