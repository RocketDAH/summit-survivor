// 소비 시스템 슬라이스 — 소유: B
// 책임: 자동 줍기(가방 제한), 자동 회복, 동물 위협 시 방어템 자동 소모.
import {
  SliceCreator,
  ConsumableSlice,
  ConsumableDef,
  HazardDef,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";

export const createConsumableSlice: SliceCreator<ConsumableSlice> = (set, get) => ({
  inventory: [],

  // 자동 줍기: 가방이 꽉 차면 가장 약한(power) 것을 자동 교체. (멈춤 없음)
  pickup: (def) => {
    const cap = get().getDerivedStats().consumableSlots;
    const inv = [...get().inventory];
    if (inv.length < cap) {
      set({ inventory: [...inv, def] });
      return;
    }
    // TODO(B): 교체 정책 — 지금은 "가장 약한 것"을 버림. 회복/방어 균형 고려 필요.
    let weakest = 0;
    for (let i = 1; i < inv.length; i++) {
      if ((inv[i].power ?? 0) < (inv[weakest].power ?? 0)) weakest = i;
    }
    if ((def.power ?? 0) > (inv[weakest].power ?? 0)) {
      inv[weakest] = def;
      set({ inventory: inv });
    }
  },

  // HP 낮을 때 climb.tick이 호출. (배관: 임계값 체크 / TODO: 어떤 회복템부터 쓸지)
  autoUseHeal: () => {
    const stats = get().getDerivedStats();
    if (get().hp > stats.maxHp * C.AUTO_HEAL_HP_RATIO) return;
    const idx = get().inventory.findIndex((c) =>
      c.effects.some((e) => e.type === "hp" && (e.value ?? 0) > 0)
    );
    if (idx < 0) return;
    const item = get().inventory[idx];
    // TODO(B): ItemEffect 전체 처리(buff/special 등). 지금은 hp 회복만.
    const healVal = item.effects
      .filter((e) => e.type === "hp")
      .reduce((a, e) => a + (e.value ?? 0), 0);
    if (healVal > 0) get().heal(healVal);
    set({ inventory: get().inventory.filter((_, i) => i !== idx) });
  },

  // 동물 위협 시 hazard가 호출 → 방어템 자동 소모, 남은 피해 배수(0~1) 반환.
  autoUseDefense: (_hazard: HazardDef) => {
    const idx = get().inventory.findIndex((c) => (c.counterAnimal ?? 0) > 0);
    if (idx < 0) return 1; // 방어템 없음 → 피해 100%
    const item = get().inventory[idx];
    set({ inventory: get().inventory.filter((_, i) => i !== idx) });
    // TODO(B): 위협 강도에 맞춰 강한 방어템 우선 소모(스프레이>호루라기). (design.md §4.3)
    return 1 - (item.counterAnimal ?? 0);
  },

  resetConsumables: () => set({ inventory: [] }),
});

export type { ConsumableDef };
