import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# OpenAI 설정
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 카카오 API 설정
KAKAO_REST_API_KEY = os.getenv("KAKAO_REST_API_KEY")

# API 설정
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# AI 추천 설정
MAX_DISTANCE_KM = 1.0  # 1km 이내
MAX_RECOMMENDATIONS = 5  # 최대 추천 개수 