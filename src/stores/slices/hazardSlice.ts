// 위협 시스템 슬라이스 — 소유: A
// 책임: 위협 발생 타이밍, 환경/동물 분기, 면제 판정(resolveHazard), 피해 적용.
import {
  SliceCreator,
  HazardSlice,
  HazardDef,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";
import { pickHazardForAltitude } from "@/data/redesign/hazards";

function rollNextInterval(): number {
  const [min, max] = C.HAZARD_INTERVAL_S;
  return min + Math.random() * (max - min);
}

export const createHazardSlice: SliceCreator<HazardSlice> = (set, get) => {
  // 위협 해소 — design.md §4.2 / §7.1.
  //  환경: immuneIfHas 의 모든 슬롯이 type 면제를 제공하면 면제(피해 0).
  //        아니면 reductions 경감 후 즉시피해(hpDelta) 또는 지속형(activeHazards) 적용.
  //  동물: autoUseDefense(B)로 남은 피해 배수(0~1)를 받아 즉시피해에 곱한다.
  function resolveHazard(h: HazardDef): void {
    if (h.category === "environment") {
      const equipped = get().equipped;
      const covered =
        h.immuneIfHas.length > 0 &&
        h.immuneIfHas.every((slot) =>
          (equipped[slot]?.immunities ?? []).includes(h.type)
        );
      if (covered) {
        // 면제 — "✅ 장비 발동" 연출은 비주얼(B) 담당. 여기선 피해 없음.
        return;
      }
      const reduce = get().getDerivedStats().reductions[h.type] ?? 0;
      if (h.hpDelta) get().damage(Math.abs(h.hpDelta) * (1 - reduce));
      if (h.durationSec && (h.drainMultiplier || h.speedMultiplier)) {
        set({
          activeHazards: [
            ...get().activeHazards,
            { def: h, remaining: h.durationSec },
          ],
        });
      }
    } else {
      // 동물: 방어템 자동 소모(B) → 남은 피해 배수 적용
      const mult = get().autoUseDefense(h); // 0~1
      if (h.hpDelta) get().damage(Math.abs(h.hpDelta) * mult);
    }
  }

  return {
    activeHazards: [],
    timeSinceHazard: 0,
    nextHazardIn: rollNextInterval(),

    // 발생 타이밍 도달 시 현재 고도로 위협을 추첨해 즉시 해소.
    maybeSpawnHazard: (dt) => {
      const t = get().timeSinceHazard + dt;
      if (t < get().nextHazardIn) {
        set({ timeSinceHazard: t });
        return;
      }
      set({ timeSinceHazard: 0, nextHazardIn: rollNextInterval() });

      const stats = get().getDerivedStats();
      const hazard = pickHazardForAltitude(get().altitude, {
        lightningChance: stats.lightningChance,
      });
      if (hazard) resolveHazard(hazard);
    },

    // 지속형 위협 시간 감소 + 만료 제거
    tickHazards: (dt) => {
      const cur = get().activeHazards;
      if (cur.length === 0) return;
      const next = cur
        .map((h) => ({ ...h, remaining: h.remaining - dt }))
        .filter((h) => h.remaining > 0);
      set({ activeHazards: next });
    },

    resetHazards: () =>
      set({
        activeHazards: [],
        timeSinceHazard: 0,
        nextHazardIn: rollNextInterval(),
      }),
  };
};

export type { HazardDef };
