// 위협 데이터 — 소유: A
// design.md §4.2(환경) / §4.3(동물). 고도(minAltitude)로 에스컬레이션.
// 수치 변경 시 design.md §4 도 같이 수정(단일 진실원).
import type { HazardDef, HazardType } from "@/types/redesign";

export const HAZARDS: HazardDef[] = [
  // ── 환경 (장비로 면제) — immuneIfHas: 면제에 필요한 슬롯들 ──
  // 면제 판정은 "immuneIfHas 의 모든 슬롯 장비 immunities 가 type 포함" (resolveHazard, §7.1).
  { type: "rain", name: "비", minAltitude: 0, category: "environment", drainMultiplier: 2, speedMultiplier: 0.5, durationSec: 8, immuneIfHas: ["body"], icon: "" },
  { type: "rockfall", name: "낙석", minAltitude: 500, category: "environment", hpDelta: -15, immuneIfHas: ["head"], icon: "" },
  { type: "ice", name: "빙판", minAltitude: 1000, category: "environment", speedMultiplier: 0.5, durationSec: 6, immuneIfHas: ["feet"], icon: "" },
  { type: "cliff", name: "절벽", minAltitude: 1000, category: "environment", hpDelta: -20, immuneIfHas: [], icon: "" }, // 완전 면제 없음, 등산스틱 -50% 경감
  { type: "blizzard", name: "눈보라", minAltitude: 1000, category: "environment", drainMultiplier: 3, speedMultiplier: 0.5, durationSec: 8, immuneIfHas: ["body", "feet"], icon: "" },
  { type: "cold", name: "추위", minAltitude: 1500, category: "environment", drainMultiplier: 2, durationSec: 8, immuneIfHas: ["body"], icon: "" },
  { type: "lightning", name: "번개", minAltitude: 2000, category: "environment", hpDelta: -30, immuneIfHas: [], icon: "" }, // 장비 면제 불가(부적 소비로만, B) — 아이젠 장착 시 확률↑

  // ── 동물 (소비로 자동 대응) — autoUseDefense(B) 로 피해 배수 결정 ──
  { type: "snake", name: "뱀", minAltitude: 0, category: "animal", hpDelta: -20, immuneIfHas: [], icon: "" },
  { type: "boar", name: "멧돼지", minAltitude: 1000, category: "animal", hpDelta: -30, immuneIfHas: [], icon: "" },
  { type: "bear", name: "곰", minAltitude: 2000, category: "animal", hpDelta: -50, immuneIfHas: [], icon: "" },
];

// 출현 가중치(상대값). 고도 게이팅(minAltitude)으로 에스컬레이션, 가중치로 빈도 미세 조정.
// 번개는 기본 확률이 매우 낮고, 아이젠의 lightningChance 가 있을 때만 의미 있게 오른다.
const HAZARD_WEIGHT: Record<HazardType, number> = {
  rain: 3,
  rockfall: 2.5,
  ice: 2.5,
  cliff: 2,
  blizzard: 1.5,
  cold: 2,
  lightning: 0, // 아래 pickHazardForAltitude 에서 동적으로 부여
  snake: 2,
  boar: 2,
  bear: 1.5,
};

const LIGHTNING_BASE_WEIGHT = 0.3;

/** 현재 고도에서 출현 가능한 위협을 가중 추첨. hazardSlice.maybeSpawnHazard 에서 사용. */
export function pickHazardForAltitude(
  altitude: number,
  ctx?: { lightningChance?: number }
): HazardDef | null {
  const eligible = HAZARDS.filter((h) => altitude >= h.minAltitude);
  if (eligible.length === 0) return null;

  const lightningChance = ctx?.lightningChance ?? 0;
  const weights = eligible.map((h) =>
    h.type === "lightning"
      ? LIGHTNING_BASE_WEIGHT + lightningChance * 10
      : HAZARD_WEIGHT[h.type] ?? 1
  );

  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;

  let r = Math.random() * total;
  for (let i = 0; i < eligible.length; i++) {
    r -= weights[i];
    if (r <= 0) return eligible[i];
  }
  return eligible[eligible.length - 1];
}
