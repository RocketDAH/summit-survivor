"use client";

import { useGameStore } from "@/stores/gameStore";
import { useTimer } from "@/hooks/useTimer";
import { formatAltitude, calculatePercentage } from "@/lib/score";
import { getHpState } from "@/types/game";
import { getComboInfo } from "@/lib/combo";
import { MEME_GAME_CONSTANTS } from "@/types/meme-event";

export function StatusBar() {
  const hp = useGameStore((state) => state.hp);
  const maxHp = useGameStore((state) => state.maxHp);
  const altitude = useGameStore((state) => state.altitude);
  const targetAltitude = useGameStore((state) => state.targetAltitude);
  const combo = useGameStore((state) => state.combo);
  const useMemeSystem = useGameStore((state) => state.useMemeSystem);
  
  const { formattedTime, percentage: timerPercentage, isWarning, isCritical } = useTimer();

  // Use meme system max HP if enabled
  const effectiveMaxHp = useMemeSystem ? MEME_GAME_CONSTANTS.MAX_HP : maxHp;
  const hpPercentage = calculatePercentage(hp, effectiveMaxHp);
  const hpState = getHpState(hp, effectiveMaxHp);
  const altitudePercentage = calculatePercentage(altitude, targetAltitude);
  const nearSummit = altitudePercentage >= 90;
  const comboInfo = getComboInfo(combo);

  return (
    <div className="pixel-card pixel-card--panel pixel-mb-4">
      <div className="pixel-grid pixel-grid-cols-3 pixel-gap-4">
        {/* HP */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">❤️ HP</span>
            <span className={`pixel-text-number pixel-text-sm ${
              hpState === "critical" ? "pixel-text-negative pixel-animate-pulse-critical" :
              hpState === "low" ? "pixel-text-negative" :
              hpState === "medium" ? "pixel-text-accent" : "pixel-text-positive"
            }`}>
              {Math.floor(hp)}
            </span>
          </div>
          <div 
            className={`pixel-progress pixel-progress--hp ${hpState === "critical" ? "pixel-animate-pulse-critical" : ""}`}
            data-hp-state={hpState}
          >
            <div 
              className="pixel-progress__fill"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-justify-center pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">⏱️</span>
            <span className={`pixel-text-number pixel-text-lg ${
              isCritical ? "pixel-text-negative pixel-animate-pulse-critical" :
              isWarning ? "pixel-text-accent" : "pixel-text-primary"
            }`}>
              {formattedTime}
            </span>
          </div>
          <div 
            className="pixel-progress pixel-progress--timer"
            data-warning={isWarning}
            data-critical={isCritical}
          >
            <div 
              className="pixel-progress__fill"
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>

        {/* Altitude */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-justify-end pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">🏔️ 고도</span>
            <span className={`pixel-text-number pixel-text-sm ${nearSummit ? "pixel-text-accent" : "pixel-text-primary"}`}>
              {formatAltitude(altitude)}
            </span>
          </div>
          <div 
            className="pixel-progress pixel-progress--altitude"
            data-near-summit={nearSummit}
          >
            <div 
              className="pixel-progress__fill"
              style={{ width: `${altitudePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
