# 빠른 시작 가이드: 밈 이벤트 시스템

**기능**: 003-meme-event-system  
**날짜**: 2026-06-06

---

## 개요

밈 이벤트 시스템은 기존 단일 아이템 선택 방식을 **2지선다 양자택일** 방식으로 변경하고, 콤보/버프 시스템을 추가하여 전략적 깊이를 더합니다.

---

## 핵심 변경사항

| 항목 | 기존 | 변경 |
|------|------|------|
| 이벤트 | 아이템 1개, 선택/무시 | 아이템 2개, 양자택일 |
| 선택 안함 | 무시됨 | 50:50 자동 선택 |
| 최대 HP | 100 | 120 |
| 콤보 | 없음 | 카테고리별 연속 보너스 |
| 버프 | 없음 | 6종 버프, 4종 디버프 |

---

## 1. 아이템 데이터 추가

### 카테고리별 파일 구조

```typescript
// src/data/meme-items/supply.ts
import { MemeItem } from '@/types/meme-event';

export const SUPPLY_ITEMS: MemeItem[] = [
  {
    id: 'supply_triangle',
    name: '정상 삼각김밥',
    category: 'supply',
    description: '"편의점에서 사온 보람"',
    effects: [{ type: 'hp', value: 12 }],
  },
  // ... 더 많은 아이템
];
```

### 전체 아이템 내보내기

```typescript
// src/data/meme-items/index.ts
import { SUPPLY_ITEMS } from './supply';
import { REST_ITEMS } from './rest';
// ... 나머지 import

export const ALL_MEME_ITEMS: MemeItem[] = [
  ...SUPPLY_ITEMS,
  ...REST_ITEMS,
  // ... 나머지 카테고리
];

export const ITEMS_BY_CATEGORY = {
  supply: SUPPLY_ITEMS,
  rest: REST_ITEMS,
  // ... 나머지 카테고리
};
```

---

## 2. 게임 스토어 확장

### 상태 추가

```typescript
// src/stores/gameStore.ts
import { create } from 'zustand';

interface GameState {
  // 기존 상태...
  
  // 새로운 상태
  combo: {
    category: ItemCategory | null;
    count: number;
  };
  activeBuffs: ActiveBuff[];
  activeDebuffs: ActiveBuff[];
  eventHistory: EventResult[];
}

const initialState = {
  // 기존...
  maxHp: 120,  // 변경
  hp: 120,     // 변경
  
  // 새로운
  combo: { category: null, count: 0 },
  activeBuffs: [],
  activeDebuffs: [],
  eventHistory: [],
};
```

### 액션 추가

```typescript
// 이벤트 선택
selectLeft: () => {
  const state = get();
  if (!state.currentEvent) return;
  
  const item = state.currentEvent.leftItem;
  get().applyItemEffects(item, false);
  get().updateCombo(item.category);
},

selectRight: () => {
  const state = get();
  if (!state.currentEvent) return;
  
  const item = state.currentEvent.rightItem;
  get().applyItemEffects(item, false);
  get().updateCombo(item.category);
},

autoSelect: () => {
  const state = get();
  if (!state.currentEvent) return;
  
  const item = Math.random() < 0.5 
    ? state.currentEvent.leftItem 
    : state.currentEvent.rightItem;
  get().applyItemEffects(item, true);
  get().updateCombo(item.category);
},
```

---

## 3. 이벤트 생성기

### 기본 사용법

```typescript
// src/lib/event-generator.ts
import { generateDilemmaEvent } from '@/lib/event-generator';

// 게임 루프에서
const event = generateDilemmaEvent(gameState);
set({ currentEvent: event });
```

### 딜레마 페어링

```typescript
function generateDilemmaEvent(state: GameState): GameEvent {
  // 1. 시나리오 결정
  const scenario = determineScenario(state);
  
  // 2. 딜레마 타입 선택
  const dilemmaType = selectDilemmaType(scenario);
  
  // 3. 아이템 페어 선택
  const [leftItem, rightItem] = selectItemPair(dilemmaType, state);
  
  // 4. 이벤트 생성
  return {
    id: generateId(),
    leftItem,
    rightItem,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1500,
    duration: 1.5,
  };
}
```

---

## 4. UI 컴포넌트

### 2지선다 이벤트 표시

```tsx
// src/components/game/EventDisplay.tsx
export function EventDisplay() {
  const currentEvent = useGameStore(s => s.currentEvent);
  const selectLeft = useGameStore(s => s.selectLeft);
  const selectRight = useGameStore(s => s.selectRight);
  const { category, count } = useCombo();
  
  if (!currentEvent) return <WaitingState />;
  
  return (
    <div className="event-display">
      <EventTimer event={currentEvent} />
      
      <div className="items-container">
        <ItemCard 
          item={currentEvent.leftItem}
          onClick={selectLeft}
          isComboMatch={currentEvent.leftItem.category === category}
        />
        
        <div className="vs-divider">VS</div>
        
        <ItemCard 
          item={currentEvent.rightItem}
          onClick={selectRight}
          isComboMatch={currentEvent.rightItem.category === category}
        />
      </div>
      
      {count >= 2 && (
        <ComboIndicator category={category} count={count} />
      )}
    </div>
  );
}
```

### 버프 사이드바

```tsx
// src/components/game/BuffSidebar.tsx
export function BuffSidebar() {
  const { activeBuffs, activeDebuffs } = useBuffs();
  const eventHistory = useGameStore(s => s.eventHistory);
  
  return (
    <aside className="buff-sidebar">
      <section className="active-buffs">
        <h3>활성 버프</h3>
        {activeBuffs.map(buff => (
          <BuffItem key={buff.id} buff={buff} />
        ))}
      </section>
      
      <section className="active-debuffs">
        {activeDebuffs.map(debuff => (
          <BuffItem key={debuff.id} buff={debuff} isDebuff />
        ))}
      </section>
      
      <section className="history">
        <h3>히스토리</h3>
        {eventHistory.slice(-10).map(result => (
          <HistoryItem key={result.eventId} result={result} />
        ))}
      </section>
    </aside>
  );
}
```

---

## 5. 콤보 시스템

### 콤보 훅

```typescript
// src/hooks/useCombo.ts
export function useCombo() {
  const combo = useGameStore(s => s.combo);
  
  const bonus = COMBO_BONUSES[Math.min(combo.count, 5)] ?? 1.0;
  const display = COMBO_DISPLAY[Math.min(combo.count, 5)] ?? '';
  
  return {
    category: combo.category,
    count: combo.count,
    bonus,
    display,
    isActive: combo.count >= 2,
  };
}
```

### 콤보 업데이트

```typescript
// gameStore 내부
updateCombo: (category: ItemCategory) => {
  const state = get();
  
  if (state.combo.category === category) {
    // 콤보 유지
    set({
      combo: {
        category,
        count: state.combo.count + 1,
      },
    });
  } else {
    // 콤보 리셋
    set({
      combo: {
        category,
        count: 1,
      },
    });
  }
},
```

---

## 6. 버프 시스템

### 버프 적용

```typescript
// src/lib/buff.ts
export function applyBuffEffects(
  state: GameState,
  effectType: 'hp' | 'altitude',
  baseValue: number
): number {
  let value = baseValue;
  
  // 갓생모드: HP 감소 절반
  if (effectType === 'hp' && baseValue < 0) {
    if (hasBuff(state, 'godlife')) {
      value = Math.ceil(value / 2);
    }
  }
  
  // 저주: 회복량 절반
  if (effectType === 'hp' && baseValue > 0) {
    if (hasBuff(state, 'curse')) {
      value = Math.floor(value / 2);
    }
  }
  
  // 광기: 모든 효과 2배
  if (hasBuff(state, 'frenzy')) {
    value = value * 2;
  }
  
  // 콤보 보너스 적용
  if (effectType === 'hp' && baseValue > 0) {
    const bonus = getComboBonus(state.combo.count);
    value = Math.floor(value * (1 + bonus));
  }
  
  return value;
}
```

### 버프 틱

```typescript
// 게임 루프 내부
tickBuffs: (deltaTime: number) => {
  const state = get();
  
  const updatedBuffs = state.activeBuffs
    .map(buff => ({
      ...buff,
      remainingTime: (buff.remainingTime ?? 0) - deltaTime,
    }))
    .filter(buff => 
      (buff.remainingTime ?? 0) > 0 || (buff.usesLeft ?? 0) > 0
    );
  
  const updatedDebuffs = state.activeDebuffs
    .map(debuff => ({
      ...debuff,
      remainingTime: (debuff.remainingTime ?? 0) - deltaTime,
    }))
    .filter(debuff => (debuff.remainingTime ?? 0) > 0);
  
  set({
    activeBuffs: updatedBuffs,
    activeDebuffs: updatedDebuffs,
  });
},
```

---

## 7. 통합 체크리스트

### 구현 순서

- [ ] 타입 정의 (`src/types/meme-event.ts`)
- [ ] 아이템 데이터 (`src/data/meme-items/`)
- [ ] 게임 스토어 확장 (`src/stores/gameStore.ts`)
- [ ] 이벤트 생성기 (`src/lib/event-generator.ts`)
- [ ] 콤보 시스템 (`src/lib/combo.ts`)
- [ ] 버프 시스템 (`src/lib/buff.ts`)
- [ ] 2지선다 UI (`src/components/game/EventDisplay.tsx`)
- [ ] 버프 사이드바 (`src/components/game/BuffSidebar.tsx`)
- [ ] 콤보 표시 (`src/components/game/ComboIndicator.tsx`)
- [ ] 게임 루프 통합 (`src/hooks/useGameLoop.ts`)

### 테스트 항목

- [ ] 이벤트가 1.5초마다 생성되는가
- [ ] 시간 초과 시 자동 선택이 작동하는가
- [ ] 콤보가 정확히 계산되는가
- [ ] 버프/디버프가 시간에 따라 만료되는가
- [ ] 실드가 부정 효과를 차단하는가
- [ ] HP 120 기준 밸런스가 적절한가

---

## 8. 마이그레이션

### 기존 코드 영향

| 파일 | 변경 사항 |
|------|----------|
| `src/types/game.ts` | `GAME_CONSTANTS.MAX_HP` 120으로 변경 |
| `src/stores/gameStore.ts` | 콤보, 버프 상태 추가 |
| `src/hooks/useGameLoop.ts` | 버프 틱, 자동 선택 추가 |
| `src/components/game/EventDisplay.tsx` | 2지선다 UI로 변경 |
| `src/data/items.ts` | deprecated, 새 구조로 마이그레이션 |

### 호환성

- 리더보드 API는 변경 없음
- 점수 계산 로직 유지 (콤보 보너스는 게임 내 효과만)
- 기존 픽셀 디자인 시스템 활용
