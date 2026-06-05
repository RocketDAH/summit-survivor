"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import { calculateScore, formatScore, formatAltitude, formatTime } from "@/lib/score";
import { GAME_CONSTANTS } from "@/types/game";

export function ResultScreen() {
  const status = useGameStore((state) => state.status);
  const resetGame = useGameStore((state) => state.resetGame);
  const hp = useGameStore((state) => state.hp);
  const maxHp = useGameStore((state) => state.maxHp);
  const altitude = useGameStore((state) => state.altitude);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const eventsCollected = useGameStore((state) => state.eventsCollected);
  const eventsSkipped = useGameStore((state) => state.eventsSkipped);
  const positiveItems = useGameStore((state) => state.positiveItems);
  const negativeItems = useGameStore((state) => state.negativeItems);
  const randomItems = useGameStore((state) => state.randomItems);

  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitRank, setSubmitRank] = useState<number | null>(null);

  const gameState = useGameStore.getState();
  
  const scoreBreakdown = useMemo(() => {
    return calculateScore(gameState);
  }, [status, hp, altitude, timeRemaining, positiveItems, randomItems]);

  const isVictory = status === "victory";
  const isDefeat = status === "defeat";

  const timeSpent = GAME_CONSTANTS.TOTAL_TIME - timeRemaining;

  const handleSubmitScore = useCallback(async () => {
    if (!playerName.trim() || isSubmitting || submitStatus === "success") return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score: scoreBreakdown.total,
          altitude: Math.floor(altitude),
          timeSpent: Math.floor(timeSpent),
          eventsCollected,
          victory: isVictory,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitStatus("success");
        setSubmitRank(data.data.rank);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [playerName, isSubmitting, submitStatus, scoreBreakdown.total, altitude, timeSpent, eventsCollected, isVictory]);

  if (!isVictory && !isDefeat) return null;

  return (
    <div className="pixel-modal-backdrop pixel-modal-backdrop--open">
      <div 
        className={`pixel-modal pixel-modal--result pixel-modal--md ${
          isVictory ? "pixel-animate-victory" : "pixel-animate-defeat-shake"
        }`}
        data-result={isVictory ? "victory" : "defeat"}
      >
        {/* Result Icon */}
        <div className="pixel-modal__result-icon">
          {isVictory ? "🏆" : "💀"}
        </div>

        {/* Result Title */}
        <h2 className={`pixel-modal__result-title pixel-text-display ${
          isVictory ? "pixel-modal__result-title--victory" : "pixel-modal__result-title--defeat"
        }`}>
          {isVictory ? "정상 정복!" : "등반 실패"}
        </h2>

        {/* Message */}
        <p className="pixel-text-korean pixel-text-lg pixel-text-secondary pixel-mb-4">
          {isVictory 
            ? "축하합니다! 히말라야 정상에 도달했습니다!" 
            : hp <= 0 
              ? "체력이 고갈되었습니다..." 
              : "시간이 다 되었습니다..."}
        </p>

        {/* Score */}
        <div className="pixel-modal__score">
          {formatScore(scoreBreakdown.total)}
        </div>
        <p className="pixel-text-sm pixel-text-secondary pixel-mb-4">SCORE</p>

        {/* Stats Grid */}
        <div className="pixel-modal__stats pixel-text-korean">
          <span className="pixel-modal__stat-label">도달 고도</span>
          <span className="pixel-modal__stat-value">{formatAltitude(altitude)}</span>
          
          <span className="pixel-modal__stat-label">소요 시간</span>
          <span className="pixel-modal__stat-value">{formatTime(timeSpent)}</span>
          
          <span className="pixel-modal__stat-label">남은 체력</span>
          <span className="pixel-modal__stat-value">{Math.floor(hp)} / {maxHp}</span>
          
          <span className="pixel-modal__stat-label">수집한 아이템</span>
          <span className="pixel-modal__stat-value">{eventsCollected}</span>
        </div>

        {/* Score Breakdown */}
        <div className="pixel-card pixel-card--panel pixel-mt-4 pixel-text-left">
          <p className="pixel-text-sm pixel-text-secondary pixel-mb-2">점수 상세</p>
          <div className="pixel-grid pixel-grid-cols-2 pixel-gap-2 pixel-text-sm">
            <span className="pixel-text-secondary">기본 점수:</span>
            <span className="pixel-text-number">{formatScore(scoreBreakdown.baseScore)}</span>
            
            {isVictory && (
              <>
                <span className="pixel-text-secondary">시간 보너스:</span>
                <span className="pixel-text-number pixel-text-positive">+{formatScore(scoreBreakdown.timeBonus)}</span>
              </>
            )}
            
            <span className="pixel-text-secondary">체력 보너스:</span>
            <span className="pixel-text-number pixel-text-positive">+{formatScore(scoreBreakdown.hpBonus)}</span>
            
            <span className="pixel-text-secondary">수집 보너스:</span>
            <span className="pixel-text-number pixel-text-positive">+{formatScore(scoreBreakdown.collectionBonus)}</span>
            
            {isVictory && (
              <>
                <span className="pixel-text-secondary">정복 보너스:</span>
                <span className="pixel-text-number pixel-text-accent">+{formatScore(scoreBreakdown.victoryBonus)}</span>
              </>
            )}
          </div>
        </div>

        {/* Item Stats */}
        <div className="pixel-flex pixel-gap-4 pixel-justify-center pixel-mt-4 pixel-text-sm">
          <span className="pixel-text-positive">✓ {positiveItems}</span>
          <span className="pixel-text-negative">✗ {negativeItems}</span>
          <span className="pixel-text-random">? {randomItems}</span>
          <span className="pixel-text-disabled">- {eventsSkipped}</span>
        </div>

        {/* Score Submission */}
        {submitStatus === "idle" && (
          <div className="pixel-card pixel-card--panel pixel-mt-4">
            <p className="pixel-text-sm pixel-text-secondary pixel-mb-2">리더보드에 등록</p>
            <div className="pixel-flex pixel-gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="이름 입력"
                maxLength={20}
                className="pixel-text-korean pixel-text-base pixel-p-2"
                style={{
                  flex: 1,
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text-primary)",
                  border: "2px solid var(--color-border)",
                  outline: "none",
                }}
                disabled={isSubmitting}
              />
              <button
                onClick={handleSubmitScore}
                disabled={!playerName.trim() || isSubmitting}
                className="pixel-btn pixel-btn--primary"
              >
                {isSubmitting ? "..." : "등록"}
              </button>
            </div>
          </div>
        )}

        {submitStatus === "success" && (
          <div className="pixel-card pixel-card--panel pixel-mt-4 pixel-text-center">
            <p className="pixel-text-korean pixel-text-positive pixel-text-lg">
              🎉 등록 완료! 순위: #{submitRank}
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="pixel-card pixel-card--panel pixel-mt-4 pixel-text-center">
            <p className="pixel-text-korean pixel-text-negative pixel-text-sm">
              등록에 실패했습니다. 오프라인 상태일 수 있습니다.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="pixel-modal__footer">
          <button
            onClick={resetGame}
            className="pixel-btn pixel-btn--accent pixel-btn--lg"
          >
            다시 도전
          </button>
          <Link href="/leaderboard" className="pixel-btn pixel-btn--secondary pixel-btn--lg">
            리더보드
          </Link>
        </div>
      </div>
    </div>
  );
}
