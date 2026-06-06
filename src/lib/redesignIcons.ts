// 리디자인 표시용 아이콘(이모지) 맵 — 소유: B (프레젠테이션)
// 데이터(equipment/hazards)의 icon 필드가 비어 있을 때의 폴백.
import type { EquipSlot, HazardType } from "@/types/redesign";

export const SLOT_EMOJI: Record<EquipSlot, string> = {
  head: "🧢",
  body: "🧥",
  feet: "🥾",
  hands: "🧤",
  back: "🎒",
  accessory: "🧿",
};

export const SLOT_LABEL: Record<EquipSlot, string> = {
  head: "머리",
  body: "몸통",
  feet: "발",
  hands: "손",
  back: "등",
  accessory: "액세서리",
};

export const HAZARD_EMOJI: Record<HazardType, string> = {
  rain: "🌧",
  rockfall: "🪨",
  ice: "🧊",
  cliff: "🧗",
  blizzard: "🌨",
  cold: "🥶",
  lightning: "⚡",
  snake: "🐍",
  boar: "🐗",
  bear: "🐻",
};

/** 페이퍼돌/HUD에서 그릴 슬롯 순서(아래→위 레이어 느낌) */
export const SLOT_ORDER: EquipSlot[] = ["feet", "body", "back", "hands", "head", "accessory"];
