# Implementation Plan: 정상까지 (Summit Survivor)

**Branch**: `001-himalaya-clicker-survival` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-himalaya-clicker-survival/spec.md`

## Summary

웹 기반 실시간 서바이벌 클릭커 게임 개발. 플레이어가 자동 등반하며 1.5초마다 나타나는 아이템을 선택/회피하여 2분 내 정상(3,000m) 도달을 목표로 한다. Next.js 14 (App Router) + TypeScript 기반으로 구현하며, 게임 상태는 Zustand로 관리하고, 리더보드는 Next.js API Routes를 통해 Supabase에 저장한다.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)

**Primary Dependencies**: 
- Frontend: Next.js 14, React 18, Zustand (상태관리), Tailwind CSS (스타일링)
- Backend: Next.js API Routes, Supabase Client

**Storage**: Supabase (PostgreSQL 기반)

**Testing**: Vitest (통합 테스트)

**Target Platform**: Web Browser (PC/모바일 반응형)

**Project Type**: Full-Stack Next.js Application

**Deployment**: Vercel (자동 배포)

**Performance Goals**: 
- 60fps 게임 렌더링
- 1.5초 정확한 이벤트 타이밍
- API 응답 < 200ms

**Constraints**: 
- 2분 게임 세션 동안 끊김 없는 플레이
- 모바일에서도 터치 반응 즉시 처리
- 오프라인 시 게임 플레이 가능 (리더보드 제외)

**Scale/Scope**: 
- MVP: 단일 스테이지, 기본 아이템 세트
- 동시 사용자: 초기 1,000명 목표

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 템플릿 상태이므로 일반적인 웹 게임 개발 best practices를 적용합니다:

| Gate | Status | Notes |
|------|--------|-------|
| 코드 구조화 | ✅ Pass | Frontend/Backend 분리, 모듈화된 구조 |
| 테스트 가능성 | ✅ Pass | 게임 로직과 UI 분리, 단위 테스트 가능 |
| 성능 최적화 | ✅ Pass | requestAnimationFrame 기반 렌더링, 메모이제이션 |
| 보안 | ✅ Pass | 점수 검증은 서버에서 수행 |

## Project Structure

### Documentation (this feature)

```text
specs/001-himalaya-clicker-survival/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── checklists/          # Quality checklists
```

### Source Code (repository root)

```text
app/
├── (game)/             # 게임 루트 그룹
│   ├── page.tsx        # 메인 게임 페이지
│   ├── layout.tsx      # 게임 레이아웃
│   └── leaderboard/    # 리더보드 페이지
│       └── page.tsx
├── api/                # API Routes
│   ├── scores/
│   │   └── route.ts    # POST /api/scores
│   └── leaderboard/
│       ├── route.ts    # GET /api/leaderboard
│       └── [playerName]/
│           └── route.ts # GET /api/leaderboard/:playerName
├── layout.tsx          # 루트 레이아웃
└── globals.css         # 전역 스타일

components/
├── game/               # 게임 화면 컴포넌트
│   ├── GameCanvas.tsx
│   ├── EventDisplay.tsx
│   └── StatusBar.tsx
├── ui/                 # 공통 UI 컴포넌트
│   ├── Button.tsx
│   └── Card.tsx
└── screens/            # 화면 컴포넌트
    ├── MainScreen.tsx
    ├── ResultScreen.tsx
    └── LeaderboardScreen.tsx

stores/
└── gameStore.ts        # Zustand 게임 상태 스토어

hooks/
├── useGameLoop.ts      # 게임 루프 훅
└── useTimer.ts         # 타이머 훅

lib/
├── supabase.ts         # Supabase 클라이언트
├── score.ts            # 점수 계산 로직
└── random.ts           # 랜덤 아이템 생성

data/
└── items.ts            # 아이템 데이터 정의

types/
├── game.ts             # 게임 관련 타입
└── api.ts              # API 응답 타입

public/
└── assets/             # 픽셀아트 에셋

tests/
└── integration/        # 통합 테스트

.env.local              # 환경 변수 (Supabase 키)
package.json
next.config.js
tailwind.config.ts
tsconfig.json
```

**Structure Decision**: Next.js 14 App Router 구조 사용. 게임 로직은 클라이언트 컴포넌트에서 처리하고, API Routes는 리더보드 데이터만 Supabase와 통신하여 단순하게 유지.

## Complexity Tracking

> MVP 범위 내에서 복잡도를 최소화하여 별도 위반 사항 없음

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
