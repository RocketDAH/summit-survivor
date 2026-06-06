"use client";

// 리디자인 마운트 지점(스텁) — 소유: B
// Phase 0 검증용: 플래그가 켜졌을 때 슬라이스 스토어가 end-to-end로 도는지 확인.
// 실제 화면(빌드 선택 카드, 페이퍼돌 등)은 여기서부터 채워나갑니다.
import { useEffect, useRef } from "react";
import { useRedesignStore } from "@/stores/redesignStore";

export function RedesignGame() {
  const status = useRedesignStore((s) => s.status);
  const altitude = useRedesignStore((s) => s.altitude);
  const hp = useRedesignStore((s) => s.hp);
  const isPaused = useRedesignStore((s) => s.isPaused);
  const startGame = useRedesignStore((s) => s.startGame);
  const tick = useRedesignStore((s) => s.tick);
  const maxHp = useRedesignStore((s) => s.getDerivedStats().maxHp);

  // 임시 게임 루프 (실제로는 useGameLoop 재사용/확장 예정 — 소유: A)
  const raf = useRef<number>();
  const last = useRef<number>();
  useEffect(() => {
    if (status !== "playing") return;
    const loop = (t: number) => {
      if (last.current != null) tick((t - last.current) / 1000);
      last.current = t;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = undefined;
    };
  }, [status, tick]);

  return (
    <main className="w-full min-h-screen p-4 max-w-[600px] mx-auto">
      <div className="pixel-card pixel-card--panel pixel-text-center">
        <p className="pixel-text-korean pixel-text-accent pixel-text-lg">
          🧗 장비 생존 리디자인 (WIP)
        </p>
        <p className="pixel-text-xs" style={{ opacity: 0.7 }}>
          Phase 0 골격 — design.md 기반 구현 중
        </p>

        <div className="pixel-mt-4 pixel-text-number">
          <div>상태: {status}{isPaused ? " (멈춤)" : ""}</div>
          <div>고도: {Math.floor(altitude)} / 3000 m</div>
          <div>HP: {Math.floor(hp)} / {maxHp}</div>
        </div>

        {status === "idle" && (
          <button onClick={startGame} className="pixel-btn pixel-btn--accent pixel-btn--lg pixel-mt-4">
            시작
          </button>
        )}
        {status === "victory" && <p className="pixel-mt-4 pixel-text-positive">🏆 정상 정복!</p>}
        {status === "defeat" && <p className="pixel-mt-4 pixel-text-negative">💀 탈진…</p>}
      </div>
    </main>
  );
}
