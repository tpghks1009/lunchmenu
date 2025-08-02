import logging
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
import random
import math
from datetime import datetime
from pydantic import BaseModel
from ..services.ai_service import AIService
from ..services.kakao_service import KakaoService

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic 모델 정의
class Restaurant(BaseModel):
    id: int
    name: str
    category: str
    address: str
    latitude: float
    longitude: float
    rating: float
    priceRange: str
    image: str
    description: str
    distance: Optional[float] = None

class KakaoRestaurant(BaseModel):
    id: str
    name: str
    category: str
    distance: int
    address: str
    lat: float
    lng: float
    url: str
    phone: Optional[str] = None
    category_group: Optional[str] = None
    road_address: Optional[str] = None

class AIRecommendation(BaseModel):
    id: int
    reason: str

class AIRecommendationResponse(BaseModel):
    recommendations: List[AIRecommendation]
    total_count: int
    user_location: str

class RestaurantDetail(Restaurant):
    phone: str
    openingHours: str
    menu: List[dict]
    reviews: List[dict]

class HistoryItem(BaseModel):
    id: int
    restaurantId: int
    restaurantName: str
    restaurantCategory: str
    selectedAt: str

class HistoryRequest(BaseModel):
    restaurantId: int

# 데이터 파일 경로
RESTAURANTS_FILE = "data/restaurants.json"
HISTORY_FILE = "storage/history.json"

def load_restaurants() -> List[dict]:
    """식당 데이터 로드"""
    try:
        with open(RESTAURANTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_history(history: List[dict]):
    """히스토리 데이터 저장"""
    import os
    os.makedirs("storage", exist_ok=True)
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_history() -> List[dict]:
    """히스토리 데이터 로드"""
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """두 지점 간의 거리 계산 (미터 단위)"""
    R = 6371000  # 지구 반지름 (미터)
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

@router.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants(
    lat: float = Query(..., description="위도"),
    lng: float = Query(..., description="경도"),
    category: Optional[str] = Query(None, description="카테고리 필터")
):
    """위치 기반 식당 목록 조회 (카테고리 필터링 가능)"""
    restaurants = load_restaurants()
    
    # 거리 계산 및 필터링
    filtered_restaurants = []
    for restaurant in restaurants:
        distance = calculate_distance(lat, lng, restaurant['latitude'], restaurant['longitude'])
        restaurant['distance'] = round(distance)
        
        # 카테고리 필터 적용
        if category and restaurant['category'] != category:
            continue
            
        filtered_restaurants.append(restaurant)
    
    # 거리순 정렬
    filtered_restaurants.sort(key=lambda x: x['distance'])
    
    return filtered_restaurants

@router.get("/restaurants/kakao-nearby", response_model=List[KakaoRestaurant])
async def get_kakao_nearby_restaurants(
    lat: float = Query(..., description="위도"),
    lng: float = Query(..., description="경도"),
    radius: int = Query(1000, description="검색 반경 (미터)")
):
    """카카오 로컬 API를 통한 근처 음식점 검색"""
    logger.info(f"🔍 카카오 근처 음식점 검색 요청 - 위치: ({lat}, {lng}), 반경: {radius}m")
    
    try:
        restaurants = await KakaoService.search_nearby_restaurants(lat, lng, radius)
        logger.info(f"✅ 카카오 음식점 검색 완료: {len(restaurants)}개")
        return restaurants
    except Exception as e:
        logger.error(f"❌ 카카오 음식점 검색 실패: {e}")
        raise HTTPException(status_code=500, detail="음식점 검색 중 오류가 발생했습니다.")

@router.get("/restaurants/random", response_model=AIRecommendationResponse)
async def get_ai_recommendations(
    lat: float = Query(..., description="위도"),
    lng: float = Query(..., description="경도")
):
    """AI 기반 식당 추천 (RAG 구조)"""
    logger.info(f"🎯 AI 추천 요청 받음 - 위치: ({lat}, {lng})")
    
    restaurants = load_restaurants()
    logger.info(f"📊 전체 식당 데이터: {len(restaurants)}개")
    
    # 1km 이내 식당 필터링
    nearby_restaurants = []
    for restaurant in restaurants:
        distance = calculate_distance(lat, lng, restaurant['latitude'], restaurant['longitude'])
        if distance <= 1000:  # 1km 이내
            restaurant['distance'] = round(distance)
            nearby_restaurants.append(restaurant)
    
    logger.info(f"📍 1km 이내 식당: {len(nearby_restaurants)}개")
    
    # if not nearby_restaurants:
    #     raise HTTPException(status_code=404, detail="1km 이내에 식당이 없습니다.")
    
    # 사용자 위치 정보 생성 (간단한 지역명)
    user_location = f"위도 {lat:.4f}, 경도 {lng:.4f}"
    
    # AI 추천 받기
    logger.info("🤖 AI 서비스 호출 시작...")
    ai_recommendations = await AIService.get_ai_recommendations(nearby_restaurants, user_location)
    logger.info(f"✅ AI 추천 완료: {len(ai_recommendations)}개 추천")
    
    return AIRecommendationResponse(
        recommendations=ai_recommendations,
        total_count=len(nearby_restaurants),
        user_location=user_location
    )

@router.get("/restaurants/{restaurant_id}", response_model=RestaurantDetail)
async def get_restaurant_detail(restaurant_id: int):
    """ID 기반 식당 상세정보 조회"""
    restaurants = load_restaurants()
    
    for restaurant in restaurants:
        if restaurant['id'] == restaurant_id:
            # 상세 정보 구성 (기본 필드 + 추가 필드)
            detail = {
                **restaurant,
                'phone': restaurant.get('phone', '02-1234-5678'),
                'openingHours': restaurant.get('openingHours', '11:00 - 22:00'),
                'menu': restaurant.get('menu', []),
                'reviews': restaurant.get('reviews', [])
            }
            return detail
    
    raise HTTPException(status_code=404, detail="식당을 찾을 수 없습니다.")

@router.post("/history")
async def post_history(request: HistoryRequest):
    """선택한 식당 ID 저장"""
    restaurants = load_restaurants()
    history = load_history()
    
    # 식당 정보 찾기
    restaurant = None
    for r in restaurants:
        if r['id'] == request.restaurantId:
            restaurant = r
            break
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="식당을 찾을 수 없습니다.")
    
    # 히스토리 아이템 생성
    history_item = {
        'id': len(history) + 1,
        'restaurantId': request.restaurantId,
        'restaurantName': restaurant['name'],
        'restaurantCategory': restaurant['category'],
        'selectedAt': datetime.now().isoformat()
    }
    
    history.append(history_item)
    save_history(history)
    
    return {"message": "히스토리가 저장되었습니다.", "id": history_item['id']}

@router.get("/history", response_model=List[HistoryItem])
async def get_history():
    """저장된 히스토리 반환"""
    history = load_history()
    return history 