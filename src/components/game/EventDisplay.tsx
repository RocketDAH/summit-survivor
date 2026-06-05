"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { GAME_CONSTANTS } from "@/types/game";

export function EventDisplay() {
  const currentEvent = useGameStore((state) => state.currentEvent);
  const selectEvent = useGameStore((state) => state.selectEvent);
  const skipEvent = useGameStore((state) => state.skipEvent);
  const status = useGameStore((state) => state.status);
  
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.EVENT_INTERVAL);
  const [isAppearing, setIsAppearing] = useState(false);
  const [isDisappearing, setIsDisappearing] = useState(false);

  // Update countdown timer
  useEffect(() => {
    if (!currentEvent || status !== "playing") {
      setTimeLeft(GAME_CONSTANTS.EVENT_INTERVAL);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, (currentEvent.expiresAt - Date.now()) / 1000);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setIsDisappearing(true);
        setTimeout(() => {
          setIsDisappearing(false);
        }, 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentEvent, status]);

  // Handle event appearance animation
  useEffect(() => {
    if (currentEvent) {
      setIsAppearing(true);
      const timer = setTimeout(() => setIsAppearing(false), 200);
      return () => clearTimeout(timer);
    }
  }, [currentEvent?.id]);

  if (status !== "playing") return null;

  if (!currentEvent) {
    return (
      <div className="pixel-flex-center pixel-min-h-screen pixel-p-4" style={{ minHeight: "200px" }}>
        <div className="pixel-text-center pixel-text-secondary pixel-text-body">
          <p className="pixel-animate-bounce">다음 이벤트 대기중...</p>
        </div>
      </div>
    );
  }

  const { item } = currentEvent;
  const progress = (timeLeft / GAME_CONSTANTS.EVENT_INTERVAL) * 100;

  const handleSelect = () => {
    setIsDisappearing(true);
    setTimeout(() => {
      selectEvent();
      setIsDisappearing(false);
    }, 100);
  };

  const handleSkip = () => {
    setIsDisappearing(true);
    setTimeout(() => {
      skipEvent();
      setIsDisappearing(false);
    }, 100);
  };

  return (
    <div className="pixel-flex-center pixel-flex-col pixel-gap-4 pixel-p-4" style={{ minHeight: "300px" }}>
      {/* Event Timer */}
      <div className="pixel-w-full" style={{ maxWidth: "300px" }}>
        <div className="pixel-progress pixel-progress--sm">
          <div 
            className="pixel-progress__fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: progress < 30 ? "var(--color-hp-low)" : "var(--color-primary-light)",
              transition: "width 0.05s linear"
            }}
          />
        </div>
      </div>

      {/* Item Card */}
      <div
        className={`pixel-card pixel-card--item ${
          isAppearing ? "pixel-animate-appear" : ""
        } ${
          isDisappearing ? "pixel-animate-disappear" : ""
        }`}
        data-type={item.type}
        onClick={handleSelect}
      >
        <div className="pixel-card__icon pixel-text-3xl">
          {item.type === "positive" ? "✨" : item.type === "negative" ? "⚠️" : "❓"}
        </div>
        <div className="pixel-card__name pixel-text-korean">
          {item.name}
        </div>
        <div className={`pixel-card__effect pixel-text-number ${
          item.effect >= 0 ? "pixel-card__effect--positive" : "pixel-card__effect--negative"
        }`}>
          {item.effect >= 0 ? `+${item.effect}` : item.effect} HP
        </div>
        <div className="pixel-text-xs pixel-text-secondary pixel-mt-2">
          {item.description}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pixel-flex pixel-gap-4">
        <button
          onClick={handleSelect}
          className="pixel-btn pixel-btn--primary"
        >
          선택
        </button>
        <button
          onClick={handleSkip}
          className="pixel-btn pixel-btn--ghost"
        >
          무시
        </button>
      </div>
    </div>
  );
}
