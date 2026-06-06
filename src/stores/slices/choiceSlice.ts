// 빌드 선택 화면 + 일시정지 슬라이스 — 소유: B
// 책임: 500m 마일스톤에서 게임을 멈추고 카드 3장 제시 → 선택 적용.
import {
  SliceCreator,
  ChoiceSlice,
  ChoiceCard,
  EquipmentDef,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";
import { generateBuildCards, STAT_CARRIER_ID } from "@/lib/buildCards";

export const createChoiceSlice: SliceCreator<ChoiceSlice> = (set, get) => ({
  openChoice: null,
  isPaused: false,
  nextChoiceAltitude: C.CHOICE_INTERVAL_M, // 첫 마일스톤 500m

  // 마일스톤 도달 시 카드 3장 생성 후 게임 멈춤.
  maybeOpenChoice: (altitude) => {
    if (get().openChoice) return; // 이미 열려 있음
    if (altitude < get().nextChoiceAltitude) return;

    // 빈 슬롯/하위 티어 가중으로 장비 80% / 스탯 20% 3장 생성 (design.md §5.1)
    const cards = generateBuildCards(get().equipped, get().getDerivedStats());

    set({
      openChoice: cards,
      isPaused: true, // 게임이 멈추는 유일한 지점
      nextChoiceAltitude: get().nextChoiceAltitude + C.CHOICE_INTERVAL_M,
    });
  },

  pickCard: (index) => {
    const cards = get().openChoice;
    if (!cards) return;
    const card = cards[index];
    if (card) {
      if (card.kind === "equipment" && card.equipment) {
        get().equip(card.equipment); // 장비 적용은 equipmentSlice 계약 사용
      } else if (card.kind === "stat" && card.stat) {
        // 스탯 카드(최대HP/속도 +N)를 누적해 accessory 슬롯의 합성 장비로 운반한다.
        // getDerivedStats(소유: A)가 equipped 의 maxHpBonus/speedBonus 를 합산하므로
        // equip() 한 번으로 영구 반영(최대HP 증가 시 현재HP도 자동 +).
        // 근거: lib/buildCards.ts 의 STAT_CARRIER_ID 주석.
        const existing = get().equipped.accessory;
        const base = existing?.id === STAT_CARRIER_ID ? existing : undefined;
        const carrier: EquipmentDef = {
          id: STAT_CARRIER_ID,
          name: "스탯 보너스",
          slot: "accessory",
          tier: 1, // 점수의 장비보너스에서는 id로 제외
          maxHpBonus: (base?.maxHpBonus ?? 0) + (card.stat.maxHp ?? 0),
          speedBonus: (base?.speedBonus ?? 0) + (card.stat.speed ?? 0),
          icon: "📈",
        };
        get().equip(carrier);
      }
    }
    set({ openChoice: null, isPaused: false }); // 선택 종료 → 게임 재개
  },

  resetChoice: () =>
    set({ openChoice: null, isPaused: false, nextChoiceAltitude: C.CHOICE_INTERVAL_M }),
});

export type { ChoiceCard };
