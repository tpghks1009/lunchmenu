from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from typing import List, Dict, Any
import logging
import re
from ..config import OPENAI_API_KEY

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_json_response(content: str) -> str:
    """AI 응답에서 마크다운 코드 블록을 제거하고 JSON만 추출"""
    # 정규식으로 마크다운 코드 블록 제거
    # ```json ... ``` 또는 ``` ... ``` 패턴 제거
    content = re.sub(r'^```(?:json)?\s*', '', content, flags=re.MULTILINE)
    content = re.sub(r'\s*```$', '', content, flags=re.MULTILINE)
    
    # 앞뒤 공백 제거
    content = content.strip()
    
    return content

# LangChain OpenAI 클라이언트 설정
if OPENAI_API_KEY:
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        openai_api_key=OPENAI_API_KEY
    )
    logger.info("✅ LangChain OpenAI 클라이언트가 성공적으로 초기화되었습니다.")
else:
    llm = None
    logger.warning("⚠️ OPENAI_API_KEY가 설정되지 않아 기본 추천 모드로 동작합니다.")

class AIService:
    """AI 추천 서비스"""
    
    @staticmethod
    def create_restaurant_prompt(restaurants: List[Dict[str, Any]], user_location: str) -> str:
        """식당 추천을 위한 프롬프트 생성"""
        
        logger.info(f"📍 사용자 위치: {user_location}")
        logger.info(f"🍽️ 분석할 식당 수: {len(restaurants)}개")
        
        # 식당 목록을 텍스트로 변환
        restaurant_list = []
        for i, restaurant in enumerate(restaurants, 1):
            restaurant_list.append(
                f"{i}. {restaurant['name']} - {restaurant['category']}, "
                f"{restaurant['rating']}점, {restaurant['distance']}m, "
                f"{restaurant.get('description', '점심 메뉴')}"
            )
        
        restaurant_text = "\n".join(restaurant_list)
        
        prompt = f"""
사용자 위치는 {user_location}이며, 아래는 1km 이내 식당 목록입니다.
점심 시간에 어울리는 순서대로 추천해 주세요. 추천 이유도 간단히 포함해 주세요.

{restaurant_text}

선정 기준:
- 점심에 어울리는 메뉴인가?
- 거리 (가까울수록 좋음)
- 식사 시간 효율성
- 평점

응답 형식은 다음과 같아야 해:

[
  {{ "id": 3, "reason": "매우 가까우며 간편식 가능" }},
  {{ "id": 5, "reason": "4.6점 고평점 + 점심 인기 메뉴" }},
  ...
]

중요: 마크다운 코드 블록(```json)을 사용하지 말고 순수 JSON 형식으로만 응답해주세요.
"""
        logger.info("📝 AI 프롬프트가 생성되었습니다.")
        return prompt
    
    @staticmethod
    async def get_ai_recommendations(restaurants: List[Dict[str, Any]], user_location: str) -> List[Dict[str, Any]]:
        """AI를 통한 식당 추천"""
        
        if not llm:
            logger.warning("🚫 LLM이 초기화되지 않아 기본 랜덤 추천을 사용합니다.")
            # API 키가 없으면 기본 랜덤 추천
            import random
            if restaurants:
                selected = random.choice(restaurants)
                logger.info(f"🎲 기본 추천: {selected['name']}")
                return [{"id": selected["id"], "reason": "기본 추천"}]
            return []
        
        try:
            logger.info("🤖 AI 추천을 시작합니다...")
            prompt = AIService.create_restaurant_prompt(restaurants, user_location)
            
            # LangChain을 사용한 AI 호출
            messages = [
                SystemMessage(content="당신은 점심 메뉴 추천 전문가입니다. 사용자의 위치와 주변 식당 정보를 바탕으로 점심에 가장 적합한 식당을 추천해주세요."),
                HumanMessage(content=prompt)
            ]
            
            logger.info("📡 OpenAI API에 요청을 보내는 중...")
            response = await llm.ainvoke(messages)
            logger.info("✅ OpenAI API 응답을 받았습니다!")
            
            content = response.content.strip()
            logger.info(f"📄 AI 응답 내용: {content[:200]}...")  # 처음 200자만 로그
            
            # 마크다운 코드 블록 제거
            content = clean_json_response(content)
            
            logger.info(f"🧹 정리된 응답: {content[:200]}...")
            
            # JSON 파싱 시도
            import json
            try:
                recommendations = json.loads(content)
                logger.info(f"✅ JSON 파싱 성공! 추천 결과: {recommendations}")
                return recommendations
            except json.JSONDecodeError as e:
                logger.error(f"❌ JSON 파싱 실패: {e}")
                logger.error(f"📄 파싱 실패한 내용: {content}")
                # JSON 파싱 실패 시 기본 추천
                import random
                if restaurants:
                    selected = random.choice(restaurants)
                    logger.info(f"🎲 JSON 파싱 실패로 기본 추천: {selected['name']}")
                    return [{"id": selected["id"], "reason": "AI 추천 (파싱 실패)"}]
                return []
                
        except Exception as e:
            logger.error(f"❌ AI 추천 중 에러 발생: {e}")
            # 에러 발생 시 기본 랜덤 추천
            import random
            if restaurants:
                selected = random.choice(restaurants)
                logger.info(f"🎲 AI 에러로 기본 추천: {selected['name']}")
                return [{"id": selected["id"], "reason": "기본 추천 (AI 에러)"}]
            return [] 