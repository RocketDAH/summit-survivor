"use client";

import { useGameStore } from "@/stores/gameStore";

export function MainScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const status = useGameStore((state) => state.status);

  if (status !== "idle") return null;

  return (
    <div className="pixel-flex-center pixel-flex-col pixel-gap-6 pixel-min-h-screen pixel-p-4">
      {/* Title */}
      <div className="pixel-text-center">
        <h1 className="pixel-text-display pixel-text-2xl pixel-text-accent pixel-text-shadow pixel-mb-4">
          정상까지
        </h1>
        <p className="pixel-text-korean pixel-text-lg pixel-text-secondary pixel-mb-2">
          Summit Survivor
        </p>
        <p className="pixel-text-body pixel-text-base pixel-text-secondary">
          히말라야 3,000m 정상을 향한 생존 등반
        </p>
      </div>

      {/* Game Info */}
      <div className="pixel-card pixel-card--panel pixel-text-center" style={{ maxWidth: "400px" }}>
        <div className="pixel-text-korean pixel-text-base pixel-text-secondary pixel-mb-4">
          <p className="pixel-mb-2">⏱️ 제한시간: 2분</p>
          <p className="pixel-mb-2">❤️ 체력을 관리하며 등반하세요</p>
          <p>🎯 아이템을 선택하거나 피하세요</p>
        </div>
        
        <div className="pixel-flex pixel-gap-4 pixel-justify-center pixel-mt-4">
          <div className="pixel-text-center">
            <span className="pixel-text-positive">✓</span>
            <p className="pixel-text-sm pixel-text-secondary">긍정 아이템</p>
            <p className="pixel-text-xs pixel-text-positive">HP 회복</p>
          </div>
          <div className="pixel-text-center">
            <span className="pixel-text-negative">✗</span>
            <p className="pixel-text-sm pixel-text-secondary">부정 아이템</p>
            <p className="pixel-text-xs pixel-text-negative">HP 감소</p>
          </div>
          <div className="pixel-text-center">
            <span className="pixel-text-random">?</span>
            <p className="pixel-text-sm pixel-text-secondary">랜덤 아이템</p>
            <p className="pixel-text-xs pixel-text-random">운에 맡기기</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startGame}
        className="pixel-btn pixel-btn--accent pixel-btn--lg pixel-hover-glow"
      >
        🏔️ 등반 시작
      </button>

      {/* Footer */}
      <p className="pixel-text-body pixel-text-sm pixel-text-disabled">
        클릭 또는 터치로 아이템을 선택하세요
      </p>
    </div>
  );
}
