// 소비 시스템 슬라이스 — 소유: B
// 책임: 자동 줍기(가방 제한), 자동 회복, 동물 위협 시 방어템 자동 소모.
// design.md §1.2(자동화 규칙) / §4.3(동물 자동 대응).
import {
  SliceCreator,
  ConsumableSlice,
  ConsumableDef,
  HazardDef,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";
import { healValueOf, isHeal, isAnimalDefense } from "@/data/redesign/consumables";

export const createConsumableSlice: SliceCreator<ConsumableSlice> = (set, get) => ({
  inventory: [],

  // 자동 줍기: 빈 칸이면 담고, 꽉 차면 "가장 약한(power) 것"과 교체. (멈춤 없음)
  // 단, 새 아이템이 기존 최약체보다 쓸모(power) 있을 때만 교체 → 다운그레이드 방지.
  pickup: (def) => {
    const cap = get().getDerivedStats().consumableSlots;
    const inv = [...get().inventory];
    if (inv.length < cap) {
      set({ inventory: [...inv, def] });
      return;
    }
    let weakest = 0;
    for (let i = 1; i < inv.length; i++) {
      if ((inv[i].power ?? 0) < (inv[weakest].power ?? 0)) weakest = i;
    }
    if ((def.power ?? 0) > (inv[weakest].power ?? 0)) {
      inv[weakest] = def;
      set({ inventory: inv });
    }
  },

  // HP 낮을 때 climb.tick이 매 틱 호출.
  // 정책: 임계값(40%) 이하로 떨어지면 "낭비 없이 채울 수 있는 가장 작은 회복템"을 사용.
  //   - 부족분(deficit)을 덮는 회복템 중 가장 작은 것(오버힐 최소화)
  //   - 부족분을 덮는 게 없으면 가장 큰 회복템(생존 우선)
  // HP가 늘 빠듯한 설계라 한 번에 한 개만 사용(다음 틱에 재평가).
  autoUseHeal: () => {
    const stats = get().getDerivedStats();
    const hp = get().hp;
    if (hp > stats.maxHp * C.AUTO_HEAL_HP_RATIO) return;

    const inv = get().inventory;
    const heals = inv
      .map((item, index) => ({ index, item, heal: healValueOf(item) }))
      .filter((h) => h.heal > 0);
    if (heals.length === 0) return;

    const deficit = stats.maxHp - hp;
    const sufficient = heals
      .filter((h) => h.heal >= deficit)
      .sort((a, b) => a.heal - b.heal); // 덮는 것 중 가장 작은 것
    const chosen = sufficient[0] ?? heals.sort((a, b) => b.heal - a.heal)[0]; // 없으면 가장 큰 것

    get().heal(chosen.heal);
    // NOTE: 응급키트의 remove_debuff 등은 리디자인에 버프/디버프 슬라이스가 생기면 처리.
    set({ inventory: inv.filter((_, i) => i !== chosen.index) });
  },

  // 동물 위협 시 hazardSlice 가 호출 → 방어템 자동 소모, 남은 피해 배수(0~1) 반환.
  // 정책(design.md §4.3): "피해가 큰 위협일수록 강한 방어템 우선".
  //   - 큰 위협(|hpDelta| ≥ 곰 수준 50): 가장 강한 방어템(스프레이) 우선
  //   - 작은 위협: 약한 방어템(호루라기)부터 소모해 강한 것을 아낌
  autoUseDefense: (hazard: HazardDef) => {
    const inv = get().inventory;
    const defenders = inv
      .map((item, index) => ({ index, item, counter: item.counterAnimal ?? 0 }))
      .filter((d) => d.counter > 0);
    if (defenders.length === 0) return 1; // 방어템 없음 → 피해 100%

    const heavy = Math.abs(hazard.hpDelta ?? 0) >= 50;
    defenders.sort((a, b) => (heavy ? b.counter - a.counter : a.counter - b.counter));
    const chosen = defenders[0];

    set({ inventory: inv.filter((_, i) => i !== chosen.index) });
    return 1 - chosen.counter; // counter=1 → 0(무효), 0.5 → 0.5(절반)
  },

  resetConsumables: () => set({ inventory: [] }),
});

export type { ConsumableDef };
// 데이터 헬퍼 재노출(소비 UI/정책에서 함께 쓰기 편하도록)
export { isHeal, isAnimalDefense };
