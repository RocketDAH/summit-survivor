# 게임 API 계약: 밈 이벤트 시스템

**기능**: 003-meme-event-system  
**날짜**: 2026-06-06

---

## 1. GameStore API

### 상태 (State)

```typescript
interface MemeEventGameState {
  // === 기본 상태 (기존 유지) ===
  status: 'idle' | 'playing' | 'victory' | 'defeat';
  hp: number;
  maxHp: number;           // 120
  altitude: number;
  targetAltitude: number;  // 3000
  timeRemaining: number;
  totalTime: number;       // 120
  score: number;
  
  // === 이벤트 ===
  currentEvent: GameEvent | null;
  
  // === 콤보 ===
  combo: {
    category: ItemCategory | null;
    count: number;
  };
  
  // === 버프/디버프 ===
  activeBuffs: ActiveBuff[];
  activeDebuffs: ActiveBuff[];
  
  // === 히스토리 ===
  eventHistory: EventResult[];
  
  // === 통계 ===
  stats: GameStats;
}
```

### 액션 (Actions)

#### 게임 흐름

```typescript
// 게임 시작
startGame(): void;

// 게임 리셋
resetGame(): void;

// 게임 틱 (매 프레임 호출)
tick(deltaTime: number): void;
```

#### 이벤트 처리

```typescript
// 이벤트 생성
generateEvent(): void;

// 왼쪽 아이템 선택
selectLeft(): void;

// 오른쪽 아이템 선택
selectRight(): void;

// 가운데 아이템 선택 (3지선다)
selectCenter(): void;

// 자동 선택 (시간 초과)
autoSelect(): void;
```

#### 효과 적용

```typescript
// 아이템 효과 적용
applyItemEffects(item: MemeItem, isAuto: boolean): void;

// 버프 추가
addBuff(buff: ActiveBuff): void;

// 디버프 제거
removeDebuff(debuffId: string): void;
removeAllDebuffs(): void;

// 버프 틱 (시간 감소)
tickBuffs(deltaTime: number): void;
```

#### 콤보

```typescript
// 콤보 업데이트
updateCombo(category: ItemCategory): void;

// 콤보 리셋
resetCombo(): void;

// 콤보 보너스 계산
getComboBonus(): number;
```

#### 유틸리티

```typescript
// HP 변경 (버프/디버프 적용 후)
modifyHp(amount: number): number;  // 실제 적용된 값 반환

// 고도 변경 (버프/디버프 적용 후)
modifyAltitude(amount: number): number;

// 승리 체크
checkVictory(): boolean;

// 패배 체크
checkDefeat(): boolean;

// 점수 계산
calculateScore(): number;
```

---

## 2. EventGenerator API

### 이벤트 생성

```typescript
// 2지선다 이벤트 생성
function generateDilemmaEvent(state: GameState): GameEvent;

// 3지선다 특수 이벤트 생성
function generateSpecialEvent(state: GameState): GameEvent;

// 시나리오 결정
function determineScenario(state: GameState): Scenario;

// 딜레마 타입 선택
function selectDilemmaType(scenario: Scenario): DilemmaType;

// 아이템 페어 선택
function selectItemPair(
  dilemmaType: DilemmaType,
  state: GameState
): [MemeItem, MemeItem];
```

### 아이템 선택

```typescript
// 카테고리에서 랜덤 아이템
function getRandomItemFromCategory(
  category: ItemCategory,
  conditions?: ItemCondition
): MemeItem;

// 가중치 기반 랜덤 아이템
function getWeightedRandomItem(
  items: MemeItem[],
  modifiers?: Record<string, number>
): MemeItem;

// 콤보 유지 아이템 (현재 콤보 카테고리)
function getComboMaintainItem(state: GameState): MemeItem | null;

// 콤보 깨기 유혹 아이템 (다른 카테고리 좋은 것)
function getComboBreakItem(state: GameState): MemeItem;
```

---

## 3. BuffManager API

### 버프 관리

```typescript
// 버프 추가 (중복 시 시간 갱신)
function addBuff(
  state: GameState,
  buffType: BuffType,
  duration?: number,
  uses?: number
): GameState;

// 버프 제거
function removeBuff(state: GameState, buffId: string): GameState;

// 버프 틱 (시간 감소, 만료 제거)
function tickBuffs(state: GameState, deltaTime: number): GameState;

// 버프 효과 적용
function applyBuffEffects(
  state: GameState,
  effectType: 'hp' | 'altitude' | 'damage',
  baseValue: number
): number;

// 실드 사용 (부정 효과 무효화)
function useShield(state: GameState): GameState;

// 상반 버프 상쇄
function handleConflictingBuffs(state: GameState): GameState;
```

### 버프 조회

```typescript
// 특정 버프 보유 여부
function hasBuff(state: GameState, buffType: BuffType): boolean;

// 활성 버프 목록
function getActiveBuffs(state: GameState): ActiveBuff[];

// 활성 디버프 목록
function getActiveDebuffs(state: GameState): ActiveBuff[];

// 버프 남은 시간
function getBuffRemainingTime(state: GameState, buffType: BuffType): number;
```

---

## 4. ComboManager API

### 콤보 관리

```typescript
// 콤보 업데이트 (아이템 선택 시)
function updateCombo(
  state: GameState,
  selectedCategory: ItemCategory
): GameState;

// 콤보 보너스 계산
function getComboBonus(comboCount: number): number;

// 콤보 표시 텍스트
function getComboDisplay(comboCount: number): string;

// 콤보 특수 효과 (5콤보+)
function triggerComboSpecial(state: GameState): GameState;
```

---

## 5. 훅 (Hooks)

### useGameStore

```typescript
// Zustand 스토어 훅
function useGameStore(): MemeEventGameState & Actions;

// 선택적 구독
function useGameStore<T>(selector: (state: MemeEventGameState) => T): T;
```

### useBuffs

```typescript
interface UseBuffsReturn {
  activeBuffs: ActiveBuff[];
  activeDebuffs: ActiveBuff[];
  hasBuff: (type: BuffType) => boolean;
  hasDebuff: (type: BuffType) => boolean;
  buffCount: number;
  debuffCount: number;
}

function useBuffs(): UseBuffsReturn;
```

### useCombo

```typescript
interface UseComboReturn {
  category: ItemCategory | null;
  count: number;
  bonus: number;
  display: string;
  isActive: boolean;
}

function useCombo(): UseComboReturn;
```

### useEventTimer

```typescript
interface UseEventTimerReturn {
  timeLeft: number;        // 초 단위
  progress: number;        // 0-1
  isExpiring: boolean;     // 0.5초 이하
}

function useEventTimer(): UseEventTimerReturn;
```

---

## 6. 컴포넌트 Props

### EventDisplay

```typescript
interface EventDisplayProps {
  event: GameEvent | null;
  onSelectLeft: () => void;
  onSelectRight: () => void;
  onSelectCenter?: () => void;
  comboCategory?: ItemCategory;
  comboCount?: number;
}
```

### ItemCard

```typescript
interface ItemCardProps {
  item: MemeItem;
  position: 'left' | 'right' | 'center';
  onClick: () => void;
  isComboMatch?: boolean;
  disabled?: boolean;
}
```

### BuffSidebar

```typescript
interface BuffSidebarProps {
  buffs: ActiveBuff[];
  debuffs: ActiveBuff[];
  history: EventResult[];
  maxHistoryItems?: number;  // 기본 10
}
```

### ComboIndicator

```typescript
interface ComboIndicatorProps {
  category: ItemCategory | null;
  count: number;
  bonus: number;
}
```

---

## 7. 이벤트 (Events)

### 게임 이벤트

```typescript
// 아이템 선택 이벤트
interface ItemSelectedEvent {
  eventId: string;
  item: MemeItem;
  selectionType: 'left' | 'right' | 'center' | 'auto';
  hpChange: number;
  altitudeChange: number;
}

// 콤보 이벤트
interface ComboEvent {
  type: 'maintain' | 'break' | 'master';
  category: ItemCategory;
  count: number;
}

// 버프 이벤트
interface BuffEvent {
  type: 'gained' | 'expired' | 'used';
  buff: ActiveBuff;
}
```

---

## 8. 상수

```typescript
// 게임 상수
const GAME_CONSTANTS = {
  MAX_HP: 120,
  START_HP: 120,
  TARGET_ALTITUDE: 3000,
  TOTAL_TIME: 120,
  EVENT_INTERVAL: 1.5,
  SPECIAL_EVENT_DURATION: 3,
  HP_DECREASE_RATE: 1,
  ALTITUDE_INCREASE_RATE: 25,
  MAX_ACTIVE_BUFFS: 3,
};

// 콤보 상수
const COMBO_CONSTANTS = {
  BONUSES: {
    1: 0,
    2: 0.25,
    3: 0.50,
    4: 1.00,
    5: 1.00,
  },
  MASTER_THRESHOLD: 5,
};

// 난이도 상수
const DIFFICULTY_CONSTANTS = {
  EASY_ALTITUDE: 1000,
  MEDIUM_ALTITUDE: 2000,
  RATIOS: {
    easy: { positive: 60, negative: 40 },
    medium: { positive: 50, negative: 50 },
    hard: { positive: 40, negative: 60 },
  },
};
```
