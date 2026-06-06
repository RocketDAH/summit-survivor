"use client";

// 리디자인 전용 게임 루프 — 소유: A
// 레거시 useGameLoop 은 gameStore(구 시스템)에 묶여 있어 재사용하지 않고 분리한다.
// climbSlice.tick 이 위협/소비/선택/승패를 오케스트레이션하므로 여기선 dt 만 공급.
//
// 사용: RedesignGame 등 마운트 컴포넌트에서 useRedesignLoop() 한 번 호출(소유: B).
//   getState() 구독이라 스토어 변경으로 인한 리렌더는 발생하지 않는다.
import { useEffect, useRef } from "react";
import { useRedesignStore } from "@/stores/redesignStore";

// 탭 백그라운드 복귀 등으로 프레임 간격이 크게 벌어졌을 때 한 틱에 큰 점프가
// 생기지 않도록 dt 를 클램프(초). 100ms = 약 6프레임.
const MAX_DT = 0.1;

export function useRedesignLoop() {
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const loop = (t: number) => {
      const s = useRedesignStore.getState();
      if (s.status === "playing" && !s.isPaused) {
        const dt = lastRef.current != null ? (t - lastRef.current) / 1000 : 0;
        if (dt > 0) s.tick(Math.min(dt, MAX_DT));
      }
      // 멈춤/대기 중에도 last 를 갱신해 재개 시 dt 가 튀지 않게 한다.
      lastRef.current = t;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, []);
}
