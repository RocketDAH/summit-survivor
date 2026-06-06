// 빌드 선택 카드 생성 — 소유: B
// design.md §5.1: 장비 80% / 스탯 20%, 3장 중 1택.
//   - 빈 슬롯 / 하위 티어 슬롯에 가중(항상 "쓸모 있는 업그레이드"가 뜨도록)
//   - 이미 T3로 채운 슬롯은 추첨 제외 → 빌드 정체 방지
//   - 같은 슬롯은 "다음 티어" 1장만 후보(교체 업그레이드)
//
// EQUIPMENT 데이터(소유: A)는 읽기 전용으로만 import 한다.
import { EQUIPMENT } from "@/data/redesign/equipment";
import { REDESIGN_CONSTANTS as C } from "@/types/redesign";
import type { ChoiceCard, DerivedStats, EquipmentDef, EquipSlot } from "@/types/redesign";

// 스탯 카드 제안값(design.md §5.1, 작게)
const STAT_HP = 5;
const STAT_SPEED = 3;
const EQUIPMENT_CHANCE = 0.8;

// 스탯 카드(즉시 최대HP/속도 +N)를 "영구"로 만들기 위한 운반 장비의 id.
// design.md §5.1 의 스탯 카드는 장비가 아니지만, 파생 스탯의 단일 소스는
// equipmentSlice.getDerivedStats(소유: A) 이고 그건 equipped 의 maxHpBonus/speedBonus 를
// 모두 합산한다. 그래서 누적 스탯 보너스를 accessory 슬롯의 "합성 장비"로 운반한다.
//   - B는 계약(choice.pickCard → equip(def))만 사용 → A 파일/계약 변경 없음.
//   - MVP에는 accessory 장비 데이터가 없어 슬롯 충돌 없음(§9: accessory는 2차).
//   - 점수/HUD는 이 id로 합성 장비를 식별해 제외/특수표시.
export const STAT_CARRIER_ID = "__stat_bonus";

const SLOT_EMOJI: Record<EquipSlot, string> = {
  head: "🧢",
  body: "🧥",
  feet: "🥾",
  hands: "🧤",
  back: "🎒",
  accessory: "🧿",
};

/** 장비 효과를 짧게 요약(카드 부제용) */
export function summarizeEquipment(def: EquipmentDef): string {
  const parts: string[] = [];
  if (def.maxHpBonus) parts.push(`최대HP +${def.maxHpBonus}`);
  if (def.speedBonus) parts.push(`속도 +${def.speedBonus}`);
  if (def.consumableSlots) parts.push(`소비 ${def.consumableSlots}칸`);
  if (def.immunities?.length) parts.push(`${def.immunities.map(hazardLabel).join("·")} 면제`);
  if (def.lightningChance) parts.push(`번개 위험↑`);
  return parts.join(", ");
}

function hazardLabel(type: string): string {
  const map: Record<string, string> = {
    rain: "비",
    rockfall: "낙석",
    ice: "빙판",
    cliff: "절벽",
    blizzard: "눈보라",
    cold: "추위",
    lightning: "번개",
  };
  return map[type] ?? type;
}

export function slotEmoji(slot: EquipSlot): string {
  return SLOT_EMOJI[slot];
}

/** 슬롯별 "다음 티어" 업그레이드 후보 + 가중치(빈/하위 슬롯 우선) */
function upgradeCandidates(
  equipped: Partial<Record<EquipSlot, EquipmentDef>>
): { def: EquipmentDef; weight: number }[] {
  const out: { def: EquipmentDef; weight: number }[] = [];
  const slots = Array.from(new Set(EQUIPMENT.map((e) => e.slot)));
  for (const slot of slots) {
    const currentTier = equipped[slot]?.tier ?? 0;
    if (currentTier >= 3) continue; // T3 = 천장 → 제외
    const next = EQUIPMENT.find((e) => e.slot === slot && e.tier === currentTier + 1);
    if (!next) continue;
    out.push({ def: next, weight: 3 - currentTier }); // 빈(0)→3, T1→2, T2→1
  }
  return out;
}

function weightedTake<T>(pool: { def: T; weight: number }[]): T | null {
  if (pool.length === 0) return null;
  const total = pool.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  let idx = 0;
  for (let i = 0; i < pool.length; i++) {
    r -= pool[i].weight;
    if (r <= 0) {
      idx = i;
      break;
    }
  }
  const picked = pool[idx].def;
  pool.splice(idx, 1); // 무복원 추출(카드 중복 방지)
  return picked;
}

function makeStatCard(preferSpeed: boolean): ChoiceCard {
  if (preferSpeed) {
    return { kind: "stat", label: `📈 가벼운 발놀림 (속도 +${STAT_SPEED})`, stat: { speed: STAT_SPEED } };
  }
  return { kind: "stat", label: `📈 체력 단련 (최대HP +${STAT_HP})`, stat: { maxHp: STAT_HP } };
}

function equipmentCard(def: EquipmentDef): ChoiceCard {
  const summary = summarizeEquipment(def);
  return {
    kind: "equipment",
    label: `${slotEmoji(def.slot)} ${def.name} (T${def.tier})${summary ? ` — ${summary}` : ""}`,
    equipment: def,
  };
}

/**
 * 3장 카드 생성.
 * @param equipped 현재 장착(소유: A의 equipmentSlice 상태)
 * @param stats    현재 파생 스탯(스탯 카드 종류 결정에 사용 — maxHp 캡이면 속도 우선)
 */
export function generateBuildCards(
  equipped: Partial<Record<EquipSlot, EquipmentDef>>,
  stats?: DerivedStats
): ChoiceCard[] {
  const pool = upgradeCandidates(equipped);
  const cards: ChoiceCard[] = [];
  const hpCapped = (stats?.maxHp ?? 0) >= C.MAX_HP_CAP;

  let statCount = 0;
  for (let i = 0; i < 3; i++) {
    const wantEquipment = Math.random() < EQUIPMENT_CHANCE && pool.length > 0;
    if (wantEquipment) {
      const def = weightedTake(pool);
      if (def) {
        cards.push(equipmentCard(def));
        continue;
      }
    }
    // 스탯 카드: maxHp 캡이면 속도, 아니면 hp/속도를 번갈아 제시(중복 방지)
    const preferSpeed = hpCapped || statCount % 2 === 1;
    cards.push(makeStatCard(preferSpeed));
    statCount++;
  }
  return cards;
}
