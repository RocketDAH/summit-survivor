// 2지선다 이벤트 생성기
import {
  MemeItem,
  ItemCategory,
  DilemmaEvent,
  DilemmaType,
  Scenario,
  ComboState,
  ActiveBuff,
  MEME_GAME_CONSTANTS,
} from '@/types/meme-event';
import {
  ALL_MEME_ITEMS,
  ITEMS_BY_CATEGORY,
  POSITIVE_CATEGORIES,
  NEGATIVE_CATEGORIES,
  RISKY_CATEGORIES,
  getWeightedRandomItem,
  getRandomItemFromCategory,
} from '@/data/meme-items';

// 이벤트 ID 생성
function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 현재 시나리오 판단
export function getCurrentScenario(
  hp: number,
  maxHp: number,
  altitude: number,
  targetAltitude: number,
  combo: ComboState,
  debuffs: ActiveBuff[]
): Scenario {
  const hpPercent = (hp / maxHp) * 100;
  const progressPercent = (altitude / targetAltitude) * 100;
  
  // 위기 상황: HP 25% 이하
  if (hpPercent <= 25) {
    return 'crisis';
  }
  
  // 디버프 구원: 디버프 2개 이상
  if (debuffs.length >= 2) {
    return 'rescue';
  }
  
  // 최종 스퍼트: 고도 80% 이상
  if (progressPercent >= 80) {
    return 'sprint';
  }
  
  // 콤보 시나리오: 3콤보 이상
  if (combo.count >= 3) {
    return 'combo';
  }
  
  return 'normal';
}

// 딜레마 타입 선택
function selectDilemmaType(scenario: Scenario): DilemmaType {
  const types: Record<Scenario, DilemmaType[]> = {
    normal: ['hp_vs_altitude', 'instant_vs_buff', 'safe_vs_risk'],
    crisis: ['hp_vs_altitude', 'safe_vs_risk', 'debuff_rescue'],
    sprint: ['hp_vs_altitude', 'instant_vs_buff', 'preserve_vs_push'],
    rescue: ['debuff_rescue', 'safe_vs_risk', 'instant_vs_buff'],
    combo: ['combo_maintain', 'instant_vs_buff', 'safe_vs_risk'],
  };
  
  const availableTypes = types[scenario];
  return availableTypes[Math.floor(Math.random() * availableTypes.length)];
}

// HP 회복 아이템 필터
function getHealingItems(): MemeItem[] {
  return ALL_MEME_ITEMS.filter(item => 
    item.effects.some(e => e.type === 'hp' && (e.value ?? 0) > 0)
  );
}

// 고도 상승 아이템 필터
function getAltitudeItems(): MemeItem[] {
  return ALL_MEME_ITEMS.filter(item =>
    item.effects.some(e => e.type === 'altitude' && (e.value ?? 0) > 0)
  );
}

// 버프 아이템 필터
function getBuffItems(): MemeItem[] {
  return ALL_MEME_ITEMS.filter(item =>
    item.effects.some(e => e.type === 'buff')
  );
}

// 디버프 해제 아이템 필터
function getDebuffRemovalItems(): MemeItem[] {
  return ALL_MEME_ITEMS.filter(item =>
    item.effects.some(e => e.type === 'remove_debuff')
  );
}

// 카테고리별 랜덤 아이템 (콤보용)
function getItemForCombo(category: ItemCategory): MemeItem {
  return getRandomItemFromCategory(category);
}

// 딜레마에 맞는 아이템 페어 생성
function generateItemPair(
  dilemmaType: DilemmaType,
  combo: ComboState
): [MemeItem, MemeItem] {
  switch (dilemmaType) {
    case 'hp_vs_altitude': {
      const healingItems = getHealingItems();
      const altitudeItems = getAltitudeItems();
      return [
        getWeightedRandomItem(healingItems),
        getWeightedRandomItem(altitudeItems),
      ];
    }
    
    case 'instant_vs_buff': {
      const instantItems = ALL_MEME_ITEMS.filter(item =>
        item.effects.some(e => e.type === 'hp' && (e.value ?? 0) > 15)
      );
      const buffItems = getBuffItems();
      return [
        getWeightedRandomItem(instantItems),
        getWeightedRandomItem(buffItems),
      ];
    }
    
    case 'safe_vs_risk': {
      const safeItems = POSITIVE_CATEGORIES.flatMap(c => ITEMS_BY_CATEGORY[c]);
      const riskItems = RISKY_CATEGORIES.flatMap(c => ITEMS_BY_CATEGORY[c]);
      return [
        getWeightedRandomItem(safeItems),
        getWeightedRandomItem(riskItems),
      ];
    }
    
    case 'preserve_vs_push': {
      const preserveItems = getHealingItems().filter(item =>
        item.effects.some(e => e.type === 'hp' && (e.value ?? 0) >= 10)
      );
      const pushItems = getAltitudeItems().filter(item =>
        item.effects.some(e => e.type === 'altitude' && (e.value ?? 0) >= 200)
      );
      return [
        getWeightedRandomItem(preserveItems),
        getWeightedRandomItem(pushItems.length > 0 ? pushItems : getAltitudeItems()),
      ];
    }
    
    case 'combo_maintain': {
      if (combo.category) {
        // 현재 콤보 카테고리 아이템 vs 다른 좋은 아이템
        const comboItem = getItemForCombo(combo.category);
        const otherItems = ALL_MEME_ITEMS.filter(
          item => item.category !== combo.category
        );
        return [
          comboItem,
          getWeightedRandomItem(otherItems),
        ];
      }
      // 콤보 없으면 일반 딜레마
      return generateItemPair('hp_vs_altitude', combo);
    }
    
    case 'debuff_rescue': {
      const removalItems = getDebuffRemovalItems();
      const healingItems = getHealingItems();
      return [
        getWeightedRandomItem(removalItems.length > 0 ? removalItems : healingItems),
        getWeightedRandomItem(healingItems),
      ];
    }
    
    default:
      return generateItemPair('hp_vs_altitude', combo);
  }
}

// 2지선다 이벤트 생성
export function generateDilemmaEvent(
  hp: number,
  maxHp: number,
  altitude: number,
  targetAltitude: number,
  combo: ComboState,
  debuffs: ActiveBuff[]
): DilemmaEvent {
  const scenario = getCurrentScenario(hp, maxHp, altitude, targetAltitude, combo, debuffs);
  const dilemmaType = selectDilemmaType(scenario);
  const [leftItem, rightItem] = generateItemPair(dilemmaType, combo);
  
  const now = Date.now();
  const duration = MEME_GAME_CONSTANTS.EVENT_INTERVAL * 1000;
  
  return {
    id: generateEventId(),
    leftItem,
    rightItem,
    createdAt: now,
    expiresAt: now + duration,
    duration,
    isSpecial: false,
  };
}

// 3지선다 특수 이벤트 생성
export function generateSpecialEvent(
  hp: number,
  maxHp: number,
  altitude: number,
  targetAltitude: number,
  combo: ComboState,
  debuffs: ActiveBuff[]
): DilemmaEvent {
  const scenario = getCurrentScenario(hp, maxHp, altitude, targetAltitude, combo, debuffs);
  
  // 3지선다: 좋은 것, 보통, 위험한 것
  const goodItems = POSITIVE_CATEGORIES.flatMap(c => ITEMS_BY_CATEGORY[c]);
  const normalItems = ALL_MEME_ITEMS.filter(item => 
    !RISKY_CATEGORIES.includes(item.category) &&
    !NEGATIVE_CATEGORIES.includes(item.category)
  );
  const rareItems = ITEMS_BY_CATEGORY['rare'];
  
  const leftItem = getWeightedRandomItem(goodItems);
  const rightItem = getWeightedRandomItem(normalItems);
  const centerItem = getWeightedRandomItem(rareItems);
  
  const now = Date.now();
  const duration = MEME_GAME_CONSTANTS.SPECIAL_EVENT_DURATION * 1000;
  
  return {
    id: generateEventId(),
    leftItem,
    rightItem,
    centerItem,
    createdAt: now,
    expiresAt: now + duration,
    duration,
    isSpecial: true,
  };
}

// 자동 선택 (타임아웃)
export function autoSelectItem(event: DilemmaEvent): {
  selectedItem: MemeItem;
  position: 'left' | 'right' | 'center';
} {
  const random = Math.random();
  
  if (event.centerItem) {
    // 3지선다: 33%씩
    if (random < 0.33) {
      return { selectedItem: event.leftItem, position: 'left' };
    } else if (random < 0.66) {
      return { selectedItem: event.rightItem, position: 'right' };
    } else {
      return { selectedItem: event.centerItem, position: 'center' };
    }
  } else {
    // 2지선다: 50%씩
    if (random < 0.5) {
      return { selectedItem: event.leftItem, position: 'left' };
    } else {
      return { selectedItem: event.rightItem, position: 'right' };
    }
  }
}

// 이벤트 만료 확인
export function isEventExpired(event: DilemmaEvent): boolean {
  return Date.now() >= event.expiresAt;
}

// 남은 시간 계산 (0~1 비율)
export function getEventTimeRatio(event: DilemmaEvent): number {
  const now = Date.now();
  const elapsed = now - event.createdAt;
  const ratio = 1 - elapsed / event.duration;
  return Math.max(0, Math.min(1, ratio));
}

// 남은 시간 (ms)
export function getEventRemainingTime(event: DilemmaEvent): number {
  const remaining = event.expiresAt - Date.now();
  return Math.max(0, remaining);
}
