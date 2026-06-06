// 기능 플래그 — 신/구 시스템을 충돌 없이 병렬로 머지하기 위한 스위치.
// (기존 useMemeSystem 토글과 동일한 패턴)
//
// redesign 켜기:  .env.local 에  NEXT_PUBLIC_REDESIGN=1
// 기본값(미설정): 꺼짐 → 기존 게임 그대로 동작.

export const FEATURES = {
  redesign:
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_REDESIGN === "1",
} as const;
