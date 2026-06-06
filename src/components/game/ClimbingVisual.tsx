"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { calculatePercentage } from "@/lib/score";
import { getHpState } from "@/types/game";

// Kenney "Pixel Platformer" (CC0) sprite paths — see public/assets/kenney/LICENSE-*.txt
const SPRITES = {
  climberIdle: "/assets/kenney/character/climber-idle.png",
  climberWalk: "/assets/kenney/character/climber-walk.png",
  snowGround: "/assets/kenney/tiles/snow-ground.png",
  pine: "/assets/kenney/tiles/pine.png",
  flag: "/assets/kenney/tiles/flag.png",
  gem: "/assets/kenney/tiles/gem.png",
};

// Pixel sprite <img> with crisp scaling
function Sprite({
  src,
  size,
  className,
  style,
}: {
  src: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`pixelated ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
      draggable={false}
    />
  );
}

export function ClimbingVisual() {
  const altitude = useGameStore((state) => state.altitude);
  const targetAltitude = useGameStore((state) => state.targetAltitude);
  const hp = useGameStore((state) => state.hp);
  const maxHp = useGameStore((state) => state.maxHp);
  const status = useGameStore((state) => state.status);

  const progress = calculatePercentage(altitude, targetAltitude);
  const hpState = getHpState(hp, maxHp);

  // Climber rises from 8% to 86% as altitude approaches the summit
  const climberBottom = useMemo(() => 8 + progress * 0.78, [progress]);

  // Two-frame walk animation while playing
  const [walkFrame, setWalkFrame] = useState(false);
  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setWalkFrame((f) => !f), 220);
    return () => clearInterval(id);
  }, [status]);
  const climberSrc =
    status === "playing" && walkFrame ? SPRITES.climberWalk : SPRITES.climberIdle;

  // Decorative pine trees scattered up the slope (deterministic, no per-render jitter)
  const pines = useMemo(
    () => [
      { left: 12, bottom: 6, size: 22 },
      { left: 72, bottom: 10, size: 26 },
      { left: 34, bottom: 30, size: 18 },
      { left: 82, bottom: 44, size: 20 },
      { left: 18, bottom: 58, size: 16 },
    ],
    []
  );

  return (
    <div
      className="pixel-relative pixel-overflow-hidden pixel-mb-4"
      style={{
        height: "200px",
        background:
          "linear-gradient(180deg, #1a2740 0%, #3b5a82 45%, #7fa9c7 80%, #cfe6f0 100%)",
        borderRadius: "var(--radius-md)",
        border: "2px solid var(--color-border)",
      }}
    >
      {/* Stars (upper sky only) */}
      <div className="pixel-absolute pixel-inset-0" style={{ overflow: "hidden" }}>
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="pixel-absolute"
            style={{
              width: "2px",
              height: "2px",
              backgroundColor: "#ffffff",
              opacity: 0.4 + (i % 5) * 0.12,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 38}%`,
            }}
          />
        ))}
      </div>

      {/* Snowy mountain silhouette */}
      <div
        className="pixel-absolute"
        style={{ bottom: 0, left: 0, right: 0, height: "78%" }}
      >
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <polygon points="0,50 18,18 32,30 52,6 72,26 88,14 100,50" fill="#5b6b87" opacity="0.5" />
          <polygon points="0,50 24,26 44,34 60,16 78,30 100,22 100,50" fill="#6f7e99" opacity="0.7" />
          {/* snow caps */}
          <polygon points="52,6 46,14 58,14" fill="#eaf4fb" />
          <polygon points="18,18 13,26 24,26" fill="#eaf4fb" />
        </svg>
      </div>

      {/* Decorative pines */}
      {pines.map((p, i) => (
        <Sprite
          key={i}
          src={SPRITES.pine}
          size={p.size}
          className="pixel-absolute"
          style={{ left: `${p.left}%`, bottom: `${p.bottom}%`, opacity: 0.85 }}
        />
      ))}

      {/* Ground line of snow tiles */}
      <div
        className="pixel-absolute"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: "22px",
          backgroundImage: `url(${SPRITES.snowGround})`,
          backgroundSize: "22px 22px",
          backgroundRepeat: "repeat-x",
          imageRendering: "pixelated",
        }}
      />

      {/* Summit flag */}
      <Sprite
        src={SPRITES.flag}
        size={24}
        className="pixel-absolute"
        style={{ top: "6%", left: "49%" }}
      />

      {/* Altitude markers */}
      {[1000, 2000, 3000].map((marker) => (
        <div
          key={marker}
          className="pixel-absolute pixel-flex pixel-items-center"
          style={{
            right: "8px",
            bottom: `${(marker / targetAltitude) * 72 + 10}%`,
            opacity: altitude >= marker - 200 ? 1 : 0.4,
          }}
        >
          <span
            className="pixel-text-number pixel-text-xs"
            style={{
              color: altitude >= marker ? "var(--color-accent)" : "var(--color-text-secondary)",
            }}
          >
            {marker}m
          </span>
          <div
            style={{
              width: "20px",
              height: "1px",
              backgroundColor: altitude >= marker ? "var(--color-accent)" : "var(--color-border)",
              marginLeft: "4px",
            }}
          />
        </div>
      ))}

      {/* Climber sprite */}
      <div
        className={`pixel-absolute ${hpState === "critical" ? "pixel-animate-pulse-critical" : ""}`}
        style={{
          left: "22%",
          bottom: `${climberBottom}%`,
          transform: "translateX(-50%)",
          transition: "bottom 0.3s ease-out",
          filter:
            hpState === "critical"
              ? "drop-shadow(0 0 4px var(--color-negative))"
              : "drop-shadow(0 1px 1px rgba(0,0,0,0.4))",
        }}
      >
        <Sprite src={climberSrc} size={40} />
      </div>

      {/* Current altitude display */}
      <div
        className="pixel-absolute pixel-text-center"
        style={{ bottom: "26px", left: "50%", transform: "translateX(-50%)" }}
      >
        <span className="pixel-text-number pixel-text-lg pixel-text-accent pixel-text-shadow">
          {Math.floor(altitude).toLocaleString()}m
        </span>
      </div>
    </div>
  );
}
