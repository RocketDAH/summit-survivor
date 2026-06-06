// 위협 데이터 — 소유: A (+ 데이터 채우기 분담 가능)
// design.md §4.2(환경) / §4.3(동물). 고도(minAltitude)로 에스컬레이션.
// TODO: 절벽/추위/번개/뱀/멧돼지 등 추가. 수치 변경 시 design.md §4 도 같이 수정.
import type { HazardDef } from "@/types/redesign";

export const HAZARDS: HazardDef[] = [
  // 환경 (장비로 면제) — immuneIfHas: 면제에 필요한 슬롯들
  { type: "rain", name: "비", minAltitude: 0, category: "environment", drainMultiplier: 2, speedMultiplier: 0.5, durationSec: 8, immuneIfHas: ["body"], icon: "" },
  { type: "rockfall", name: "낙석", minAltitude: 500, category: "environment", hpDelta: -15, immuneIfHas: ["head"], icon: "" },
  { type: "ice", name: "빙판", minAltitude: 1000, category: "environment", speedMultiplier: 0.5, durationSec: 6, immuneIfHas: ["feet"], icon: "" },
  { type: "blizzard", name: "눈보라", minAltitude: 1000, category: "environment", drainMultiplier: 3, speedMultiplier: 0.5, durationSec: 8, immuneIfHas: ["body", "feet"], icon: "" },

  // 동물 (소비로 대응)
  { type: "bear", name: "곰", minAltitude: 2000, category: "animal", hpDelta: -50, immuneIfHas: [], icon: "" },

  // TODO(A): 절벽(cliff), 추위(cold), 번개(lightning), 뱀(snake), 멧돼지(boar)
];

/** TODO(A): 현재 고도로 출현 가능한 위협을 가중 추첨. hazardSlice.maybeSpawnHazard 에서 사용. */
export function pickHazardForAltitude(altitude: number): HazardDef | null {
  const eligible = HAZARDS.filter((h) => altitude >= h.minAltitude);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}
