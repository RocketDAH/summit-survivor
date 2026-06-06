// 밈 아이템 통합 인덱스
import { MemeItem, ItemCategory } from '@/types/meme-event';

import { SUPPLY_ITEMS } from './supply';
import { REST_ITEMS } from './rest';
import { GEAR_ITEMS } from './gear';
import { VIEW_ITEMS } from './view';
import { WEATHER_ITEMS } from './weather';
import { CHALLENGE_ITEMS } from './challenge';
import { TEMPTATION_ITEMS } from './temptation';
import { MEET_ITEMS } from './meet';
import { RARE_ITEMS } from './rare';
import { MEME_ITEMS } from './meme';

// 전체 아이템 목록
export const ALL_MEME_ITEMS: MemeItem[] = [
  ...SUPPLY_ITEMS,
  ...REST_ITEMS,
  ...GEAR_ITEMS,
  ...VIEW_ITEMS,
  ...WEATHER_ITEMS,
  ...CHALLENGE_ITEMS,
  ...TEMPTATION_ITEMS,
  ...MEET_ITEMS,
  ...RARE_ITEMS,
  ...MEME_ITEMS,
];

// 카테고리별 아이템
export const ITEMS_BY_CATEGORY: Record<ItemCategory, MemeItem[]> = {
  supply: SUPPLY_ITEMS,
  rest: REST_ITEMS,
  gear: GEAR_ITEMS,
  view: VIEW_ITEMS,
  weather: WEATHER_ITEMS,
  challenge: CHALLENGE_ITEMS,
  temptation: TEMPTATION_ITEMS,
  meet: MEET_ITEMS,
  rare: RARE_ITEMS,
  meme: MEME_ITEMS,
};

// 긍정적 카테고리 (주로 HP 회복)
export const POSITIVE_CATEGORIES: ItemCategory[] = [
  'supply',
  'rest',
  'gear',
  'view',
  'meet',
  'meme',
];

// 부정적 카테고리 (주로 HP 감소)
export const NEGATIVE_CATEGORIES: ItemCategory[] = [
  'weather',
  'temptation',
];

// 고위험 고보상 카테고리
export const RISKY_CATEGORIES: ItemCategory[] = [
  'challenge',
  'rare',
];

// 아이템 ID로 찾기
export function getItemById(id: string): MemeItem | undefined {
  return ALL_MEME_ITEMS.find(item => item.id === id);
}

// 카테고리에서 랜덤 아이템
export function getRandomItemFromCategory(category: ItemCategory): MemeItem {
  const items = ITEMS_BY_CATEGORY[category];
  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight ?? 1;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

// 가중치 기반 랜덤 아이템
export function getWeightedRandomItem(items: MemeItem[]): MemeItem {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight ?? 1;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

// 개별 카테고리 export
export {
  SUPPLY_ITEMS,
  REST_ITEMS,
  GEAR_ITEMS,
  VIEW_ITEMS,
  WEATHER_ITEMS,
  CHALLENGE_ITEMS,
  TEMPTATION_ITEMS,
  MEET_ITEMS,
  RARE_ITEMS,
  MEME_ITEMS,
};
