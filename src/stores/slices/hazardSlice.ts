// 위협 시스템 슬라이스 — 소유: A
// 책임: 위협 발생 타이밍, 환경/동물 분기, 면제 판정, 피해 적용.
import {
  SliceCreator,
  HazardSlice,
  HazardDef,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";

function rollNextInterval(): number {
  const [min, max] = C.HAZARD_INTERVAL_S;
  return min + Math.random() * (max - min);
}

export const createHazardSlice: SliceCreator<HazardSlice> = (set, get) => ({
  activeHazards: [],
  timeSinceHazard: 0,
  nextHazardIn: rollNextInterval(),

  // 발생 타이밍은 구현(배관). 위협 "선택/적용"은 데이터 표가 필요 → TODO(A).
  maybeSpawnHazard: (dt) => {
    const t = get().timeSinceHazard + dt;
    if (t < get().nextHazardIn) {
      set({ timeSinceHazard: t });
      return;
    }
    set({ timeSinceHazard: 0, nextHazardIn: rollNextInterval() });

    // TODO(A): data/redesign/hazards.ts 에서 현재 고도(get().altitude)로
    //   출현 가능한 위협을 골라 아래 resolve 흐름으로 적용.
    //   const hazard = pickHazardForAltitude(get().altitude);
    //   if (hazard) get().resolveHazard(hazard);
  },

  // 지속형 위협 시간 감소 + 만료 제거 (배관 구현 완료)
  tickHazards: (dt) => {
    const next = get()
      .activeHazards.map((h) => ({ ...h, remaining: h.remaining - dt }))
      .filter((h) => h.remaining > 0);
    if (next.length !== get().activeHazards.length) set({ activeHazards: next });
    else if (get().activeHazards.length) set({ activeHazards: next });
  },

  resetHazards: () =>
    set({ activeHazards: [], timeSinceHazard: 0, nextHazardIn: rollNextInterval() }),
});

// ---------------------------------------------------------------------------
// TODO(A): 아래는 resolveHazard 의 레퍼런스 흐름. 슬라이스 액션으로 옮기거나
//   여기 헬퍼로 두고 maybeSpawnHazard 에서 호출하세요. (design.md §4.2 / §7.1)
//
//   환경: immuneIfHas 의 모든 슬롯이 type 면제를 제공하면 blocked.
//         아니면 reductions 적용 후 (hpDelta 즉시피해) 또는 (지속형 activeHazards 추가).
//   동물: get().autoUseDefense(hazard) 로 남은 피해배수 받아 get().damage() 적용.
//
//   function applyHazard(store, h: HazardDef) {
//     if (h.category === 'environment') {
//       const stats = store.getDerivedStats();
//       const covered = h.immuneIfHas.every(slot =>
//         (store.equipped[slot]?.immunities ?? []).includes(h.type));
//       if (covered) return; // 면제 — "✅ 장비 발동" 연출
//       const reduce = stats.reductions[h.type] ?? 0;
//       if (h.hpDelta) store.damage(Math.abs(h.hpDelta) * (1 - reduce));
//       if (h.durationSec) store.set/activeHazards.push({ def: h, remaining: h.durationSec });
//     } else {
//       const mult = store.autoUseDefense(h);       // 0~1
//       if (h.hpDelta) store.damage(Math.abs(h.hpDelta) * mult);
//     }
//   }
// ---------------------------------------------------------------------------
export type { HazardDef };
