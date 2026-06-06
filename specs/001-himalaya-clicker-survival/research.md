# Research: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02

## 1. 게임 루프 구현 방식

**Decision**: `requestAnimationFrame` + Delta Time 기반 게임 루프

**Rationale**: 
- 브라우저 최적화된 렌더링 타이밍
- 탭 비활성화 시 자동 일시정지 (배터리 절약)
- 60fps 목표 달성에 적합

**Alternatives considered**:
- `setInterval`: 정확도 낮음, 탭 비활성화 시 drift 발생
- Web Worker: 오버엔지니어링, MVP에 불필요한 복잡성

**Implementation Notes**:
```typescript
// useGameLoop.ts 패턴
const useGameLoop = (callback: (deltaTime: number) => void) => {
  useEffect(() => {
    let lastTime = performance.now();
    let animationId: number;
    
    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      callback(deltaTime);
      animationId = requestAnimationFrame(loop);
    };
    
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [callback]);
};
```

---

## 2. 상태 관리 전략

**Decision**: Zustand 단일 스토어

**Rationale**:
- 가벼운 번들 사이즈 (~1KB)
- React 외부에서도 상태 접근 가능 (게임 루프에서 유용)
- Redux 대비 보일러플레이트 최소화
- 미들웨어로 디버깅 용이

**Alternatives considered**:
- Redux Toolkit: 오버엔지니어링, 게임 상태에 과도한 구조
- React Context: 리렌더링 최적화 어려움
- Jotai/Recoil: Zustand과 유사하나 팀 친숙도 고려

**Store Structure**:
```typescript
interface GameState {
  // 게임 상태
  status: 'idle' | 'playing' | 'victory' | 'defeat';
  hp: number;
  altitude: number;
  timeRemaining: number;
  
  // 이벤트/아이템
  currentEvent: GameEvent | null;
  eventTimeRemaining: number;
  
  // 점수
  itemsCollected: number;
  score: number;
  
  // 액션
  startGame: () => void;
  selectItem: () => void;
  skipItem: () => void;
  tick: (deltaTime: number) => void;
}
```

---

## 3. 1.5초 이벤트 타이밍 정확도

**Decision**: 게임 루프 내 누적 시간 기반 이벤트 발생

**Rationale**:
- `setTimeout`/`setInterval`보다 게임 루프 통합이 정확
- Delta time 누적으로 drift 방지
- 일시정지/재개 처리 용이

**Implementation Notes**:
```typescript
// gameStore.ts의 tick 함수 내부
tick: (deltaTime) => {
  set((state) => {
    const newEventTime = state.eventTimeRemaining - deltaTime;
    
    if (newEventTime <= 0) {
      // 이벤트 미선택 시 자동 스킵
      if (state.currentEvent) {
        // 스킵 처리
      }
      // 새 이벤트 생성
      return {
        ...state,
        eventTimeRemaining: 1.5,
        currentEvent: generateRandomEvent(),
      };
    }
    
    return { ...state, eventTimeRemaining: newEventTime };
  });
}
```

---

## 4. 아이템 확률 시스템

**Decision**: 가중치 기반 랜덤 선택

**Rationale**:
- 확률 조정 용이 (45/35/20 비율)
- 아이템 추가/수정 시 유연한 구조
- 테스트 가능한 순수 함수

**Implementation Notes**:
```typescript
interface ItemDefinition {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'random';
  effect: { hp?: number; special?: string };
  weight: number; // 개별 아이템 가중치
}

const ITEMS: ItemDefinition[] = [
  // 긍정 아이템 (총 45%)
  { id: 'food', name: '식량', type: 'positive', effect: { hp: 15 }, weight: 15 },
  { id: 'water', name: '물', type: 'positive', effect: { hp: 10 }, weight: 15 },
  { id: 'tent', name: '텐트', type: 'positive', effect: { hp: 20 }, weight: 15 },
  
  // 부정 아이템 (총 35%)
  { id: 'rockfall', name: '낙석', type: 'negative', effect: { hp: -20 }, weight: 12 },
  { id: 'storm', name: '폭풍', type: 'negative', effect: { hp: -15 }, weight: 12 },
  { id: 'injury', name: '부상', type: 'negative', effect: { hp: -25 }, weight: 11 },
  
  // 랜덤 아이템 (총 20%)
  { id: 'chest', name: '보물상자', type: 'random', effect: { special: 'chest' }, weight: 7 },
  { id: 'mushroom', name: '버섯', type: 'random', effect: { special: 'mushroom' }, weight: 7 },
  { id: 'unknown', name: '미확인 물품', type: 'random', effect: { special: 'unknown' }, weight: 6 },
];
```

---

## 5. 점수 계산 공식

**Decision**: 명세서 기반 공식 구현

**Rationale**:
- 기획서 요구사항 준수
- 검증 가능한 순수 함수
- 서버에서 재계산하여 치팅 방지

**Formula**:
```typescript
interface ScoreInput {
  itemsCollected: number;
  survivalTimeSeconds: number;
  remainingHp: number;
  reachedSummit: boolean;
}

const calculateScore = (input: ScoreInput): number => {
  const baseScore = input.itemsCollected * 10;
  const survivalBonus = Math.floor(input.survivalTimeSeconds * 2);
  const hpBonus = input.remainingHp * 3;
  const summitBonus = input.reachedSummit ? 200 : 0;
  
  return baseScore + survivalBonus + hpBonus + summitBonus;
};
```

---

## 6. 리더보드 API 설계

**Decision**: REST API with PostgreSQL

**Rationale**:
- 단순한 CRUD 작업에 적합
- 기존 인프라(Vercel/Render) 호환
- MVP에 충분한 기능

**Endpoints**:
- `POST /api/scores` - 점수 제출
- `GET /api/leaderboard` - 상위 랭킹 조회
- `GET /api/leaderboard/:playerId` - 개인 기록 조회

**Anti-cheat considerations**:
- 서버에서 점수 재계산 (게임 로그 기반)
- Rate limiting (분당 최대 10회 제출)
- 비정상 점수 필터링 (통계적 이상치 탐지 - 후순위)

---

## 7. 픽셀아트 에셋 전략

**Decision**: CSS 기반 픽셀 렌더링 + 최소 에셋

**Rationale**:
- MVP 빠른 개발 우선
- `image-rendering: pixelated` CSS로 저해상도 이미지 선명하게
- 후순위로 전문 에셋 교체 가능

**Implementation Notes**:
- 기본 아이콘: 이모지 또는 간단한 SVG/PNG
- 배경: CSS 그라데이션 + 픽셀화 효과
- 캐릭터: 32x32 또는 64x64 스프라이트 (추후)

---

## 8. 모바일 반응형 처리

**Decision**: Tailwind CSS 반응형 + 터치 이벤트

**Rationale**:
- 데스크톱/모바일 동일 코드베이스
- Tailwind의 `sm:`, `md:` 접두사로 간편한 반응형
- 터치 영역 충분히 확보 (44px 이상)

**Key Considerations**:
- 아이템 선택 버튼: 모바일에서 큰 터치 영역
- HUD: 모바일에서 간소화된 레이아웃
- 세로 모드 우선 디자인

---

## Summary: All Clarifications Resolved

| Topic | Decision |
|-------|----------|
| 게임 루프 | requestAnimationFrame + Delta Time |
| 상태 관리 | Zustand 단일 스토어 |
| 이벤트 타이밍 | 게임 루프 내 누적 시간 |
| 아이템 확률 | 가중치 기반 랜덤 |
| 점수 계산 | 기획서 공식 + 서버 검증 |
| 리더보드 | REST API + PostgreSQL |
| 픽셀아트 | CSS pixelated + 최소 에셋 |
| 모바일 | Tailwind 반응형 + 터치 이벤트 |
