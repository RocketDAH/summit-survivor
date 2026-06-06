// 빌드 선택 화면 + 일시정지 슬라이스 — 소유: B
// 책임: 500m 마일스톤에서 게임을 멈추고 카드 3장 제시 → 선택 적용.
import {
  SliceCreator,
  ChoiceSlice,
  ChoiceCard,
  REDESIGN_CONSTANTS as C,
} from "@/types/redesign";

export const createChoiceSlice: SliceCreator<ChoiceSlice> = (set, get) => ({
  openChoice: null,
  isPaused: false,
  nextChoiceAltitude: C.CHOICE_INTERVAL_M, // 첫 마일스톤 500m

  // 마일스톤 도달 감지는 구현(배관). 카드 "생성"은 데이터/가중 로직 → TODO(B).
  maybeOpenChoice: (altitude) => {
    if (get().openChoice) return; // 이미 열려 있음
    if (altitude < get().nextChoiceAltitude) return;

    // TODO(B): data/redesign/equipment.ts 에서 빈 슬롯/하위 티어 우선 가중으로
    //   장비 80% / 스탯 20% 카드 3장 생성. (design.md §5.1)
    //   const cards = generateBuildCards(get().equipped, get().getDerivedStats());
    const cards: ChoiceCard[] = []; // 임시: 빈 배열 → UI는 "구현 예정" 표시

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
        // TODO(B): 스탯 카드 적용(최대HP/속도 즉시 증가). 캡/파생 반영 방식 합의 필요.
      }
    }
    set({ openChoice: null, isPaused: false }); // 선택 종료 → 게임 재개
  },

  resetChoice: () =>
    set({ openChoice: null, isPaused: false, nextChoiceAltitude: C.CHOICE_INTERVAL_M }),
});

export type { ChoiceCard };
