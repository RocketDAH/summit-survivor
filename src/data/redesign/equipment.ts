// 장비 데이터 — 소유: A
// design.md §3.2 의 티어 표를 그대로 옮긴다. 수치 변경 시 design.md §3.2 도 같이 수정.
//
// 면제(immunities) 인코딩 규칙:
//   resolveHazard(hazardSlice)는 "위협 h가 면제되려면 h.immuneIfHas 의 모든 슬롯 장비의
//   immunities 가 h.type 을 포함해야 한다" 로 판정한다(§7.1).
//   → 눈보라(blizzard)는 immuneIfHas: ["body","feet"] 이므로 body·feet 둘 다 "blizzard" 를
//     immunities 에 가져야 면제된다. design.md 의 "우비+아이젠 둘 다" 조합을 이 방식으로 표현:
//     비를 막는 몸통(우비/패딩)과 눈을 막는 발(아이젠)에 "blizzard" 태그를 함께 부여한다.
//     (업그레이드인 패딩이 우비보다 눈보라에 약해지지 않도록 패딩에도 동일 태그)
import type { EquipmentDef } from "@/types/redesign";

export const EQUIPMENT: EquipmentDef[] = [
  // 🧢 머리 (낙석/우박 면제·완화, 최대HP)
  { id: "beanie", name: "비니", slot: "head", tier: 1, maxHpBonus: 4, icon: "" },
  { id: "hikinghat", name: "등산모", slot: "head", tier: 2, maxHpBonus: 5, reductions: { rockfall: 0.5 }, icon: "" },
  { id: "helmet", name: "헬멧", slot: "head", tier: 3, maxHpBonus: 6, immunities: ["rockfall"], icon: "" },

  // 🧥 몸통 (비/추위 면제, 눈보라 조합)
  { id: "windbreaker", name: "바람막이", slot: "body", tier: 1, maxHpBonus: 6, icon: "" },
  { id: "raincoat", name: "우비", slot: "body", tier: 2, maxHpBonus: 4, immunities: ["rain", "blizzard"], icon: "" },
  { id: "padding", name: "패딩", slot: "body", tier: 3, maxHpBonus: 8, immunities: ["rain", "cold", "blizzard"], icon: "" },

  // 🥾 발 (눈/빙판 면제, 속도)
  { id: "sneakers", name: "운동화", slot: "feet", tier: 1, speedBonus: 3, icon: "" },
  { id: "boots", name: "등산화", slot: "feet", tier: 2, speedBonus: 5, immunities: ["ice"], icon: "" },
  { id: "crampons", name: "아이젠", slot: "feet", tier: 3, speedBonus: 8, immunities: ["ice", "blizzard"], lightningChance: 0.1, icon: "" },

  // 🧤 손 (속도, 절벽 완화)
  { id: "gloves", name: "장갑", slot: "hands", tier: 1, speedBonus: 2, maxHpBonus: 3, icon: "" },
  { id: "trekkingpole", name: "등산스틱", slot: "hands", tier: 2, speedBonus: 4, reductions: { cliff: 0.5 }, icon: "" },

  // 🎒 등 (소비 칸 수)
  { id: "smallbag", name: "보조가방", slot: "back", tier: 1, consumableSlots: 2, maxHpBonus: 2, icon: "" },
  { id: "backpack", name: "등산배낭", slot: "back", tier: 2, consumableSlots: 3, maxHpBonus: 4, icon: "" },
  { id: "bigpack", name: "대형배낭", slot: "back", tier: 3, consumableSlots: 4, maxHpBonus: 6, icon: "" },

  // TODO(A, 계약 변경 PR 필요): 액세서리(나침반/곰방울/행운부적).
  //   효과가 "위험 확률 -10% / 동물 조우 -50% / 환경 피해 1회 방어(쿨다운)" 라
  //   현재 EquipmentDef/DerivedStats 로 표현 불가 → types/redesign.ts 에 필드 추가가
  //   선행돼야 함(별도의 작은 "계약 변경" PR). MVP 슬롯(몸통/발/등)에는 영향 없음.
];

export const EQUIPMENT_BY_ID = Object.fromEntries(EQUIPMENT.map((e) => [e.id, e]));
