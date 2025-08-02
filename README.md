# 점심 메뉴 추천 앱 🍽️

React + TypeScript + FastAPI 기반의 점심 메뉴 추천 웹 애플리케이션입니다.

## 🚀 주요 기능

- **현재 위치 기반 식당 리스트 조회**
- **음식 카테고리별 필터링**
- **랜덤 점심 메뉴 추천**
- **식당 상세정보 조회**
- **선택한 메뉴 히스토리 저장**
- **Kakao Map 연동 지도 서비스**

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트

### Backend
- **FastAPI** (Python)
- **Pydantic** - 데이터 검증
- **Uvicorn** - ASGI 서버
- **Poetry** - 의존성 관리

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd lunchmenu
```

### 2. Frontend 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 3. Backend 설정
```bash
# Poetry 설치 (없는 경우)
pip install poetry

# 의존성 설치
poetry install

# 개발 서버 실행
poetry run start
```

### 4. 환경 변수 설정
```bash
# .env 파일 생성
cp env.example .env

# .env 파일에서 API 키 설정
REACT_APP_KAKAO_MAP_API_KEY=your_kakao_map_api_key
REACT_APP_API_BASE_URL=http://localhost:8000
```

## 📁 프로젝트 구조

```
lunchmenu/
├── src/                    # Frontend 소스
│   ├── components/         # 재사용 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── services/          # API 서비스
│   ├── types/             # TypeScript 타입
│   └── data/              # 샘플 데이터
├── backend/               # Backend 소스
│   ├── routers/           # API 라우터
│   ├── models/            # 데이터 모델
│   ├── services/          # 비즈니스 로직
│   └── data/              # 데이터 파일
├── public/                # 정적 파일
└── docs/                  # 문서
```

## 🔧 개발 환경 설정

### 필수 요구사항
- **Node.js** 16+ 
- **Python** 3.8+
- **Poetry** (Python 패키지 관리자)

### Kakao Map API 설정
1. [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 생성
2. JavaScript 키 발급
3. `.env` 파일에 API 키 설정

## 🎯 주요 컴포넌트

### Frontend
- **Home.tsx** - 메인 페이지, 위치 기반 추천
- **MapViewer.tsx** - Kakao Map 연동 지도
- **RestaurantCard.tsx** - 식당 정보 카드
- **FilterPage.tsx** - 카테고리별 필터링
- **HistoryPage.tsx** - 선택 히스토리

### Backend
- **lunch.py** - 식당 관련 API 엔드포인트
- **restaurant.py** - 식당 데이터 모델
- **ai_service.py** - AI 추천 서비스

## 🔌 API 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants` | 위치 기반 식당 목록 |
| GET | `/restaurants/random` | 랜덤 메뉴 추천 |
| GET | `/restaurants/{id}` | 식당 상세 정보 |
| GET | `/history` | 선택 히스토리 |
| POST | `/history` | 히스토리 저장 |

## 🎨 UI/UX 특징

- **반응형 디자인** - 모바일 친화적
- **직관적인 인터페이스** - 사용하기 쉬운 UI
- **실시간 피드백** - 로딩 상태 및 에러 처리
- **부드러운 애니메이션** - 호버 효과 및 전환

## 📝 개발 가이드

### 코드 스타일
- **Frontend**: ESLint + Prettier
- **Backend**: Black + isort + flake8

### 테스트
```bash
# Frontend 테스트
npm test

# Backend 테스트
poetry run pytest
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.