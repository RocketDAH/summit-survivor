# Quickstart: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02

이 문서는 개발 환경 설정부터 로컬 실행까지의 빠른 시작 가이드입니다.

---

## Prerequisites

- Node.js 20.x 이상
- pnpm (권장) 또는 npm
- PostgreSQL 15+ (리더보드용, Docker 권장)
- Git

---

## 1. Repository Setup

```bash
# Clone (이미 클론된 경우 생략)
cd summit-survivor

# 의존성 설치
pnpm install
```

---

## 2. Frontend Setup

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

**접속**: http://localhost:5173

### Frontend 환경 변수

`.env.local` 파일 생성:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 3. Backend Setup

```bash
# backend 디렉토리로 이동
cd backend

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
```

### Backend 환경 변수

`.env` 파일 편집:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/summit_survivor"
PORT=3000
NODE_ENV=development
```

### Database Setup

```bash
# Docker로 PostgreSQL 실행
docker run --name summit-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=summit_survivor \
  -p 5432:5432 \
  -d postgres:15

# Prisma 마이그레이션 실행
pnpm prisma migrate dev

# (선택) Prisma Studio로 DB 확인
pnpm prisma studio
```

### 서버 시작

```bash
pnpm dev
```

**API 접속**: http://localhost:3000

---

## 4. 전체 실행 (동시 실행)

루트 디렉토리에서:

```bash
# 모든 서비스 동시 실행 (turbo 또는 concurrently 사용)
pnpm dev
```

또는 별도 터미널에서:
```bash
# Terminal 1: Frontend
cd frontend && pnpm dev

# Terminal 2: Backend
cd backend && pnpm dev
```

---

## 5. 테스트 실행

```bash
# Frontend 테스트
cd frontend && pnpm test

# Backend 테스트
cd backend && pnpm test

# 전체 테스트 (루트)
pnpm test
```

---

## 6. 빌드 및 배포

### Frontend (Vercel)

```bash
cd frontend
pnpm build
# dist/ 폴더가 생성됨
```

Vercel 설정:
- Build Command: `pnpm build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL` 설정

### Backend (Render/Railway)

```bash
cd backend
pnpm build
pnpm start
```

환경 변수:
- `DATABASE_URL`: 프로덕션 PostgreSQL URL
- `NODE_ENV`: `production`

---

## 7. 개발 워크플로우

### 게임 로직 수정

1. `frontend/src/stores/gameStore.ts` - 게임 상태 및 로직
2. `frontend/src/data/items.ts` - 아이템 정의
3. `frontend/src/utils/score.ts` - 점수 계산

### UI 수정

1. `frontend/src/components/Game/` - 게임 화면
2. `frontend/src/components/Screens/` - 메인/결과 화면
3. `frontend/src/components/UI/` - 공통 컴포넌트

### API 수정

1. `backend/src/routes/leaderboard.ts` - API 라우트
2. `backend/src/services/scoreService.ts` - 점수 검증/계산
3. `backend/prisma/schema.prisma` - DB 스키마

---

## 8. 유용한 명령어

```bash
# 타입 체크
pnpm typecheck

# 린트
pnpm lint

# 포맷팅
pnpm format

# Prisma 클라이언트 재생성
cd backend && pnpm prisma generate

# DB 초기화 (주의: 데이터 삭제됨)
cd backend && pnpm prisma migrate reset
```

---

## Troubleshooting

### "Port already in use"
```bash
# 프로세스 확인 및 종료
lsof -i :5173  # Frontend
lsof -i :3000  # Backend
kill -9 <PID>
```

### "Database connection failed"
```bash
# PostgreSQL 컨테이너 확인
docker ps
docker logs summit-db

# 연결 테스트
psql postgresql://postgres:postgres@localhost:5432/summit_survivor
```

### "Prisma migration failed"
```bash
# 마이그레이션 상태 확인
pnpm prisma migrate status

# 강제 리셋 (개발 환경만)
pnpm prisma migrate reset --force
```

---

## Next Steps

1. `/speckit-tasks` 실행하여 구현 태스크 생성
2. P1 User Story부터 구현 시작
3. 테스트 작성 및 실행
