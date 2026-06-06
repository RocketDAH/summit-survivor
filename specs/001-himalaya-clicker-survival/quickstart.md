# Quickstart: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02

이 문서는 개발 환경 설정부터 로컬 실행 및 배포까지의 빠른 시작 가이드입니다.

---

## Prerequisites

- Node.js 20.x 이상
- pnpm (권장) 또는 npm
- Git
- Supabase 계정 (무료)
- Vercel 계정 (무료, 배포용)

---

## 1. Repository Setup

```bash
# Clone (이미 클론된 경우 생략)
cd summit-survivor

# 의존성 설치
pnpm install
```

---

## 2. Supabase 프로젝트 생성

### 2.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `summit-survivor`
   - Database Password: 안전한 비밀번호 생성 (저장 필수)
   - Region: `Northeast Asia (Seoul)` 권장
4. "Create new project" 클릭 (1-2분 소요)

### 2.2 데이터베이스 테이블 생성

Supabase 대시보드 → SQL Editor에서 다음 쿼리 실행:

```sql
-- scores 테이블 생성
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name VARCHAR(50) NOT NULL,
  items_collected INTEGER NOT NULL CHECK (items_collected >= 0),
  survival_time_seconds INTEGER NOT NULL CHECK (survival_time_seconds >= 0 AND survival_time_seconds <= 120),
  remaining_hp INTEGER NOT NULL CHECK (remaining_hp >= 0 AND remaining_hp <= 100),
  altitude INTEGER NOT NULL CHECK (altitude >= 0 AND altitude <= 3000),
  cleared BOOLEAN NOT NULL DEFAULT false,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 점수 기준 인덱스
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_player ON scores(player_name);

-- Row Level Security 활성화
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  USING (true);

-- 모든 사용자가 점수 제출 가능
CREATE POLICY "Anyone can insert scores"
  ON scores FOR INSERT
  WITH CHECK (true);
```

### 2.3 환경 변수 설정

Supabase 대시보드 → Settings → API에서 다음 값 복사:

- Project URL: `https://xxxxx.supabase.co`
- `anon` `public` key

루트 디렉토리에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 3. 로컬 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev
```

**접속**: http://localhost:3000

Next.js가 자동으로:
- 게임 페이지 제공
- API Routes 실행 (`/api/*`)
- Hot Reload 지원

---

## 4. 테스트 실행

```bash
# 통합 테스트
pnpm test

# 타입 체크
pnpm typecheck

# 린트
pnpm lint
```

---

## 5. 빌드 및 배포

### 로컬 프로덕션 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### Vercel 배포

#### 방법 1: Vercel CLI (권장)

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 로그인
vercel login

# 배포
vercel
```

#### 방법 2: GitHub 연동 (자동 배포)

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com) 대시보드 접속
3. "Add New Project" 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. "Deploy" 클릭

**자동 배포**: 이후 `main` 브랜치에 푸시하면 자동으로 배포됨

---

## 6. 개발 워크플로우

### 게임 로직 수정

1. `stores/gameStore.ts` - 게임 상태 및 로직
2. `data/items.ts` - 아이템 정의
3. `lib/score.ts` - 점수 계산

### UI 수정

1. `components/game/` - 게임 화면
2. `components/screens/` - 메인/결과 화면
3. `components/ui/` - 공통 컴포넌트

### API 수정

1. `app/api/scores/route.ts` - 점수 제출 API
2. `app/api/leaderboard/route.ts` - 리더보드 조회 API
3. `lib/supabase.ts` - Supabase 클라이언트

---

## 7. 유용한 명령어

```bash
# 타입 체크
pnpm typecheck

# 린트
pnpm lint

# 포맷팅
pnpm format

# Supabase 로컬 개발 (선택)
npx supabase init
npx supabase start
npx supabase db reset
```

---

## Troubleshooting

### "Port already in use"
```bash
# 프로세스 확인 및 종료
lsof -i :3000
kill -9 <PID>
```

### "Supabase connection failed"
```bash
# .env.local 파일 확인
cat .env.local

# Supabase 프로젝트 상태 확인 (대시보드)
# https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

### "API route not found"
```bash
# Next.js 캐시 삭제
rm -rf .next
pnpm dev
```

### "Environment variables not loading"
```bash
# .env.local 파일이 루트에 있는지 확인
ls -la .env.local

# 서버 재시작 필요 (환경 변수 변경 시)
# Ctrl+C 후 pnpm dev 재실행
```

---

## Next Steps

1. `/speckit-tasks` 실행하여 구현 태스크 생성
2. P1 User Story부터 구현 시작
3. 테스트 작성 및 실행
4. Vercel Preview 배포로 테스트
5. Production 배포
