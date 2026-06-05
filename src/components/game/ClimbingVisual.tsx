"use client";

import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { calculatePercentage } from "@/lib/score";
import { getHpState } from "@/types/game";

export function ClimbingVisual() {
  const altitude = useGameStore((state) => state.altitude);
  const targetAltitude = useGameStore((state) => state.targetAltitude);
  const hp = useGameStore((state) => state.hp);
  const maxHp = useGameStore((state) => state.maxHp);

  const progress = calculatePercentage(altitude, targetAltitude);
  const hpState = getHpState(hp, maxHp);
  
  const climberPosition = useMemo(() => {
    return Math.min(85, progress * 0.85);
  }, [progress]);

  const mountainLayers = useMemo(() => {
    const layers = [];
    for (let i = 0; i < 5; i++) {
      layers.push({
        id: i,
        opacity: 0.3 + (i * 0.15),
        yOffset: 20 - (i * 4),
      });
    }
    return layers;
  }, []);

  return (
    <div 
      className="pixel-relative pixel-overflow-hidden pixel-mb-4"
      style={{
        height: "200px",
        background: "linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)",
        borderRadius: "var(--radius-md)",
        border: "2px solid var(--color-border)",
      }}
    >
      {/* Stars */}
      <div className="pixel-absolute pixel-inset-0" style={{ overflow: "hidden" }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="pixel-absolute"
            style={{
              width: "2px",
              height: "2px",
              backgroundColor: "var(--color-secondary)",
              opacity: 0.5 + Math.random() * 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Mountain layers */}
      {mountainLayers.map((layer) => (
        <div
          key={layer.id}
          className="pixel-absolute"
          style={{
            bottom: `${layer.yOffset}%`,
            left: "-10%",
            right: "-10%",
            height: "80%",
            opacity: layer.opacity,
          }}
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <polygon
              points="0,50 15,20 30,35 50,5 70,30 85,15 100,50"
              fill="var(--color-surface)"
            />
          </svg>
        </div>
      ))}

      {/* Snow caps */}
      <div
        className="pixel-absolute"
        style={{
          top: "10%",
          left: "45%",
          width: "20px",
          height: "15px",
          background: "var(--color-secondary)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          opacity: 0.9,
        }}
      />

      {/* Summit flag */}
      <div
        className="pixel-absolute pixel-flex pixel-flex-col pixel-items-center"
        style={{
          top: "8%",
          left: "48%",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "8px",
            backgroundColor: "var(--color-accent)",
            marginBottom: "-1px",
          }}
        />
        <div
          style={{
            width: "2px",
            height: "12px",
            backgroundColor: "var(--color-secondary)",
          }}
        />
      </div>

      {/* Altitude markers */}
      {[1000, 2000, 3000].map((marker) => (
        <div
          key={marker}
          className="pixel-absolute pixel-flex pixel-items-center"
          style={{
            right: "8px",
            bottom: `${(marker / targetAltitude) * 75 + 10}%`,
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

      {/* Climber */}
      <div
        className={`pixel-absolute pixel-transition-slow ${
          hpState === "critical" ? "pixel-animate-pulse-critical" : ""
        }`}
        style={{
          left: "20%",
          bottom: `${climberPosition + 5}%`,
          transform: "translateX(-50%)",
          transition: "bottom 0.3s ease-out",
        }}
      >
        {/* Climber body */}
        <div className="pixel-flex pixel-flex-col pixel-items-center">
          {/* Head */}
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#FFD5B5",
              borderRadius: "2px",
            }}
          />
          {/* Body */}
          <div
            style={{
              width: "10px",
              height: "12px",
              backgroundColor: hpState === "critical" ? "var(--color-negative)" : 
                             hpState === "low" ? "var(--color-hp-low)" :
                             "var(--color-positive)",
              marginTop: "-1px",
            }}
          />
          {/* Legs */}
          <div className="pixel-flex" style={{ marginTop: "-1px", gap: "2px" }}>
            <div
              style={{
                width: "4px",
                height: "6px",
                backgroundColor: "var(--color-primary-dark)",
              }}
            />
            <div
              style={{
                width: "4px",
                height: "6px",
                backgroundColor: "var(--color-primary-dark)",
              }}
            />
          </div>
          {/* Backpack */}
          <div
            className="pixel-absolute"
            style={{
              width: "6px",
              height: "8px",
              backgroundColor: "var(--color-random)",
              right: "-4px",
              top: "8px",
            }}
          />
        </div>
      </div>

      {/* Trail */}
      <div
        className="pixel-absolute"
        style={{
          left: "20%",
          bottom: "5%",
          width: "2px",
          height: `${climberPosition}%`,
          background: `linear-gradient(to top, transparent, var(--color-accent))`,
          opacity: 0.5,
        }}
      />

      {/* Current altitude display */}
      <div
        className="pixel-absolute pixel-text-center"
        style={{
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <span className="pixel-text-number pixel-text-lg pixel-text-accent pixel-text-shadow">
          {Math.floor(altitude).toLocaleString()}m
        </span>
      </div>
    </div>
  );
}
