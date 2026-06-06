// 메타 슬라이스 — 소유: B
// 책임: 게임 상태(status)/점수/시작·리셋, 승패 판정, 점수 공식(design.md §6).
import { SliceCreator, MetaSlice, REDESIGN_CONSTANTS as C } from "@/types/redesign";
import { STAT_CARRIER_ID } from "@/lib/buildCards";

export const createMetaSlice: SliceCreator<MetaSlice> = (set, get) => ({
  status: "idle",
  score: 0,
  startTime: null,
  endTime: null,

  startGame: () => {
    get().resetGame();
    set({ status: "playing", startTime: Date.now() });
  },

  // 모든 슬라이스의 reset을 호출 — 새 슬라이스 추가 시 여기 한 줄 추가.
  resetGame: () => {
    get().resetClimb();
    get().resetEquipment();
    get().resetHazards();
    get().resetConsumables();
    get().resetChoice();
    set({ status: "idle", score: 0, startTime: null, endTime: null });
  },

  checkEnd: () => {
    if (get().status !== "playing") return;
    if (get().altitude >= C.TARGET_ALTITUDE) {
      set({ status: "victory", endTime: Date.now(), score: get().calcScore() });
    } else if (get().hp <= 0) {
      set({ status: "defeat", endTime: Date.now(), score: get().calcScore() });
    }
  },

  // design.md §6 점수 공식.
  //   총점 = 고도 + 생존 + 속도(승리) + 장비 + 정복(승리)
  // (무피해보너스는 hazardSlice(A)의 무피해 카운트가 계약에 추가되면 합산 — TODO)
  calcScore: () => {
    const altitude = get().altitude;
    const stats = get().getDerivedStats();
    const isVictory = altitude >= C.TARGET_ALTITUDE;

    // 고도점수: 도달 고도(m) × 1
    const altitudeScore = Math.floor(altitude);

    // 생존보너스: floor(HP / 최대HP × 1000)
    const survivalBonus = Math.floor((get().hp / stats.maxHp) * 1000);

    // 장비보너스: 장착 장비 티어 합 × 50 (합성 스탯 운반 장비는 제외)
    const tierSum = Object.values(get().equipped)
      .filter((def) => def && def.id !== STAT_CARRIER_ID)
      .reduce((sum, def) => sum + (def?.tier ?? 0), 0);
    const equipmentBonus = tierSum * 50;

    // 속도보너스(승리 시): max(0, 300 − 클리어초) × 10
    let speedBonus = 0;
    let conquerBonus = 0;
    if (isVictory) {
      const start = get().startTime;
      const clearSeconds = start ? (Date.now() - start) / 1000 : 300;
      speedBonus = Math.max(0, Math.floor(300 - clearSeconds)) * 10;
      conquerBonus = 1000; // 정복보너스
    }

    return altitudeScore + survivalBonus + equipmentBonus + speedBonus + conquerBonus;
  },
});
