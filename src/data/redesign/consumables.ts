// 소비 데이터 — 소유: B
// design.md §4.1. effects 는 기존 ItemEffect 재사용.
// 수치 변경 시 design.md §4.1 도 같이 수정(단일 진실원).
//
// ⚠️ 현재 계약(types/redesign.ts)에서 소비가 "동작"하는 경로는 두 가지뿐:
//    1) hp 회복 effect  → consumableSlice.autoUseHeal 이 HP 임계값에서 자동 사용
//    2) counterAnimal   → hazardSlice 가 동물 위협에서 autoUseDefense 로 자동 소모
//    따라서 아래는 "지금 실제로 작동하는" 5종만 활성화한다.
//    에너지젤(속도 버프)·부적(환경 1회 방어)은 각각 버프 엔진/환경-방어 훅이
//    계약에 추가돼야 동작하므로 보류(맨 아래 TODO).
import type { ConsumableDef } from "@/types/redesign";

export const CONSUMABLES: ConsumableDef[] = [
  // 🍫 회복 (autoUseHeal 대상) — power ≈ 회복량
  { id: "chocobar", name: "초코바", effects: [{ type: "hp", value: 20 }], power: 20, icon: "🍫" },
  { id: "lunchbox", name: "도시락", effects: [{ type: "hp", value: 40 }], power: 40, icon: "🍱" },
  {
    id: "firstaid",
    name: "응급키트",
    effects: [{ type: "hp", value: 60 }, { type: "remove_debuff", removeCount: "all" }],
    power: 60,
    icon: "🧰",
  },

  // 🐻 동물 방어 (autoUseDefense 대상) — counterAnimal: 남은 피해 = ×(1-counterAnimal)
  { id: "whistle", name: "호루라기", effects: [], counterAnimal: 0.5, power: 25, icon: "📯" },
  { id: "bearspray", name: "곰 스프레이", effects: [], counterAnimal: 1, power: 50, icon: "🧴" },

  // TODO(B): 계약 확장 후 추가 (지금 넣으면 자동 사용 경로가 없어 슬롯만 차지함)
  //   - 에너지젤: 속도 +50% 10s  → 버프 엔진(소비→ActiveBuff) 연동 필요
  //   - 부적(소비): 다음 환경 피해 1회 방어 → hazard(환경)에서 소비 방어 훅 필요
];

export const CONSUMABLES_BY_ID = Object.fromEntries(CONSUMABLES.map((c) => [c.id, c]));

/** 회복 effect 합(양수)을 합산. autoUseHeal 의 회복템 판별/선택에 사용. */
export function healValueOf(def: ConsumableDef): number {
  return def.effects
    .filter((e) => e.type === "hp")
    .reduce((sum, e) => sum + (e.value ?? 0), 0);
}

/** 회복템 여부 */
export function isHeal(def: ConsumableDef): boolean {
  return healValueOf(def) > 0;
}

/** 동물 방어템 여부 */
export function isAnimalDefense(def: ConsumableDef): boolean {
  return (def.counterAnimal ?? 0) > 0;
}

// 자동 줍기용 가중치: HP가 늘 빠듯한 설계라 회복템을 조금 더 자주 등장(회복 2 : 방어 1).
const PICK_WEIGHT = (def: ConsumableDef): number => (isHeal(def) ? 2 : 1);

/** 200m 자동 줍기에서 등장할 소비 1개를 가중 랜덤으로 고른다. */
export function randomConsumable(): ConsumableDef {
  const total = CONSUMABLES.reduce((s, d) => s + PICK_WEIGHT(d), 0);
  let r = Math.random() * total;
  for (const def of CONSUMABLES) {
    r -= PICK_WEIGHT(def);
    if (r <= 0) return def;
  }
  return CONSUMABLES[CONSUMABLES.length - 1];
}
