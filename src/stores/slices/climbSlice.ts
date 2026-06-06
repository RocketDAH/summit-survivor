// 등반 코어 슬라이스 — 소유: A
// 책임: 고도 진행, HP 드레인, HP의 단일 소유자(damage/heal), 마스터 틱 오케스트레이션.
import {
  SliceCreator,
  ClimbSlice,
  REDESIGN_CONSTANTS as C,
  getDrainPerSecond,
} from "@/types/redesign";

export const createClimbSlice: SliceCreator<ClimbSlice> = (set, get) => ({
  altitude: 0,
  hp: C.START_HP,
  baseSpeed: C.BASE_SPEED,

  // 마스터 틱: 다른 슬라이스를 순서대로 호출한다.
  // 이 오케스트레이션 순서는 "계약"의 일부 — 바꾸려면 팀과 합의.
  tick: (dt) => {
    const s = get();
    if (s.status !== "playing" || s.isPaused) return;

    // 1) 위협: 기존 위협 진행 + 새 위협 발생 시도 (소유: A)
    s.tickHazards(dt);
    s.maybeSpawnHazard(dt);

    // 2) 활성 위협의 지속형 배수 합산
    let speedMul = 1;
    let drainMul = 1;
    for (const h of get().activeHazards) {
      if (h.def.speedMultiplier) speedMul *= h.def.speedMultiplier;
      if (h.def.drainMultiplier) drainMul *= h.def.drainMultiplier;
    }

    // 3) 고도 진행 (장비 파생 속도 × 위협 배수)
    const stats = get().getDerivedStats();
    const speed = stats.speed * speedMul;
    const altitude = Math.min(C.TARGET_ALTITUDE, get().altitude + speed * dt);

    // 4) HP 드레인 (고도 비례 × 위협 배수), maxHp로 상한
    const drain = getDrainPerSecond(altitude) * drainMul;
    const hp = Math.max(0, Math.min(stats.maxHp, get().hp - drain * dt));

    set({ altitude, hp });

    // 5) HP 낮으면 회복템 자동 사용 (소유: B)
    get().autoUseHeal();

    // 6) 마일스톤이면 빌드 선택 오픈(멈춤) (소유: B)
    get().maybeOpenChoice(altitude);

    // 7) 승패 판정 (소유: B)
    get().checkEnd();
  },

  // HP 변경의 단일 진입점 — 다른 슬라이스(위협/소비)는 이걸 통해서만 HP를 만진다.
  damage: (amount) => {
    set({ hp: Math.max(0, get().hp - Math.abs(amount)) });
  },
  heal: (amount) => {
    const maxHp = get().getDerivedStats().maxHp;
    set({ hp: Math.min(maxHp, get().hp + Math.abs(amount)) });
  },

  resetClimb: () => {
    set({ altitude: 0, hp: C.START_HP, baseSpeed: C.BASE_SPEED });
  },
});
