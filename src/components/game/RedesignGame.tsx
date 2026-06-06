"use client";

// 리디자인 게임 화면 — 소유: B
// idle(시작) / playing(등반+HUD+빌드선택) / 결과(승·패) 를 조립한다.
// 임시 rAF 루프는 유지(실제 게임 루프 통합은 A와 협의 — implementation-plan §7).
import { useEffect, useRef } from "react";
import { useRedesignStore } from "@/stores/redesignStore";
import { REDESIGN_CONSTANTS as C } from "@/types/redesign";
import { randomConsumable } from "@/data/redesign/consumables";
import { RedesignHud } from "./RedesignHud";
import { RedesignClimbingVisual } from "./RedesignClimbingVisual";
import { BuildChoice } from "./BuildChoice";

// 소비 자동 줍기(200m마다, 1000·2000·3000m 제외 — design.md §1.2.1).
// 계약상 tick(소유: A)은 소비 등장을 호출하지 않으므로, B 영역(이 루프)에서 구동한다.
function maybePickupAt(altitude: number, nextRef: { current: number }) {
  const store = useRedesignStore.getState();
  while (altitude >= nextRef.current && nextRef.current < C.TARGET_ALTITUDE) {
    const m = nextRef.current;
    nextRef.current += C.CONSUMABLE_INTERVAL_M;
    if (m % 1000 === 0) continue; // 장비/정상 구간과 겹치면 소비 생략
    store.pickup(randomConsumable());
  }
}

function useRedesignLoop() {
  const status = useRedesignStore((s) => s.status);
  const isPaused = useRedesignStore((s) => s.isPaused);
  const tick = useRedesignStore((s) => s.tick);
  const raf = useRef<number>();
  const last = useRef<number>();
  const nextPickup = useRef<number>(C.CONSUMABLE_INTERVAL_M);

  useEffect(() => {
    if (status !== "playing") return;
    nextPickup.current = C.CONSUMABLE_INTERVAL_M; // 새 런마다 초기화
    const loop = (t: number) => {
      if (last.current != null) {
        const dt = (t - last.current) / 1000;
        // 큰 프레임 점프(탭 비활성 등) 방지로 dt 클램프
        if (!isPaused) {
          tick(Math.min(dt, 0.1));
          maybePickupAt(useRedesignStore.getState().altitude, nextPickup);
        }
      }
      last.current = t;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = undefined;
    };
    // isPaused 변화 시 last 리셋되도록 의존성 포함(멈춤 후 재개 시 dt 폭주 방지)
  }, [status, isPaused, tick]);
}

export function RedesignGame() {
  const status = useRedesignStore((s) => s.status);
  const score = useRedesignStore((s) => s.score);
  const startGame = useRedesignStore((s) => s.startGame);
  useRedesignLoop();

  return (
    <main className="w-full min-h-screen p-4 max-w-[600px] mx-auto">
      {status === "idle" && (
        <div className="pixel-card pixel-card--panel pixel-text-center">
          <p className="pixel-text-korean pixel-text-accent pixel-text-2xl pixel-mb-2">🏔️ 장비 생존</p>
          <p className="pixel-text-xs pixel-text-secondary pixel-mb-4">
            장비로 빌드를 쌓고, 환경 위협을 버티며 3000m 정상을 노려라.
          </p>
          <button onClick={startGame} className="pixel-btn pixel-btn--accent pixel-btn--lg">
            등반 시작
          </button>
        </div>
      )}

      {status === "playing" && (
        <>
          <RedesignHud />
          <RedesignClimbingVisual />
          <BuildChoice />
        </>
      )}

      {(status === "victory" || status === "defeat") && (
        <div className="pixel-card pixel-card--result pixel-text-center">
          {status === "victory" ? (
            <p className="pixel-text-korean pixel-text-positive pixel-text-2xl pixel-mb-2">🏆 정상 정복!</p>
          ) : (
            <p className="pixel-text-korean pixel-text-negative pixel-text-2xl pixel-mb-2">💀 탈진…</p>
          )}
          <p className="pixel-text-number pixel-text-lg pixel-text-accent pixel-mb-4">
            점수 {score.toLocaleString()}
          </p>
          <button onClick={startGame} className="pixel-btn pixel-btn--accent pixel-btn--lg">
            다시 도전
          </button>
        </div>
      )}
    </main>
  );
}
