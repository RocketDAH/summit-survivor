// 메타 슬라이스 — 소유: B
// 책임: 게임 상태(status)/점수/시작·리셋, 승패 판정.
import { SliceCreator, MetaSlice, REDESIGN_CONSTANTS as C } from "@/types/redesign";

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

  // TODO(B): design.md §6 점수 공식(고도/생존/속도/장비/무피해/정복).
  calcScore: () => {
    const altitudeScore = Math.floor(get().altitude);
    const stats = get().getDerivedStats();
    const survival = Math.floor((get().hp / stats.maxHp) * 1000);
    return altitudeScore + survival;
  },
});
