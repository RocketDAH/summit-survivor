// 밈 이벤트 시스템 타입 정의

// 아이템 카테고리
export type ItemCategory =
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

export const CATEGORY_EMOJI: Record<ItemCategory, string> = {
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

export const CATEGORY_NAME: Record<ItemCategory, string> = {
  supply: '보급품',
  rest: '휴식',
  gear: '장비',
  view: '절경',
  weather: '날씨',
  challenge: '도전',
  temptation: '유혹',
  meet: '만남',
  rare: '기적',
  meme: '밈',
};

// 버프 타입
export type BuffType =
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

export interface BuffConfig {
  type: BuffType;
  name: string;
  emoji: string;
  description: string;
  isDebuff: boolean;
  defaultDuration?: number;
  defaultUses?: number;
}

export const BUFF_CONFIGS: Record<BuffType, BuffConfig> = {
  godlife: {
    type: 'godlife',
    name: '갓생모드',
    emoji: '🌟',
    description: 'HP 감소 속도 -50%',
    isDebuff: false,
    defaultDuration: 30,
  },
  hyper: {
    type: 'hyper',
    name: '하이퍼',
    emoji: '⚡',
    description: '고도 상승 속도 +100%',
    isDebuff: false,
    defaultDuration: 15,
  },
  shield: {
    type: 'shield',
    name: '철벽',
    emoji: '🛡️',
    description: '부정 효과 무시 1회',
    isDebuff: false,
    defaultUses: 1,
  },
  lucky: {
    type: 'lucky',
    name: '럭키',
    emoji: '🍀',
    description: '다음 랜덤 긍정 확정',
    isDebuff: false,
    defaultUses: 1,
  },
  frenzy: {
    type: 'frenzy',
    name: '광기',
    emoji: '😈',
    description: '모든 효과 2배',
    isDebuff: false,
    defaultDuration: 20,
  },
  zen: {
    type: 'zen',
    name: '존버',
    emoji: '🧘',
    description: 'HP 감소 완전 중지',
    isDebuff: false,
    defaultDuration: 5,
  },
  panic: {
    type: 'panic',
    name: '멘붕',
    emoji: '😵',
    description: 'HP 감소 속도 +50%',
    isDebuff: true,
    defaultDuration: 15,
  },
  slow: {
    type: 'slow',
    name: '슬로우',
    emoji: '🐌',
    description: '고도 상승 속도 -50%',
    isDebuff: true,
    defaultDuration: 10,
  },
  confusion: {
    type: 'confusion',
    name: '혼란',
    emoji: '❓',
    description: '아이템 효과 표시 안됨',
    isDebuff: true,
    defaultUses: 3,
  },
  curse: {
    type: 'curse',
    name: '저주',
    emoji: '💀',
    description: '모든 회복량 -50%',
    isDebuff: true,
    defaultDuration: 20,
  },
};

// 효과 타입
export type EffectType =
  | 'hp'
  | 'altitude'
  | 'buff'
  | 'debuff'
  | 'remove_debuff'
  | 'random_hp'
  | 'special';

export interface ItemEffect {
  type: EffectType;
  value?: number;
  range?: [number, number];
  buffType?: BuffType;
  duration?: number;
  uses?: number;
  removeCount?: number | 'all';
  specialId?: string;
}

// 밈 아이템
export interface MemeItem {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  effects: ItemEffect[];
  weight?: number;
}

// 활성 버프
export interface ActiveBuff {
  id: string;
  type: BuffType;
  startedAt: number;
  duration?: number;
  remainingTime?: number;
  totalUses?: number;
  usesLeft?: number;
}

// 콤보 상태
export interface ComboState {
  category: ItemCategory | null;
  count: number;
}

// 콤보 보너스
export const COMBO_BONUSES: Record<number, number> = {
  1: 0,
  2: 0.25,
  3: 0.50,
  4: 1.00,
  5: 1.00,
};

export const COMBO_DISPLAY: Record<number, string> = {
  1: '',
  2: '🔥 x2',
  3: '🔥🔥 x3',
  4: '🔥🔥🔥 x4 MAX',
  5: '⭐ COMBO MASTER',
};

// 2지선다 이벤트
export interface DilemmaEvent {
  id: string;
  leftItem: MemeItem;
  rightItem: MemeItem;
  createdAt: number;
  expiresAt: number;
  duration: number;
  isSpecial?: boolean;
  centerItem?: MemeItem;
}

// 선택 타입
export type SelectionType = 'left' | 'right' | 'center' | 'auto';

// 이벤트 결과
export interface EventResult {
  eventId: string;
  selectedItem: MemeItem;
  selectionType: SelectionType;
  hpChange: number;
  altitudeChange: number;
  buffsGained: ActiveBuff[];
  debuffsRemoved: string[];
  comboMaintained: boolean;
  newComboCount: number;
}

// 시나리오 타입
export type Scenario = 'normal' | 'crisis' | 'sprint' | 'rescue' | 'combo';

// 딜레마 타입
export type DilemmaType =
  | 'hp_vs_altitude'
  | 'instant_vs_buff'
  | 'safe_vs_risk'
  | 'preserve_vs_push'
  | 'combo_maintain'
  | 'debuff_rescue';

// 게임 상수 (밈 이벤트 시스템용)
export const MEME_GAME_CONSTANTS = {
  MAX_HP: 120,
  START_HP: 120,
  TARGET_ALTITUDE: 3000,
  TOTAL_TIME: 120,
  EVENT_INTERVAL: 1.5,
  SPECIAL_EVENT_DURATION: 3,
  HP_DECREASE_RATE: 1,
  ALTITUDE_INCREASE_RATE: 25,
  MAX_ACTIVE_BUFFS: 3,
  AUTO_SELECT_ENABLED: true,
} as const;
