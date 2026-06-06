# 구현 태스크: 밈 이벤트 시스템

**기능**: 003-meme-event-system  
**날짜**: 2026-06-06

---

## Phase 1: 타입 및 상수 정의

- [X] **T1.1** 새로운 타입 정의 파일 생성 (`src/types/meme-event.ts`)
- [X] **T1.2** GAME_CONSTANTS 업데이트 (MAX_HP: 120, EVENT_INTERVAL: 1.5)

## Phase 2: 아이템 데이터

- [X] **T2.1** 보급품 카테고리 아이템 데이터 (`src/data/meme-items/supply.ts`)
- [X] **T2.2** 휴식 카테고리 아이템 데이터 (`src/data/meme-items/rest.ts`)
- [X] **T2.3** 장비 카테고리 아이템 데이터 (`src/data/meme-items/gear.ts`)
- [X] **T2.4** 절경 카테고리 아이템 데이터 (`src/data/meme-items/view.ts`)
- [X] **T2.5** 날씨 카테고리 아이템 데이터 (`src/data/meme-items/weather.ts`)
- [X] **T2.6** 도전 카테고리 아이템 데이터 (`src/data/meme-items/challenge.ts`)
- [X] **T2.7** 유혹 카테고리 아이템 데이터 (`src/data/meme-items/temptation.ts`)
- [X] **T2.8** 만남 카테고리 아이템 데이터 (`src/data/meme-items/meet.ts`)
- [X] **T2.9** 기적 카테고리 아이템 데이터 (`src/data/meme-items/rare.ts`)
- [X] **T2.10** 밈 카테고리 아이템 데이터 (`src/data/meme-items/meme.ts`)
- [X] **T2.11** 아이템 인덱스 파일 (`src/data/meme-items/index.ts`)

## Phase 3: 핵심 로직

- [X] **T3.1** 버프/디버프 시스템 (`src/lib/buff.ts`)
- [X] **T3.2** 콤보 시스템 (`src/lib/combo.ts`)
- [X] **T3.3** 2지선다 이벤트 생성기 (`src/lib/event-generator.ts`)

## Phase 4: 스토어 확장

- [X] **T4.1** gameStore 확장 - 콤보, 버프 상태 추가

## Phase 5: UI 컴포넌트

- [X] **T5.1** 아이템 카드 컴포넌트 (`src/components/game/ItemCard.tsx`)
- [X] **T5.2** 2지선다 EventDisplay 수정
- [X] **T5.3** 콤보 표시 컴포넌트 (`src/components/game/ComboIndicator.tsx`)
- [X] **T5.4** 버프 로그 사이드바 (`src/components/game/BuffSidebar.tsx`)

## Phase 6: 통합

- [X] **T6.1** 게임 루프 통합 (useGameLoop 수정)
- [X] **T6.2** 게임 UI 레이아웃 수정
- [X] **T6.3** 빌드 성공 확인
