// 콤보 시스템
import {
  ItemCategory,
  ComboState,
  COMBO_BONUSES,
  COMBO_DISPLAY,
  CATEGORY_EMOJI,
} from '@/types/meme-event';

// 초기 콤보 상태
export const INITIAL_COMBO_STATE: ComboState = {
  category: null,
  count: 0,
};

// 콤보 업데이트
export function updateCombo(
  currentCombo: ComboState,
  selectedCategory: ItemCategory
): ComboState {
  if (currentCombo.category === selectedCategory) {
    // 콤보 유지
    return {
      category: selectedCategory,
      count: currentCombo.count + 1,
    };
  } else {
    // 콤보 리셋
    return {
      category: selectedCategory,
      count: 1,
    };
  }
}

// 콤보 리셋
export function resetCombo(): ComboState {
  return INITIAL_COMBO_STATE;
}

// 콤보 보너스 계산
export function getComboBonus(count: number): number {
  return COMBO_BONUSES[Math.min(count, 5)] ?? 0;
}

// 콤보 표시 텍스트
export function getComboDisplay(count: number): string {
  return COMBO_DISPLAY[Math.min(count, 5)] ?? '';
}

// 콤보 활성 여부
export function isComboActive(combo: ComboState): boolean {
  return combo.count >= 2;
}

// 콤보 마스터 여부 (5콤보 이상)
export function isComboMaster(combo: ComboState): boolean {
  return combo.count >= 5;
}

// 콤보 정보 가져오기
export interface ComboInfo {
  category: ItemCategory | null;
  count: number;
  bonus: number;
  bonusPercent: string;
  display: string;
  emoji: string;
  isActive: boolean;
  isMaster: boolean;
}

export function getComboInfo(combo: ComboState): ComboInfo {
  const bonus = getComboBonus(combo.count);
  return {
    category: combo.category,
    count: combo.count,
    bonus,
    bonusPercent: bonus > 0 ? `+${Math.round(bonus * 100)}%` : '',
    display: getComboDisplay(combo.count),
    emoji: combo.category ? CATEGORY_EMOJI[combo.category] : '',
    isActive: isComboActive(combo),
    isMaster: isComboMaster(combo),
  };
}

// 콤보 유지 시 예상 효과
export function previewComboEffect(
  combo: ComboState,
  category: ItemCategory,
  baseValue: number
): {
  willMaintain: boolean;
  newCount: number;
  bonus: number;
  finalValue: number;
} {
  const willMaintain = combo.category === category;
  const newCount = willMaintain ? combo.count + 1 : 1;
  const bonus = getComboBonus(newCount);
  const finalValue = Math.floor(baseValue * (1 + bonus));
  
  return {
    willMaintain,
    newCount,
    bonus,
    finalValue,
  };
}
