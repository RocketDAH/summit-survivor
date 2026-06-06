# 구현 계획: 밈 이벤트 시스템 (Meme Event System)

**브랜치**: `003-meme-event-system` | **날짜**: 2026-06-06 | **스펙**: [spec.md](./spec.md)

**입력**: `specs/003-meme-event-system/spec.md`의 기능 명세

## 요약

정상까지(Summit Survivor) 게임의 핵심 게임플레이를 전략적 딜레마 기반으로 개편합니다. 기존 단일 아이템 선택/무시 방식을 2지선다 양자택일 시스템으로 변경하고, 콤보 시스템, 버프/디버프 시스템, 등산 테마 밈 아이템 85종+를 구현합니다.

## 기술 컨텍스트

**언어/버전**: TypeScript 5.x, Next.js 14 (App Router)

**주요 의존성**: 
- 프론트엔드: Next.js 14, React 18, Zustand (상태관리)
- 스타일링: Tailwind CSS + 픽셀 디자인 시스템

**저장소**: 로컬 상태 (Zustand) - 리더보드만 Supabase 연동

**테스트**: Vitest (단위 테스트), Playwright (E2E)

**대상 플랫폼**: 웹 브라우저 (PC/모바일 반응형)

**프로젝트 타입**: 프론트엔드 게임 로직 확장

**성능 목표**: 
- 60fps 게임 렌더링 유지
- 이벤트 생성 < 5ms
- 버프 로그 애니메이션 부드럽게

**제약사항**: 
- 기존 001-himalaya-clicker-survival 코드베이스와 호환
- 002-pixel-design-system 디자인 시스템 활용
- 최대 HP 120, 이벤트 간격 1.5초 유지

**규모/범위**: 
- 10개 아이템 카테고리, 85종+ 아이템
- 6종 버프, 4종 디버프
- 40가지 딜레마 시나리오

## Constitution Check

*게이트: Phase 0 리서치 전 통과 필수. Phase 1 설계 후 재확인.*

Constitution이 템플릿 상태이므로 기본 품질 기준 적용:

- [x] 기능적 요구사항이 명확함 (스펙에 상세 정의)
- [x] 테스트 가능한 성공 기준 정의됨 (클리어율 40-50%, 콤보 활용률 60%+)
- [x] 기술 스택이 명시됨 (TypeScript, Zustand)
- [x] 기존 시스템과 통합 방안 정의됨

## 프로젝트 구조

### 문서 (이 기능)

```text
specs/003-meme-event-system/
├── plan.md              # 이 파일
├── spec.md              # 기능 명세
├── research.md          # Phase 0 출력 (기술 결정)
├── data-model.md        # Phase 1 출력 (데이터 모델)
├── quickstart.md        # Phase 1 출력 (빠른 시작 가이드)
├── contracts/
│   └── game-api.md      # 게임 API 계약
└── tasks.md             # Phase 2 출력 (구현 태스크)
```

### 소스 코드 (저장소 루트)

```text
src/
├── types/
│   └── meme-event.ts      # 새로운 타입 정의
├── data/
│   ├── items.ts           # 기존 (수정)
│   └── meme-items/        # 새로운 아이템 데이터
│       ├── supply.ts      # 🎒 보급품
│       ├── rest.ts        # ⛺ 휴식
│       ├── gear.ts        # 🥾 장비
│       ├── view.ts        # 🌄 절경
│       ├── weather.ts     # ⛈️ 날씨
│       ├── challenge.ts   # 🧗 도전
│       ├── temptation.ts  # 📱 유혹
│       ├── meet.ts        # 👥 만남
│       ├── rare.ts        # ⭐ 기적
│       └── meme.ts        # 🎭 밈
├── stores/
│   └── gameStore.ts       # 기존 (수정 - 콤보, 버프 추가)
├── lib/
│   ├── event-generator.ts # 2지선다 이벤트 생성 로직
│   ├── combo.ts           # 콤보 시스템 로직
│   └── buff.ts            # 버프/디버프 시스템
├── components/
│   └── game/
│       ├── EventDisplay.tsx     # 기존 (수정 - 2지선다 UI)
│       ├── BuffSidebar.tsx      # 새로운 버프 로그 사이드바
│       ├── ComboIndicator.tsx   # 콤보 표시 컴포넌트
│       └── ItemCard.tsx         # 아이템 카드 컴포넌트
└── hooks/
    ├── useCombo.ts        # 콤보 상태 훅
    └── useBuffs.ts        # 버프 상태 훅
```

**구조 결정**: 
- 새로운 밈 아이템은 카테고리별 파일로 분리하여 관리
- 기존 gameStore 확장 (콤보, 버프 상태 추가)
- 이벤트 생성 로직은 별도 모듈로 분리

## Phase 요약

### Phase 0: 리서치 (완료)

**출력**: `research.md`

| 영역 | 결정 |
|------|------|
| 이벤트 생성 | 상황 기반 딜레마 페어링 알고리즘 |
| 콤보 시스템 | 카테고리 기반 연속 선택 보너스 |
| 버프 관리 | Zustand 스토어 + 타이머 기반 만료 |
| 자동 선택 | 시간 초과 시 50:50 랜덤 선택 |
| 아이템 밸런스 | HP 120 기준, 클리어율 40-50% 타겟 |
| UI 레이아웃 | 2지선다 카드 + 사이드바 버프 로그 |

### Phase 1: 설계 (완료)

**출력**: `data-model.md`, `contracts/game-api.md`, `quickstart.md`

- **data-model.md**: 아이템, 버프, 콤보, 이벤트 타입 정의
- **contracts/game-api.md**: 게임 스토어 API 계약
- **quickstart.md**: 시스템 통합 가이드

## 구현 우선순위

### MVP (P1)
1. 새로운 아이템 타입 정의 (카테고리, 버프 효과 등)
2. 보급품/휴식/장비 카테고리 아이템 데이터 (40종)
3. 2지선다 이벤트 생성기
4. 2지선다 UI 컴포넌트
5. 자동 선택 로직 (시간 초과 시)
6. 기본 버프/디버프 시스템 (6종+4종)

### P2
7. 콤보 시스템 구현
8. 콤보 표시 UI
9. 버프 로그 사이드바
10. 절경/날씨/도전 카테고리 아이템 (40종)
11. 딜레마 페어링 알고리즘 고도화

### P3 (후순위)
12. 유혹/만남/기적/밈 카테고리 아이템
13. 3지선다 특수 이벤트
14. 밸런스 튜닝
15. 사운드 효과

## 복잡도 추적

> **Constitution Check에 정당화가 필요한 위반이 있는 경우에만 작성**

해당 없음 - Constitution이 템플릿 상태이며 모든 기본 품질 기준 통과

## 생성된 아티팩트

| 파일 | 설명 |
|------|------|
| `research.md` | 기술 결정 사항 및 대안 분석 |
| `data-model.md` | 아이템, 버프, 콤보 데이터 모델 |
| `contracts/game-api.md` | 게임 스토어 API 계약 |
| `quickstart.md` | 통합 가이드 |

## 다음 단계

1. `/speckit-tasks` 실행하여 구현 태스크 생성
2. 타입 정의 및 아이템 데이터 구현
3. 이벤트 생성기 및 2지선다 UI 구현
4. 콤보/버프 시스템 구현
5. 기존 게임과 통합 테스트
6. 밸런스 조정
