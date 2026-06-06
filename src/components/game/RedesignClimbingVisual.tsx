"use client";

// 리디자인 등반 비주얼 — 소유: B
// 기존 ClimbingVisual(레거시 스토어 바인딩)을 건드리지 않고, redesignStore 에 맞춘 별도 버전.
// design.md §1.3: 캐릭터가 오르고, 장비가 보이고(페이퍼돌 아이콘), 위협 면제가 연출된다.
import { useEffect, useMemo, useState } from "react";
import { useRedesignStore } from "@/stores/redesignStore";
import { REDESIGN_CONSTANTS as C } from "@/types/redesign";
import { SLOT_ORDER, SLOT_EMOJI, HAZARD_EMOJI } from "@/lib/redesignIcons";
import { STAT_CARRIER_ID } from "@/lib/buildCards";

const SPRITES = {
  climberIdle: "/assets/kenney/character/climber-idle.png",
  climberWalk: "/assets/kenney/character/climber-walk.png",
  snowGround: "/assets/kenney/tiles/snow-ground.png",
  pine: "/assets/kenney/tiles/pine.png",
  flag: "/assets/kenney/tiles/flag.png",
};

function Sprite({ src, size, className, style }: { src: string; size: number; className?: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={`pixelated ${className ?? ""}`} style={{ width: size, height: size, ...style }} draggable={false} />;
}

export function RedesignClimbingVisual() {
  const altitude = useRedesignStore((s) => s.altitude);
  const hp = useRedesignStore((s) => s.hp);
  const status = useRedesignStore((s) => s.status);
  const isPaused = useRedesignStore((s) => s.isPaused);
  const equipped = useRedesignStore((s) => s.equipped);
  const activeHazards = useRedesignStore((s) => s.activeHazards);
  const maxHp = useRedesignStore((s) => s.getDerivedStats().maxHp);

  const progress = Math.max(0, Math.min(100, (altitude / C.TARGET_ALTITUDE) * 100));
  const critical = hp / maxHp <= 0.25;
  const climberBottom = useMemo(() => 8 + progress * 0.78, [progress]);

  const [walkFrame, setWalkFrame] = useState(false);
  useEffect(() => {
    if (status !== "playing" || isPaused) return;
    const id = setInterval(() => setWalkFrame((f) => !f), 220);
    return () => clearInterval(id);
  }, [status, isPaused]);
  const climberSrc = status === "playing" && !isPaused && walkFrame ? SPRITES.climberWalk : SPRITES.climberIdle;

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

  // 캐릭터에 보이는 장비 아이콘(페이퍼돌 최소 버전: 옆에 오버레이)
  const wornIcons = SLOT_ORDER.map((slot) => {
    const def = equipped[slot];
    if (!def || def.id === STAT_CARRIER_ID) return null;
    return def.icon || SLOT_EMOJI[slot];
  }).filter(Boolean) as string[];

  return (
    <div
      className="pixel-relative pixel-overflow-hidden pixel-mb-4"
      style={{
        height: "220px",
        background: "linear-gradient(180deg, #1a2740 0%, #3b5a82 45%, #7fa9c7 80%, #cfe6f0 100%)",
        borderRadius: "var(--radius-md)",
        border: "2px solid var(--color-border)",
      }}
    >
      {/* 별 */}
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

      {/* 산 실루엣 */}
      <div className="pixel-absolute" style={{ bottom: 0, left: 0, right: 0, height: "78%" }}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <polygon points="0,50 18,18 32,30 52,6 72,26 88,14 100,50" fill="#5b6b87" opacity="0.5" />
          <polygon points="0,50 24,26 44,34 60,16 78,30 100,22 100,50" fill="#6f7e99" opacity="0.7" />
          <polygon points="52,6 46,14 58,14" fill="#eaf4fb" />
          <polygon points="18,18 13,26 24,26" fill="#eaf4fb" />
        </svg>
      </div>

      {pines.map((p, i) => (
        <Sprite key={i} src={SPRITES.pine} size={p.size} className="pixel-absolute" style={{ left: `${p.left}%`, bottom: `${p.bottom}%`, opacity: 0.85 }} />
      ))}

      {/* 눈 바닥 타일 */}
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

      <Sprite src={SPRITES.flag} size={24} className="pixel-absolute" style={{ top: "6%", left: "49%" }} />

      {/* 고도 마커 */}
      {[1000, 2000, 3000].map((marker) => (
        <div
          key={marker}
          className="pixel-absolute pixel-flex pixel-items-center"
          style={{ right: "8px", bottom: `${(marker / C.TARGET_ALTITUDE) * 72 + 10}%`, opacity: altitude >= marker - 200 ? 1 : 0.4 }}
        >
          <span className="pixel-text-number pixel-text-xs" style={{ color: altitude >= marker ? "var(--color-accent)" : "var(--color-text-secondary)" }}>
            {marker}m
          </span>
          <div style={{ width: "20px", height: "1px", backgroundColor: altitude >= marker ? "var(--color-accent)" : "var(--color-border)", marginLeft: "4px" }} />
        </div>
      ))}

      {/* 활성 위협 배너 */}
      {activeHazards.length > 0 && (
        <div className="pixel-absolute pixel-text-center" style={{ top: "6px", left: "8px" }}>
          {activeHazards.map((h, i) => (
            <span key={i} className="pixel-text-lg pixel-animate-pulse-critical" style={{ marginRight: 4 }} title={h.def.name}>
              {h.def.icon || HAZARD_EMOJI[h.def.type]}
            </span>
          ))}
        </div>
      )}

      {/* 클라이머 + 장비 오버레이 */}
      <div
        className={`pixel-absolute ${critical ? "pixel-animate-pulse-critical" : ""}`}
        style={{
          left: "22%",
          bottom: `${climberBottom}%`,
          transform: "translateX(-50%)",
          transition: "bottom 0.3s ease-out",
          filter: critical ? "drop-shadow(0 0 4px var(--color-negative))" : "drop-shadow(0 1px 1px rgba(0,0,0,0.4))",
        }}
      >
        <Sprite src={climberSrc} size={44} />
        {wornIcons.length > 0 && (
          <div
            className="pixel-absolute pixel-flex"
            style={{ bottom: "100%", left: "50%", transform: "translateX(-50%)", gap: 1, whiteSpace: "nowrap" }}
          >
            {wornIcons.map((ic, i) => (
              <span key={i} style={{ fontSize: 10, lineHeight: 1 }}>
                {ic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 현재 고도 */}
      <div className="pixel-absolute pixel-text-center" style={{ bottom: "26px", left: "50%", transform: "translateX(-50%)" }}>
        <span className="pixel-text-number pixel-text-lg pixel-text-accent pixel-text-shadow">{Math.floor(altitude).toLocaleString()}m</span>
      </div>
    </div>
  );
}
