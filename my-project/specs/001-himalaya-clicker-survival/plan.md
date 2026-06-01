# Implementation Plan: 정상까지 (Summit Survivor)

**Branch**: `001-himalaya-clicker-survival` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-himalaya-clicker-survival/spec.md`

## Summary

웹 기반 실시간 서바이벌 클릭커 게임 개발. 플레이어가 자동 등반하며 1.5초마다 나타나는 아이템을 선택/회피하여 2분 내 정상(3,000m) 도달을 목표로 한다. React + TypeScript 기반 SPA로 구현하며, 게임 상태는 Zustand로 관리하고, 리더보드는 백엔드 API를 통해 PostgreSQL에 저장한다.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend), Node.js 20.x (Backend)

**Primary Dependencies**: 
- Frontend: React 18, Zustand (상태관리), Tailwind CSS (스타일링)
- Backend: Express.js, Prisma ORM

**Storage**: PostgreSQL (리더보드 데이터)

**Testing**: Vitest (Frontend), Jest (Backend)

**Target Platform**: Web Browser (PC/모바일 반응형)

**Project Type**: Web Application (Frontend SPA + Backend API)

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
frontend/
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Game/        # 게임 화면 컴포넌트
│   │   ├── UI/          # 공통 UI 컴포넌트
│   │   └── Screens/     # 메인/결과/리더보드 화면
│   ├── stores/          # Zustand 상태 관리
│   │   └── gameStore.ts # 게임 상태 스토어
│   ├── hooks/           # 커스텀 React 훅
│   │   ├── useGameLoop.ts
│   │   └── useTimer.ts
│   ├── data/            # 아이템/이벤트 데이터
│   │   └── items.ts
│   ├── utils/           # 유틸리티 함수
│   │   ├── score.ts     # 점수 계산
│   │   └── random.ts    # 랜덤 아이템 생성
│   ├── types/           # TypeScript 타입 정의
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── assets/          # 픽셀아트 에셋
├── tests/
│   ├── unit/            # 단위 테스트
│   └── integration/     # 통합 테스트
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json

backend/
├── src/
│   ├── routes/          # API 라우트
│   │   └── leaderboard.ts
│   ├── services/        # 비즈니스 로직
│   │   └── scoreService.ts
│   ├── models/          # Prisma 모델
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── tests/
├── package.json
└── tsconfig.json
```

**Structure Decision**: Frontend/Backend 분리 구조 선택. 게임 로직은 Frontend에서 처리하고, Backend는 리더보드 API만 담당하여 단순하게 유지.

## Complexity Tracking

> MVP 범위 내에서 복잡도를 최소화하여 별도 위반 사항 없음

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
