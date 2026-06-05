# Tasks: 정상까지 (Summit Survivor) + 픽셀 디자인 시스템

**Input**: Design documents from `specs/001-himalaya-clicker-survival/` + `specs/002-pixel-design-system/`

**Prerequisites**: plan.md (both features), spec.md (both features), data-model.md (both features), contracts/

**Organization**: 디자인 시스템을 먼저 구현한 후 게임에 통합. 각 User Story는 독립적으로 테스트 가능.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (DS=Design System, US=Game User Story)

---

## Phase 1: Setup (프로젝트 초기화)

**Purpose**: Next.js 프로젝트 및 디자인 시스템 구조 생성

- [X] T001 Create Next.js 14 project with TypeScript in project root
- [X] T002 [P] Configure Tailwind CSS in tailwind.config.ts
- [X] T003 [P] Create design-system/ directory structure per 002-pixel-design-system plan
- [X] T004 [P] Configure .env.local template for Supabase credentials
- [X] T005 [P] Setup ESLint and Prettier configuration
- [X] T006 Create app/ directory structure per 001-himalaya-clicker-survival plan

---

## Phase 2: Foundational Design System (디자인 토큰)

**Purpose**: 게임 UI 구현 전 필수 디자인 토큰 정의

**⚠️ CRITICAL**: 게임 컴포넌트 구현 전에 이 Phase 완료 필수

### DS1: 일관된 레트로 비주얼 경험 (P1)

- [X] T007 [P] [DS1] Create design-system/index.css as main entry point with imports
- [X] T008 [P] [DS1] Add Google Fonts (Press Start 2P, VT323) import in design-system/tokens/typography.css
- [X] T009 [DS1] Configure image-rendering: pixelated rule in design-system/utilities/layout.css

### DS2: 히말라야 테마 색상 팔레트 (P1)

- [X] T010 [P] [DS2] Define base color tokens (Primary, Secondary, Background, Surface, Accent) in design-system/tokens/colors.css
- [X] T011 [P] [DS2] Define semantic colors (positive, negative, random) in design-system/tokens/colors.css
- [X] T012 [P] [DS2] Define HP state colors (high, medium, low, critical) in design-system/tokens/colors.css
- [X] T013 [DS2] Define UI colors (text, border) in design-system/tokens/colors.css

### DS3: 픽셀 타이포그래피 시스템 (P1)

- [X] T014 [P] [DS3] Define font family tokens (display, body, korean) in design-system/tokens/typography.css
- [X] T015 [P] [DS3] Define font size scale (xs to 3xl) in design-system/tokens/typography.css
- [X] T016 [DS3] Create text utility classes (.pixel-text-*) in design-system/utilities/text.css

### DS4: 픽셀 아이콘 시스템 (P1)

- [X] T017 [P] [DS4] Create placeholder sprite sheets (16x16, 32x32, 48x48) in design-system/icons/
- [X] T018 [DS4] Define icon CSS classes with sprite positions in design-system/icons/icons.css

**Checkpoint**: 디자인 토큰 완료 - 게임 컴포넌트 구현 가능

---

## Phase 3: Design System Components (UI 컴포넌트)

**Purpose**: 게임에서 사용할 픽셀 스타일 UI 컴포넌트

### DS1 (계속): 기본 UI 컴포넌트

- [X] T019 [P] [DS1] Create .pixel-btn component with variants (primary, secondary, danger, ghost) in design-system/components/button.css
- [X] T020 [P] [DS1] Create .pixel-progress component with variants (hp, altitude, timer) in design-system/components/progress-bar.css
- [X] T021 [P] [DS1] Create .pixel-card component with variants (item, result, panel) in design-system/components/card.css
- [X] T022 [P] [DS1] Create .pixel-modal component in design-system/components/modal.css
- [X] T023 [DS1] Create spacing tokens (8px grid) in design-system/tokens/spacing.css

**Checkpoint**: 디자인 시스템 MVP 완료 - 게임 개발 시작 가능

---

## Phase 4: Game Foundation (게임 기반)

**Purpose**: 게임 상태 관리 및 핵심 로직

- [X] T024 Define GameState, GameEvent, ItemDefinition types in types/game.ts
- [X] T025 [P] Define API response types in types/api.ts
- [X] T026 Create Zustand game store with initial state in stores/gameStore.ts
- [X] T027 [P] Define item data (positive, negative, random) in data/items.ts
- [X] T028 Implement score calculation logic in lib/score.ts
- [X] T029 [P] Implement random item generator (45/35/20 distribution) in lib/random.ts

---

## Phase 5: User Story 1 - 게임 시작 및 자동 등반 (P1) 🎯 MVP

**Goal**: 플레이어가 시작 버튼 클릭 시 게임이 시작되고 고도가 자동 증가

**Independent Test**: 게임 시작 후 2분 타이머, HP 100, 고도 자동 증가 확인

### Implementation

- [X] T030 [US1] Implement startGame action in stores/gameStore.ts
- [X] T031 [US1] Create useGameLoop hook with requestAnimationFrame in hooks/useGameLoop.ts
- [X] T032 [US1] Implement auto HP decrease (1/sec) and altitude increase in useGameLoop
- [X] T033 [US1] Create useTimer hook for 2-minute countdown in hooks/useTimer.ts
- [X] T034 [P] [US1] Create MainScreen component with start button in components/screens/MainScreen.tsx
- [X] T035 [US1] Create StatusBar component (HP, Timer, Altitude) in components/game/StatusBar.tsx
- [X] T036 [US1] Import design-system CSS and apply pixel styles to StatusBar

**Checkpoint**: 게임 시작 및 자동 등반 작동 확인

---

## Phase 6: User Story 2 - 이벤트 선택 시스템 (P1)

**Goal**: 1.5초마다 아이템 등장, 클릭으로 선택 또는 자동 스킵

**Independent Test**: 1.5초 간격 이벤트 발생, 클릭/무시 작동 확인

### Implementation

- [X] T037 [US2] Implement event generation every 1.5s in useGameLoop
- [X] T038 [US2] Implement selectEvent and skipEvent actions in stores/gameStore.ts
- [X] T039 [US2] Create EventDisplay component with item card in components/game/EventDisplay.tsx
- [X] T040 [US2] Apply .pixel-card styles with item type colors to EventDisplay
- [X] T041 [US2] Add event countdown timer (1.5s) visual indicator to EventDisplay
- [X] T042 [US2] Implement click handler for item selection

**Checkpoint**: 이벤트 선택 시스템 작동 확인

---

## Phase 7: User Story 3 - 체력 및 생존 관리 (P1)

**Goal**: HP 관리, 아이템 효과 적용, HP 0 시 게임 오버

**Independent Test**: HP 증감 작동, HP 0에서 패배 화면 표시 확인

### Implementation

- [X] T043 [US3] Implement applyItemEffect action in stores/gameStore.ts
- [X] T044 [US3] Implement defeat condition (HP <= 0) check in useGameLoop
- [X] T045 [US3] Update StatusBar HP display with color changes (.pixel-progress--hp)
- [X] T046 [US3] Add HP change animation feedback using design-system classes

**Checkpoint**: HP 시스템 및 게임 오버 작동 확인

---

## Phase 8: User Story 4 - 게임 결과 및 점수 (P1)

**Goal**: 정상 도달 시 승리, 점수 계산 및 결과 화면 표시

**Independent Test**: 3000m 도달 시 승리, 점수 계산 정확성 확인

### Implementation

- [X] T047 [US4] Implement victory condition (altitude >= 3000) check in useGameLoop
- [X] T048 [US4] Implement calculateScore function call on game end in stores/gameStore.ts
- [X] T049 [US4] Create ResultScreen component with score breakdown in components/screens/ResultScreen.tsx
- [X] T050 [US4] Apply .pixel-modal and .pixel-card styles to ResultScreen
- [X] T051 [US4] Display victory/defeat status with appropriate styling

**Checkpoint**: User Story 1-4 완료 - MVP 게임 플레이 가능

---

## Phase 9: Main Game Page (통합)

**Purpose**: 게임 화면 통합 및 라우팅

- [X] T052 Create app/(game)/layout.tsx with design-system CSS import
- [X] T053 Create app/(game)/page.tsx integrating MainScreen, StatusBar, EventDisplay, ResultScreen
- [X] T054 Implement game state-based screen switching logic
- [X] T055 [P] Create app/globals.css with base styles and design-system import

---

## Phase 10: Design System P2 - 애니메이션 시스템

**Purpose**: 게임 피드백 향상을 위한 애니메이션

### DS5: 픽셀 애니메이션 피드백 (P2)

- [X] T056 [P] [DS5] Define animation duration tokens in design-system/tokens/animation.css
- [X] T057 [P] [DS5] Define easing tokens (steps, bounce) in design-system/tokens/animation.css
- [X] T058 [DS5] Create item-appear keyframe animation in design-system/utilities/animation.css
- [X] T059 [DS5] Create item-disappear keyframe animation in design-system/utilities/animation.css
- [X] T060 [DS5] Create number-pop keyframe animation for HP/score changes in design-system/utilities/animation.css
- [X] T061 [DS5] Create pulse-critical keyframe for low HP warning in design-system/utilities/animation.css
- [X] T061-1 [DS5] Create victory celebration keyframe animation in design-system/utilities/animation.css
- [X] T061-2 [DS5] Create defeat/game-over keyframe animation in design-system/utilities/animation.css

### DS6: 반응형 픽셀 UI (P2)

- [X] T062 [P] [DS6] Define breakpoint variables in design-system/tokens/spacing.css
- [X] T063 [DS6] Implement pixel-scale responsive logic in design-system/utilities/layout.css
- [X] T064 [DS6] Add responsive modifier classes (sm:, md:, lg:) to design-system/utilities/

---

## Phase 11: User Story 5 - 리더보드 (P2)

**Goal**: 점수 저장 및 리더보드 표시

**Independent Test**: 점수 제출 후 리더보드에 반영 확인

### Implementation

- [X] T065 [US5] Create Supabase client in lib/supabase.ts
- [X] T066 [US5] Create POST /api/scores route in app/api/scores/route.ts
- [X] T067 [US5] Create GET /api/leaderboard route in app/api/leaderboard/route.ts
- [X] T068 [US5] Implement score submission on game end in ResultScreen
- [X] T069 [US5] Create LeaderboardScreen component in components/screens/LeaderboardScreen.tsx
- [X] T070 [US5] Create app/(game)/leaderboard/page.tsx
- [X] T071 [US5] Apply pixel styles to leaderboard table

**Checkpoint**: 리더보드 기능 작동 확인

---

## Phase 12: User Story 6 - 재시작 (P2)

**Goal**: 결과 화면에서 즉시 재도전

**Independent Test**: 재시작 버튼 클릭 시 새 게임 시작 확인

### Implementation

- [X] T072 [US6] Implement resetGame action in stores/gameStore.ts
- [X] T073 [US6] Add restart button to ResultScreen with .pixel-btn style
- [X] T074 [US6] Add "Go to Main" button to ResultScreen

**Checkpoint**: 모든 User Story 완료

---

## Phase 13: Polish & Integration

**Purpose**: 최종 통합 및 품질 개선

- [X] T075 [P] Apply animations to EventDisplay (appear/disappear)
- [X] T076 [P] Apply HP change animation to StatusBar
- [X] T077 [P] Apply responsive styles to all game screens
- [X] T078 Create tests/design-system/test.html for visual component testing
- [X] T079 Verify all pixel-art styles render correctly at different scales
- [X] T079-1 [P] Verify all text/background color combinations meet WCAG AA contrast ratio (4.5:1)
- [X] T079-2 Verify tabular-nums (monospace) applied to all numeric displays (HP, Timer, Score, Altitude)
- [X] T080 Performance optimization: memoization of components
- [X] T081 [P] Add error handling for API failures (offline play support)
- [X] T082 Run quickstart.md validation for both features

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────┐
                                                          │
Phase 2 (Design Tokens) ◄─────────────────────────────────┘
    │
    ├── Phase 3 (Design Components) ◄─────┐
    │       │                              │
    │       └── Phase 4 (Game Foundation) ◄┘
    │               │
    │               ├── Phase 5 (US1: 게임 시작)
    │               │       │
    │               │       ├── Phase 6 (US2: 이벤트 선택)
    │               │       │       │
    │               │       │       ├── Phase 7 (US3: 체력 관리)
    │               │       │       │       │
    │               │       │       │       └── Phase 8 (US4: 점수)
    │               │       │       │               │
    │               │       │       │               └── Phase 9 (통합)
    │               │       │       │
Phase 10 (DS5-6: 애니메이션) ◄───────────────────────────┤
                                                          │
Phase 11 (US5: 리더보드) ◄────────────────────────────────┤
        │                                                 │
        └── Phase 12 (US6: 재시작) ◄──────────────────────┤
                │                                         │
                └── Phase 13 (Polish) ◄───────────────────┘
```

### Parallel Opportunities

**Phase 1-2 (Setup + Tokens)**:
- T002, T003, T004, T005 병렬 실행 가능
- T007, T008 병렬 실행 가능
- T010, T011, T012 병렬 실행 가능
- T014, T015 병렬 실행 가능

**Phase 3 (Components)**:
- T019, T020, T021, T022 병렬 실행 가능

**Phase 4 (Foundation)**:
- T025, T027, T029 병렬 실행 가능

**Phase 10 (Animation)**:
- T056, T057 병렬 실행 가능
- T058, T059, T060, T061 병렬 실행 가능

---

## Parallel Example: Design System Tokens

```bash
# 색상 토큰 병렬 생성:
Task: "Define base color tokens in design-system/tokens/colors.css"
Task: "Define semantic colors in design-system/tokens/colors.css"
Task: "Define HP state colors in design-system/tokens/colors.css"

# 타이포그래피 토큰 병렬 생성:
Task: "Define font family tokens in design-system/tokens/typography.css"
Task: "Define font size scale in design-system/tokens/typography.css"
```

---

## Implementation Strategy

### MVP First (Phase 1-9)

1. **Setup + Design Tokens** (Phase 1-2): 프로젝트 및 디자인 시스템 기반
2. **Design Components** (Phase 3): 게임 UI 컴포넌트
3. **Game Foundation** (Phase 4): 상태 관리 및 로직
4. **US1-4** (Phase 5-8): 핵심 게임플레이
5. **Integration** (Phase 9): 게임 페이지 완성
6. **STOP and VALIDATE**: MVP 게임 플레이 테스트

### Incremental Delivery

| Milestone | Deliverable |
|-----------|-------------|
| Phase 2 완료 | 디자인 토큰 및 색상 팔레트 |
| Phase 3 완료 | UI 컴포넌트 라이브러리 |
| Phase 9 완료 | **MVP 게임** (시작 → 플레이 → 결과) |
| Phase 11 완료 | 리더보드 기능 추가 |
| Phase 13 완료 | 완성된 게임 + 애니메이션 |

---

## Notes

- **디자인 시스템 우선**: 게임 UI 전에 CSS 토큰/컴포넌트 완료
- **점진적 통합**: 각 게임 User Story마다 디자인 시스템 스타일 적용
- **독립 테스트**: 각 Phase 체크포인트에서 해당 기능 단독 테스트
- 커밋: 각 태스크 또는 논리적 그룹 완료 후
- [P] 태스크는 서로 다른 파일이므로 병렬 실행 가능
