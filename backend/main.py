import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import lunch

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(title="점심 메뉴 추천 API", version="1.0.0")

# CORS 설정 (React 프론트엔드와 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 시에는 도메인 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# lunch 라우터 등록 (/api 접두사)
app.include_router(lunch.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 FastAPI 서버가 시작되었습니다!")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 FastAPI 서버가 종료되었습니다.")

def main():
    """FastAPI 애플리케이션 실행"""
    import uvicorn
    logger.info("🎯 서버를 시작합니다...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main() 