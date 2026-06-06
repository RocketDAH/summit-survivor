# 데이터 모델: 밈 이벤트 시스템

**기능**: 003-meme-event-system  
**날짜**: 2026-06-06

---

## 1. 아이템 타입

### ItemCategory (아이템 카테고리)

```typescript
type ItemCategory = 
  | 'supply'      // 🎒 보급품
  | 'rest'        // ⛺ 휴식
  | 'gear'        // 🥾 장비
  | 'view'        // 🌄 절경
  | 'weather'     // ⛈️ 날씨
  | 'challenge'   // 🧗 도전
  | 'temptation'  // 📱 유혹
  | 'meet'        // 👥 만남
  | 'rare'        // ⭐ 기적
  | 'meme';       // 🎭 밈

const CATEGORY_EMOJI: Record<ItemCategory, string> = {
  supply: '🎒',
  rest: '⛺',
  gear: '🥾',
  view: '🌄',
  weather: '⛈️',
  challenge: '🧗',
  temptation: '📱',
  meet: '👥',
  rare: '⭐',
  meme: '🎭',
};
```

### MemeItem (밈 아이템)

```typescript
interface MemeItem {
  id: string;                    // 고유 식별자 (예: 'supply_triangle')
  name: string;                  // 표시 이름 (예: '정상 삼각김밥')
  category: ItemCategory;        // 카테고리
  description: string;           // 설명 (예: '"편의점에서 사온 보람"')
  
  // 효과
  effects: ItemEffect[];
  
  // 생성 확률 가중치 (기본 1.0)
  weight?: number;
  
  // 등장 조건 (선택적)
  conditions?: ItemCondition;
}
```

### ItemEffect (아이템 효과)

```typescript
type EffectType = 
  | 'hp'           // HP 변화
  | 'altitude'     // 고도 변화
  | 'buff'         // 버프 부여
  | 'debuff'       // 디버프 부여
  | 'remove_debuff'// 디버프 제거
  | 'random'       // 랜덤 효과 (±)
  | 'special';     // 특수 효과

interface ItemEffect {
  type: EffectType;
  
  // HP/고도 효과
  value?: number;              // 고정값
  range?: [number, number];    // 랜덤 범위 (예: [-30, 30])
  
  // 버프/디버프 효과
  buffType?: BuffType;
  duration?: number;           // 초 단위
  uses?: number;               // 1회성 버프의 사용 횟수
  
  // 디버프 제거
  removeCount?: number;        // 제거할 디버프 수 (1 또는 'all')
  
  // 특수 효과
  specialId?: string;          // 특수 효과 ID
}
```

### ItemCondition (등장 조건)

```typescript
interface ItemCondition {
  minAltitude?: number;        // 최소 고도
  maxAltitude?: number;        // 최대 고도
  minHp?: number;              // 최소 HP
  maxHp?: number;              // 최대 HP
  hasDebuff?: boolean;         // 디버프 보유 시만
  comboMin?: number;           // 최소 콤보
  rarity?: 'common' | 'rare' | 'legendary';  // 희귀도
}
```

### 아이템 예시

```typescript
const SUPPLY_TRIANGLE: MemeItem = {
  id: 'supply_triangle',
  name: '정상 삼각김밥',
  category: 'supply',
  description: '"편의점에서 사온 보람"',
  effects: [
    { type: 'hp', value: 12 }
  ],
  weight: 1.0,
};

const GEAR_GORETEX: MemeItem = {
  id: 'gear_goretex',
  name: '고어텍스',
  category: 'gear',
  description: '"비 와도 OK"',
  effects: [
    { type: 'buff', buffType: 'shield', uses: 1 },
    { type: 'buff', buffType: 'godlife', duration: 20 }
  ],
  weight: 0.8,
};

const CHALLENGE_SHORTCUT: MemeItem = {
  id: 'challenge_shortcut',
  name: '숏컷',
  category: 'challenge',
  description: '"샛길 발견... 맞나?"',
  effects: [
    { type: 'random', range: [-30, 30] },
    { type: 'altitude', value: 300 }
  ],
  weight: 0.6,
};
```

---

## 2. 버프/디버프 타입

### BuffType (버프 종류)

```typescript
type BuffType = 
  // 긍정 버프
  | 'godlife'    // 🌟 갓생모드: HP 감소 -50%
  | 'hyper'      // ⚡ 하이퍼: 고도 상승 +100%
  | 'shield'     // 🛡️ 철벽: 부정 효과 무시 1회
  | 'lucky'      // 🍀 럭키: 다음 랜덤 긍정 확정
  | 'frenzy'     // 😈 광기: 모든 효과 2배
  | 'zen'        // 🧘 존버: HP 감소 중지
  
  // 부정 디버프
  | 'panic'      // 😵 멘붕: HP 감소 +50%
  | 'slow'       // 🐌 슬로우: 고도 상승 -50%
  | 'confusion'  // ❓ 혼란: 효과 표시 안됨
  | 'curse';     // 💀 저주: 회복량 -50%
```

### BuffConfig (버프 설정)

```typescript
interface BuffConfig {
  type: BuffType;
  name: string;
  emoji: string;
  description: string;
  isDebuff: boolean;
  
  // 기본 지속시간 (초), undefined면 1회성
  defaultDuration?: number;
  
  // 기본 사용 횟수 (1회성 버프)
  defaultUses?: number;
}

const BUFF_CONFIGS: Record<BuffType, BuffConfig> = {
  godlife: {
    type: 'godlife',
    name: '갓생모드',
    emoji: '🌟',
    description: 'HP 감소 속도 -50%',
    isDebuff: false,
    defaultDuration: 30,
  },
  shield: {
    type: 'shield',
    name: '철벽',
    emoji: '🛡️',
    description: '부정 효과 무시 1회',
    isDebuff: false,
    defaultUses: 1,
  },
  // ... 나머지 버프들
};
```

### ActiveBuff (활성 버프)

```typescript
interface ActiveBuff {
  id: string;              // 고유 ID (uuid)
  type: BuffType;
  startedAt: number;       // 시작 시간 (timestamp)
  
  // 시간 기반 버프
  duration?: number;       // 총 지속시간 (초)
  remainingTime?: number;  // 남은 시간 (초)
  
  // 사용 횟수 기반 버프
  totalUses?: number;
  usesLeft?: number;
}
```

---

## 3. 콤보 시스템

### ComboState (콤보 상태)

```typescript
interface ComboState {
  category: ItemCategory | null;  // 현재 콤보 카테고리
  count: number;                  // 연속 횟수
  
  // 보너스 계산
  getBonus(): number;             // 0.25, 0.5, 1.0 등
}

const COMBO_BONUSES: Record<number, number> = {
  1: 0,      // 첫 선택: 보너스 없음
  2: 0.25,   // 2연속: +25%
  3: 0.50,   // 3연속: +50%
  4: 1.00,   // 4연속: +100%
  5: 1.00,   // 5연속+: +100% + 특수
};

const COMBO_DISPLAY: Record<number, string> = {
  1: '',
  2: '🔥 x2',
  3: '🔥🔥 x3',
  4: '🔥🔥🔥 x4 MAX',
  5: '⭐ COMBO MASTER',
};
```

---

## 4. 이벤트 타입

### GameEvent (게임 이벤트)

```typescript
interface GameEvent {
  id: string;                    // 고유 ID
  
  // 2지선다 아이템
  leftItem: MemeItem;
  rightItem: MemeItem;
  
  // 타이밍
  createdAt: number;             // 생성 시간
  expiresAt: number;             // 만료 시간
  duration: number;              // 선택 제한 시간 (초)
  
  // 특수 이벤트 (3지선다)
  isSpecial?: boolean;
  centerItem?: MemeItem;
}
```

### EventResult (이벤트 결과)

```typescript
type SelectionType = 'left' | 'right' | 'center' | 'auto';

interface EventResult {
  eventId: string;
  selectedItem: MemeItem;
  selectionType: SelectionType;
  
  // 적용된 효과
  hpChange: number;
  altitudeChange: number;
  buffsGained: ActiveBuff[];
  debuffsRemoved: string[];
  
  // 콤보
  comboMaintained: boolean;
  newComboCount: number;
}
```

---

## 5. 게임 상태 확장

### GameState (확장)

```typescript
interface GameState {
  // 기존 필드
  status: 'idle' | 'playing' | 'victory' | 'defeat';
  hp: number;
  maxHp: number;                 // 120으로 변경
  altitude: number;
  timeRemaining: number;
  
  // 새로운 필드
  currentEvent: GameEvent | null;
  
  // 콤보
  combo: ComboState;
  
  // 버프/디버프
  activeBuffs: ActiveBuff[];
  activeDebuffs: ActiveBuff[];
  
  // 히스토리
  eventHistory: EventResult[];
  
  // 통계
  stats: {
    eventsTotal: number;
    eventsSelected: number;
    eventsAuto: number;
    maxCombo: number;
    categoryCounts: Record<ItemCategory, number>;
  };
}
```

---

## 6. 딜레마 페어링

### DilemmaType (딜레마 유형)

```typescript
type DilemmaType = 
  | 'hp_vs_altitude'      // 회복 vs 전진
  | 'instant_vs_buff'     // 즉시 vs 지속
  | 'safe_vs_risk'        // 안전 vs 모험
  | 'preserve_vs_push'    // 보존 vs 돌파
  | 'combo_maintain'      // 콤보 유지 vs 깨기
  | 'debuff_rescue';      // 디버프 해제 vs 무시

interface DilemmaConfig {
  type: DilemmaType;
  leftCategories: ItemCategory[];   // 왼쪽 후보
  rightCategories: ItemCategory[];  // 오른쪽 후보
  weight: number;                   // 발생 확률 가중치
}
```

### Scenario (시나리오)

```typescript
type Scenario = 'normal' | 'crisis' | 'sprint' | 'rescue' | 'combo';

interface ScenarioConfig {
  scenario: Scenario;
  condition: (state: GameState) => boolean;
  preferredDilemmas: DilemmaType[];
  itemWeightModifiers: Partial<Record<ItemCategory, number>>;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    scenario: 'crisis',
    condition: (state) => state.hp < 30,
    preferredDilemmas: ['hp_vs_altitude', 'safe_vs_risk'],
    itemWeightModifiers: { supply: 1.5, rest: 1.5, rare: 1.3 },
  },
  {
    scenario: 'sprint',
    condition: (state) => state.altitude > 2000,
    preferredDilemmas: ['preserve_vs_push', 'safe_vs_risk'],
    itemWeightModifiers: { challenge: 1.5, gear: 1.2 },
  },
  // ... 나머지 시나리오
];
```

---

## 7. 관계도

```
┌─────────────────────────────────────────────────────────────┐
│                        GameState                             │
│  ┌─────────┐  ┌─────────┐  ┌────────────┐  ┌─────────────┐  │
│  │ hp: 96  │  │altitude │  │ combo      │  │ activeBuffs │  │
│  │ maxHp:  │  │ : 1250  │  │ category:  │  │ [🌟, ⚡]    │  │
│  │ 120     │  │         │  │ 'supply'   │  │             │  │
│  └─────────┘  └─────────┘  │ count: 3   │  └─────────────┘  │
│                            └────────────┘                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   currentEvent                       │    │
│  │  ┌─────────────┐         ┌─────────────┐            │    │
│  │  │ leftItem    │   VS    │ rightItem   │            │    │
│  │  │ 🎒 삼각김밥 │         │ 🧗 암벽구간  │            │    │
│  │  │ +12 HP      │         │ -15HP +250m │            │    │
│  │  └─────────────┘         └─────────────┘            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   eventHistory                       │    │
│  │  ✓ 컵라면 +18   ✓ 등산스틱 +100m 🛡️   ⏰ 점프 (자동) │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. 유효성 검사

### 아이템 검증

```typescript
function validateItem(item: MemeItem): ValidationResult {
  const errors: string[] = [];
  
  // 필수 필드
  if (!item.id) errors.push('id 필수');
  if (!item.name) errors.push('name 필수');
  if (!item.category) errors.push('category 필수');
  if (!item.effects.length) errors.push('최소 1개 효과 필수');
  
  // 효과 검증
  for (const effect of item.effects) {
    if (effect.type === 'hp' && effect.value === undefined) {
      errors.push('hp 효과는 value 필수');
    }
    if (effect.type === 'buff' && !effect.buffType) {
      errors.push('buff 효과는 buffType 필수');
    }
    if (effect.type === 'random' && !effect.range) {
      errors.push('random 효과는 range 필수');
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 버프 상태 검증

```typescript
function validateBuffState(state: GameState): ValidationResult {
  const errors: string[] = [];
  
  // 최대 동시 버프
  if (state.activeBuffs.length > 3) {
    errors.push('동시 버프는 최대 3개');
  }
  
  // 중복 버프 체크
  const buffTypes = state.activeBuffs.map(b => b.type);
  if (new Set(buffTypes).size !== buffTypes.length) {
    errors.push('같은 버프 중복 불가');
  }
  
  return { valid: errors.length === 0, errors };
}
```
