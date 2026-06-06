// 소비 데이터 — 소유: B (+ 데이터 채우기 분담 가능)
// design.md §4.1. effects 는 기존 ItemEffect 재사용.
// TODO: 에너지젤/호루라기/부적 등 추가. 수치 변경 시 design.md §4.1 도 같이 수정.
import type { ConsumableDef } from "@/types/redesign";

export const CONSUMABLES: ConsumableDef[] = [
  { id: "chocobar", name: "초코바", effects: [{ type: "hp", value: 20 }], power: 20, icon: "" },
  { id: "lunchbox", name: "도시락", effects: [{ type: "hp", value: 40 }], power: 40, icon: "" },
  { id: "bearspray", name: "곰 스프레이", effects: [], counterAnimal: 1, power: 50, icon: "" },
  {
    id: "firstaid",
    name: "응급키트",
    effects: [{ type: "hp", value: 60 }, { type: "remove_debuff", removeCount: "all" }],
    power: 60,
    icon: "",
  },

  // TODO(B): 에너지젤(속도), 호루라기(counterAnimal 0.5), 부적(blockEnvironment)
];

export const CONSUMABLES_BY_ID = Object.fromEntries(CONSUMABLES.map((c) => [c.id, c]));
