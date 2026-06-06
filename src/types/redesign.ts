// ============================================================================
// Equipment-Survival Redesign — 공유 계약 (contract) 파일
// design.md (specs/004-equipment-survival-redesign) 기반.
//
// ⚠️ 이 파일은 두 사람이 공유하는 "계약"입니다.
//    - 타입/시그니처 변경은 반드시 별도의 작은 "계약 변경" PR로 먼저 머지하고,
//      양쪽 모두 rebase 하세요. 기능 PR에 섞지 마세요. (implementation-plan.md §Git 규칙)
// ============================================================================

import type { GameStatus } from "@/types/game";
import type { ItemEffect } from "@/types/meme-event";
import type { StateCreator } from "zustand";

// ----------------------------------------------------------------------------
// 상수 (design.md §10 밸런스 표)
// ----------------------------------------------------------------------------
export const REDESIGN_CONSTANTS = {
  START_HP: 100,
  MAX_HP_CAP: 120, // 하드 캡
  BASE_SPEED: 25, // m/s
  TARGET_ALTITUDE: 3000,
  CHOICE_INTERVAL_M: 500, // 장비 선택(멈춤) 구간
  CONSUMABLE_INTERVAL_M: 200, // 소비 자동 줍기 구간
  HAZARD_INTERVAL_S: [6, 8] as [number, number], // 위협 발생 간격(랜덤)
  DEFAULT_CONSUMABLE_SLOTS: 2,
  AUTO_HEAL_HP_RATIO: 0.4, // HP가 이 비율 이하로 떨어지면 회복템 자동 사용
} as const;

/** 고도 구간별 HP 드레인 (design.md §2.1) */
export function getDrainPerSecond(altitude: number): number {
  if (altitude < 1000) return 0.3;
  if (altitude < 2000) return 0.5;
  return 0.8;
}

// ----------------------------------------------------------------------------
// 도메인 타입 (design.md §3, §4, §7)
// ----------------------------------------------------------------------------
export type EquipSlot = "head" | "body" | "feet" | "hands" | "back" | "accessory";

export type HazardType =
  // 환경 (장비로 면제)
  | "rain"
  | "rockfall"
  | "ice"
  | "cliff"
  | "blizzard"
  | "cold"
  | "lightning"
  // 동물 (소비로 대응)
  | "snake"
  | "boar"
  | "bear";

export interface EquipmentDef {
  id: string;
  name: string;
  slot: EquipSlot;
  tier: 1 | 2 | 3;
  maxHpBonus?: number;
  speedBonus?: number;
  consumableSlots?: number; // back 슬롯 전용
  immunities?: HazardType[]; // 완전 면제
  reductions?: Partial<Record<HazardType, number>>; // 0~1 피해 경감
  lightningChance?: number; // 아이젠 등 부작용
  icon?: string;
}

export interface ConsumableDef {
  id: string;
  name: string;
  effects: ItemEffect[]; // 기존 ItemEffect 재사용 (hp/buff/special…)
  counterAnimal?: number; // 동물 피해 경감 0~1 (1 = 무효)
  blockEnvironment?: boolean; // 환경 피해 1회 방어
  power?: number; // 가방이 꽉 찼을 때 "가장 약한 것" 비교용
  icon?: string;
}

export interface HazardDef {
  type: HazardType;
  name: string;
  minAltitude: number;
  category: "environment" | "animal";
  hpDelta?: number; // 즉시 피해(음수)
  drainMultiplier?: number; // 드레인 배수(지속형)
  speedMultiplier?: number; // 속도 배수(지속형)
  durationSec?: number; // 지속형 길이
  immuneIfHas: EquipSlot[]; // 환경: 이 슬롯들의 immunities가 type을 커버하면 면제
  icon?: string;
}

export interface ActiveHazard {
  def: HazardDef;
  remaining: number; // 지속형 남은 시간(초)
}

/** 장비에서 파생된 실효 스탯 */
export interface DerivedStats {
  maxHp: number; // START_HP + 보너스, MAX_HP_CAP 클립
  speed: number; // m/s
  immunities: HazardType[];
  reductions: Partial<Record<HazardType, number>>;
  consumableSlots: number;
  lightningChance: number;
}

export type ChoiceKind = "equipment" | "stat";

export interface ChoiceCard {
  kind: ChoiceKind;
  label: string;
  equipment?: EquipmentDef;
  stat?: { maxHp?: number; speed?: number };
}

// ============================================================================
// 스토어 슬라이스 계약 (각 슬라이스 = 한 사람 소유, 한 파일)
//   소유: implementation-plan.md §작업 분할 표
// ============================================================================

/** 등반 코어 — 소유: A.  HP의 단일 소유자(damage/heal은 여기로 모인다). */
export interface ClimbSlice {
  altitude: number;
  hp: number;
  baseSpeed: number;
  /** 마스터 틱 — 다른 슬라이스의 tick/spawn/open/checkEnd를 오케스트레이션 */
  tick: (dt: number) => void;
  damage: (amount: number) => void;
  heal: (amount: number) => void;
  resetClimb: () => void;
}

/** 장비 시스템 — 소유: A */
export interface EquipmentSlice {
  equipped: Partial<Record<EquipSlot, EquipmentDef>>;
  equip: (def: EquipmentDef) => void;
  getDerivedStats: () => DerivedStats;
  resetEquipment: () => void;
}

/** 위협 시스템 — 소유: A */
export interface HazardSlice {
  activeHazards: ActiveHazard[];
  timeSinceHazard: number;
  nextHazardIn: number;
  maybeSpawnHazard: (dt: number) => void;
  tickHazards: (dt: number) => void;
  resetHazards: () => void;
}

/** 소비 시스템 — 소유: B */
export interface ConsumableSlice {
  inventory: ConsumableDef[];
  /** 자동 줍기: 가방이 꽉 차면 가장 약한 것을 자동 교체 */
  pickup: (def: ConsumableDef) => void;
  /** HP 낮을 때 climb.tick이 호출 → 회복템 자동 사용 */
  autoUseHeal: () => void;
  /** 동물 위협 시 hazard가 호출 → 방어템 자동 소모, 남은 피해 배수(0~1) 반환 */
  autoUseDefense: (hazard: HazardDef) => number;
  resetConsumables: () => void;
}

/** 빌드 선택 화면 + 일시정지 — 소유: B */
export interface ChoiceSlice {
  openChoice: ChoiceCard[] | null;
  isPaused: boolean;
  nextChoiceAltitude: number;
  /** 500m 마일스톤 도달 시 선택지 오픈(게임 멈춤) */
  maybeOpenChoice: (altitude: number) => void;
  pickCard: (index: number) => void;
  resetChoice: () => void;
}

/** 메타(상태/점수/시작·리셋) — 소유: B */
export interface MetaSlice {
  status: GameStatus;
  score: number;
  startTime: number | null;
  endTime: number | null;
  startGame: () => void;
  resetGame: () => void; // 모든 슬라이스 reset 호출
  checkEnd: () => void; // 승: altitude≥target / 패: hp≤0
  calcScore: () => number;
}

/** 합성된 전체 스토어 */
export type RedesignStore = ClimbSlice &
  EquipmentSlice &
  HazardSlice &
  ConsumableSlice &
  ChoiceSlice &
  MetaSlice;

/** 슬라이스 작성용 헬퍼 타입 */
export type SliceCreator<T> = StateCreator<RedesignStore, [], [], T>;
