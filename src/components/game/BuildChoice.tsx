"use client";

// 빌드 선택 오버레이 — 소유: B
// design.md §5.1: 게임이 멈추는 유일한 화면. 3장 중 1택.
import { useRedesignStore } from "@/stores/redesignStore";
import { slotEmoji, summarizeEquipment } from "@/lib/buildCards";
import type { ChoiceCard } from "@/types/redesign";

function CardFace({ card }: { card: ChoiceCard }) {
  if (card.kind === "equipment" && card.equipment) {
    const def = card.equipment;
    return (
      <>
        <div className="pixel-text-2xl pixel-mb-2">{def.icon || slotEmoji(def.slot)}</div>
        <div className="pixel-text-korean pixel-text-base pixel-text-primary">
          {def.name} <span className="pixel-text-xs pixel-text-secondary">T{def.tier}</span>
        </div>
        <div className="pixel-text-xs pixel-text-secondary pixel-mt-2">{summarizeEquipment(def)}</div>
      </>
    );
  }
  // 스탯 카드
  const isSpeed = card.stat?.speed != null;
  return (
    <>
      <div className="pixel-text-2xl pixel-mb-2">📈</div>
      <div className="pixel-text-korean pixel-text-base pixel-text-primary">
        {isSpeed ? "가벼운 발놀림" : "체력 단련"}
      </div>
      <div className="pixel-text-xs pixel-text-secondary pixel-mt-2">
        {isSpeed ? `속도 +${card.stat?.speed}` : `최대HP +${card.stat?.maxHp}`}
      </div>
    </>
  );
}

export function BuildChoice() {
  const openChoice = useRedesignStore((s) => s.openChoice);
  const isPaused = useRedesignStore((s) => s.isPaused);
  const pickCard = useRedesignStore((s) => s.pickCard);

  if (!isPaused || !openChoice) return null;

  return (
    <div
      className="pixel-modal-backdrop pixel-modal-backdrop--open pixel-flex pixel-items-center pixel-justify-center"
      style={{ position: "fixed", inset: 0, zIndex: 50, padding: "1rem" }}
    >
      <div className="pixel-modal pixel-modal--md" style={{ maxWidth: 560, width: "100%" }}>
        <div className="pixel-text-center pixel-mb-4">
          <p className="pixel-text-korean pixel-text-accent pixel-text-lg">🛡 장비 선택</p>
          <p className="pixel-text-xs pixel-text-secondary">하나를 골라 빌드를 쌓으세요</p>
        </div>

        {openChoice.length === 0 ? (
          <p className="pixel-text-center pixel-text-secondary pixel-text-sm">
            (모든 슬롯이 천장 — 표시할 카드가 없습니다)
          </p>
        ) : (
          <div className="pixel-grid pixel-grid-cols-3 pixel-gap-4">
            {openChoice.map((card, i) => (
              <button
                key={i}
                onClick={() => pickCard(i)}
                className="pixel-card pixel-card--item pixel-card--clickable pixel-text-center"
                style={{ minHeight: 140, cursor: "pointer" }}
              >
                <CardFace card={card} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
