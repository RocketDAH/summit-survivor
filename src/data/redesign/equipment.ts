// 장비 데이터 — 소유: A (+ 데이터 채우기 분담 가능)
// design.md §3.2 의 티어 표를 그대로 옮긴다. 아래는 MVP 슬롯(몸통/발/등)의 예시 일부.
// TODO: 머리/손/액세서리 + 나머지 티어 채우기. 수치 변경 시 design.md §3.2 도 같이 수정.
import type { EquipmentDef } from "@/types/redesign";

export const EQUIPMENT: EquipmentDef[] = [
  // 🧥 몸통 (비/추위 면제)
  { id: "windbreaker", name: "바람막이", slot: "body", tier: 1, maxHpBonus: 6, icon: "" },
  { id: "raincoat", name: "우비", slot: "body", tier: 2, maxHpBonus: 4, immunities: ["rain"], icon: "" },
  { id: "padding", name: "패딩", slot: "body", tier: 3, maxHpBonus: 8, immunities: ["rain", "cold"], icon: "" },

  // 🥾 발 (눈/빙판 면제, 속도)
  { id: "sneakers", name: "운동화", slot: "feet", tier: 1, speedBonus: 3, icon: "" },
  { id: "boots", name: "등산화", slot: "feet", tier: 2, speedBonus: 5, immunities: ["ice"], icon: "" },
  { id: "crampons", name: "아이젠", slot: "feet", tier: 3, speedBonus: 8, immunities: ["ice", "blizzard"], lightningChance: 0.1, icon: "" },

  // 🎒 등 (소비 칸 수)
  { id: "smallbag", name: "보조가방", slot: "back", tier: 1, consumableSlots: 2, maxHpBonus: 2, icon: "" },
  { id: "backpack", name: "등산배낭", slot: "back", tier: 2, consumableSlots: 3, maxHpBonus: 4, icon: "" },
  { id: "bigpack", name: "대형배낭", slot: "back", tier: 3, consumableSlots: 4, maxHpBonus: 6, icon: "" },

  // TODO(A): 머리(비니/등산모/헬멧), 손(장갑/등산스틱), 액세서리(나침반/곰방울/행운부적)
];

export const EQUIPMENT_BY_ID = Object.fromEntries(EQUIPMENT.map((e) => [e.id, e]));
