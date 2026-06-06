"use client";

// 리디자인 HUD — 소유: B
// HP 바 / 속도 미터 / 고도 게이지 + 장착 장비(페이퍼돌 아이콘) + 소비 인벤토리 + 활성 위협.
// "성장 체감"(design.md §1.3): 스탯 바가 자라고, 장비가 보인다.
import { useRedesignStore } from "@/stores/redesignStore";
import { REDESIGN_CONSTANTS as C } from "@/types/redesign";
import { SLOT_EMOJI, SLOT_LABEL, SLOT_ORDER, HAZARD_EMOJI } from "@/lib/redesignIcons";
import { STAT_CARRIER_ID } from "@/lib/buildCards";

const pct = (v: number, max: number) => Math.max(0, Math.min(100, (v / max) * 100));

export function RedesignHud() {
  const hp = useRedesignStore((s) => s.hp);
  const altitude = useRedesignStore((s) => s.altitude);
  const equipped = useRedesignStore((s) => s.equipped);
  const inventory = useRedesignStore((s) => s.inventory);
  const activeHazards = useRedesignStore((s) => s.activeHazards);
  const stats = useRedesignStore((s) => s.getDerivedStats());

  const hpRatio = hp / stats.maxHp;
  const hpState = hpRatio <= 0.25 ? "critical" : hpRatio <= 0.5 ? "low" : "ok";

  return (
    <div className="pixel-card pixel-card--panel pixel-mb-4">
      {/* 스탯 바 3종 */}
      <div className="pixel-grid pixel-grid-cols-3 pixel-gap-4 pixel-mb-3">
        {/* HP */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">❤️ HP</span>
            <span
              className={`pixel-text-number pixel-text-sm ${
                hpState === "critical"
                  ? "pixel-text-negative pixel-animate-pulse-critical"
                  : hpState === "low"
                    ? "pixel-text-negative"
                    : "pixel-text-positive"
              }`}
            >
              {Math.floor(hp)}/{stats.maxHp}
            </span>
          </div>
          <div
            className={`pixel-progress pixel-progress--hp ${hpState === "critical" ? "pixel-animate-pulse-critical" : ""}`}
            data-hp-state={hpState}
          >
            <div className="pixel-progress__fill" style={{ width: `${pct(hp, stats.maxHp)}%` }} />
          </div>
        </div>

        {/* 속도 */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-justify-center pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">🏃 속도</span>
            <span className="pixel-text-number pixel-text-sm pixel-text-primary">
              {stats.speed.toFixed(0)}
            </span>
          </div>
          <div className="pixel-progress pixel-progress--timer">
            {/* 기본 25 → 최대 ~35 구간을 0~100%로 */}
            <div
              className="pixel-progress__fill"
              style={{ width: `${pct(stats.speed - C.BASE_SPEED, 35 - C.BASE_SPEED)}%` }}
            />
          </div>
        </div>

        {/* 고도 */}
        <div>
          <div className="pixel-flex pixel-items-center pixel-justify-end pixel-gap-2 pixel-mb-2">
            <span className="pixel-text-sm pixel-text-secondary">🏔️ 고도</span>
            <span className="pixel-text-number pixel-text-sm pixel-text-accent">
              {Math.floor(altitude)}m
            </span>
          </div>
          <div className="pixel-progress pixel-progress--altitude">
            <div
              className="pixel-progress__fill"
              style={{ width: `${pct(altitude, C.TARGET_ALTITUDE)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 장착 장비(페이퍼돌 아이콘) */}
      <div className="pixel-flex pixel-items-center pixel-gap-2 pixel-mb-2" style={{ flexWrap: "wrap" }}>
        <span className="pixel-text-xs pixel-text-secondary">장비</span>
        {SLOT_ORDER.map((slot) => {
          const def = equipped[slot];
          const isStat = def?.id === STAT_CARRIER_ID;
          const filled = !!def;
          return (
            <span
              key={slot}
              title={def ? `${SLOT_LABEL[slot]}: ${def.name} (T${def.tier})` : `${SLOT_LABEL[slot]} 비어있음`}
              className="pixel-text-sm"
              style={{
                opacity: filled ? 1 : 0.25,
                filter: filled ? "none" : "grayscale(1)",
              }}
            >
              {isStat ? "📈" : def?.icon || SLOT_EMOJI[slot]}
              {def && !isStat ? <sub className="pixel-text-xs">{def.tier}</sub> : null}
            </span>
          );
        })}
      </div>

      {/* 소비 인벤토리 */}
      <div className="pixel-flex pixel-items-center pixel-gap-2 pixel-mb-2" style={{ flexWrap: "wrap" }}>
        <span className="pixel-text-xs pixel-text-secondary">
          가방 {inventory.length}/{stats.consumableSlots}
        </span>
        {Array.from({ length: stats.consumableSlots }).map((_, i) => {
          const item = inventory[i];
          return (
            <span
              key={i}
              title={item ? item.name : "빈 칸"}
              className="pixel-text-sm"
              style={{ opacity: item ? 1 : 0.25 }}
            >
              {item ? item.icon || "📦" : "▫️"}
            </span>
          );
        })}
      </div>

      {/* 활성 위협(있을 때만) */}
      {activeHazards.length > 0 && (
        <div className="pixel-flex pixel-items-center pixel-gap-2" style={{ flexWrap: "wrap" }}>
          <span className="pixel-text-xs pixel-text-negative">위협</span>
          {activeHazards.map((h, i) => (
            <span
              key={i}
              title={`${h.def.name} (${h.remaining.toFixed(1)}s)`}
              className="pixel-text-sm pixel-animate-pulse-critical"
            >
              {h.def.icon || HAZARD_EMOJI[h.def.type]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
