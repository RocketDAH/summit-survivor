// 장비 시스템 슬라이스 — 소유: A
// 책임: 슬롯별 장착, 파생 스탯 계산(최대HP 캡 120, 속도, 면제/경감, 소비 칸 수).
import {
  SliceCreator,
  EquipmentSlice,
  DerivedStats,
  HazardType,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";

export const createEquipmentSlice: SliceCreator<EquipmentSlice> = (set, get) => ({
  equipped: {},

  equip: (def) => {
    const before = get().getDerivedStats().maxHp;
    set((state) => ({ equipped: { ...state.equipped, [def.slot]: def } }));
    // 최대 HP가 늘면 현재 HP도 같은 양만큼 즉시 + (design.md §2)
    const after = get().getDerivedStats().maxHp;
    if (after > before) get().heal(after - before);
  },

  // 장착된 장비들을 접어 실효 스탯으로 — 핵심 로직(소유: A).
  getDerivedStats: (): DerivedStats => {
    const equipped = get().equipped;
    const stats: DerivedStats = {
      maxHp: C.START_HP,
      speed: C.BASE_SPEED,
      immunities: [],
      reductions: {},
      consumableSlots: C.DEFAULT_CONSUMABLE_SLOTS,
      lightningChance: 0,
    };
    for (const def of Object.values(equipped)) {
      if (!def) continue;
      stats.maxHp += def.maxHpBonus ?? 0;
      stats.speed += def.speedBonus ?? 0;
      stats.lightningChance += def.lightningChance ?? 0;
      if (def.consumableSlots) stats.consumableSlots = def.consumableSlots;
      if (def.immunities) stats.immunities.push(...def.immunities);
      if (def.reductions) {
        for (const [k, v] of Object.entries(def.reductions)) {
          const key = k as HazardType;
          stats.reductions[key] = Math.max(stats.reductions[key] ?? 0, v ?? 0);
        }
      }
    }
    stats.maxHp = Math.min(C.MAX_HP_CAP, stats.maxHp); // 하드 캡
    return stats;
  },

  resetEquipment: () => set({ equipped: {} }),
});
