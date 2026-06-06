"use client";

import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { GAME_CONSTANTS } from "@/types/game";
import { MEME_GAME_CONSTANTS } from "@/types/meme-event";
import { getEventTimeRatio } from "@/lib/event-generator";
import { ItemCard } from "./ItemCard";
import { ComboIndicator } from "./ComboIndicator";

export function EventDisplay() {
  const currentEvent = useGameStore((state) => state.currentEvent);
  const currentDilemmaEvent = useGameStore((state) => state.currentDilemmaEvent);
  const useMemeSystem = useGameStore((state) => state.useMemeSystem);
  const selectEvent = useGameStore((state) => state.selectEvent);
  const skipEvent = useGameStore((state) => state.skipEvent);
  const selectDilemmaItem = useGameStore((state) => state.selectDilemmaItem);
  const status = useGameStore((state) => state.status);
  const lastEventResult = useGameStore((state) => state.lastEventResult);
  
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.EVENT_INTERVAL);
  const [dilemmaTimeRatio, setDilemmaTimeRatio] = useState<number>(1);
  const [isAppearing, setIsAppearing] = useState(false);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Legacy event timer
  useEffect(() => {
    if (useMemeSystem || !currentEvent || status !== "playing") {
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
  }, [currentEvent, status, useMemeSystem]);

  // Dilemma event timer
  useEffect(() => {
    if (!useMemeSystem || !currentDilemmaEvent || status !== "playing") {
      setDilemmaTimeRatio(1);
      return;
    }

    const interval = setInterval(() => {
      const ratio = getEventTimeRatio(currentDilemmaEvent);
      setDilemmaTimeRatio(ratio);
    }, 50);

    return () => clearInterval(interval);
  }, [currentDilemmaEvent, status, useMemeSystem]);

  // Handle event appearance animation
  useEffect(() => {
    const eventId = useMemeSystem ? currentDilemmaEvent?.id : currentEvent?.id;
    if (eventId) {
      setIsAppearing(true);
      const timer = setTimeout(() => setIsAppearing(false), 200);
      return () => clearTimeout(timer);
    }
  }, [currentEvent?.id, currentDilemmaEvent?.id, useMemeSystem]);

  // Show result animation
  useEffect(() => {
    if (lastEventResult) {
      setShowResult(true);
      const timer = setTimeout(() => setShowResult(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [lastEventResult]);

  // Keyboard shortcuts for dilemma
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!useMemeSystem || !currentDilemmaEvent || status !== "playing") return;
    
    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        selectDilemmaItem('left');
        break;
      case 'd':
      case 'arrowright':
        selectDilemmaItem('right');
        break;
      case 's':
      case 'arrowdown':
        if (currentDilemmaEvent.centerItem) {
          selectDilemmaItem('center');
        }
        break;
    }
  }, [useMemeSystem, currentDilemmaEvent, status, selectDilemmaItem]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (status !== "playing") return null;

  // Meme System: 2지선다/3지선다
  if (useMemeSystem) {
    if (!currentDilemmaEvent) {
      return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: "300px" }}>
          <div className="text-center text-gray-400">
            <p className="animate-pulse text-lg">다음 선택 대기중...</p>
          </div>
        </div>
      );
    }

    const { leftItem, rightItem, centerItem, isSpecial } = currentDilemmaEvent;
    const progress = dilemmaTimeRatio * 100;
    const isUrgent = progress < 30;

    return (
      <div className={`flex flex-col gap-4 p-4 ${isAppearing ? 'animate-fade-in' : ''}`} style={{ minHeight: "400px" }}>
        {/* Combo indicator */}
        <div className="flex justify-center">
          <ComboIndicator />
        </div>

        {/* Timer bar */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-50 ${
                isUrgent 
                  ? 'bg-red-500 animate-pulse' 
                  : isSpecial 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {isUrgent && (
            <p className="text-center text-red-400 text-sm mt-1 animate-pulse">
              시간 초과시 자동 선택!
            </p>
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className={`text-xl font-bold ${isSpecial ? 'text-yellow-400' : 'text-white'}`}>
            {isSpecial ? '⭐ 특별 선택 ⭐' : '선택하세요!'}
          </h2>
          {centerItem && (
            <p className="text-gray-400 text-sm">3가지 중 하나를 선택하세요</p>
          )}
        </div>

        {/* Item cards */}
        <div className={`grid gap-4 max-w-4xl mx-auto ${centerItem ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <ItemCard
            item={leftItem}
            position="left"
            onClick={() => selectDilemmaItem('left')}
          />
          
          {centerItem && (
            <ItemCard
              item={centerItem}
              position="center"
              onClick={() => selectDilemmaItem('center')}
            />
          )}
          
          <ItemCard
            item={rightItem}
            position="right"
            onClick={() => selectDilemmaItem('right')}
          />
        </div>

        {/* VS divider */}
        <div className="flex justify-center items-center gap-4 -mt-2">
          <span className="text-gray-500">A ←</span>
          <span className="text-2xl font-bold text-orange-500">VS</span>
          <span className="text-gray-500">→ D</span>
        </div>

        {/* Result toast */}
        {showResult && lastEventResult && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className={`
              px-6 py-4 rounded-lg shadow-2xl animate-bounce-in
              ${lastEventResult.selectionType === 'auto' ? 'bg-yellow-600' : 'bg-green-600'}
            `}>
              <p className="text-white font-bold text-lg">
                {lastEventResult.selectedItem.name}
                {lastEventResult.selectionType === 'auto' && ' (자동 선택)'}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                {lastEventResult.hpChange !== 0 && (
                  <span className={lastEventResult.hpChange > 0 ? 'text-green-200' : 'text-red-200'}>
                    HP {lastEventResult.hpChange > 0 ? '+' : ''}{lastEventResult.hpChange}
                  </span>
                )}
                {lastEventResult.altitudeChange !== 0 && (
                  <span className="text-blue-200">
                    고도 +{lastEventResult.altitudeChange}m
                  </span>
                )}
                {lastEventResult.comboMaintained && (
                  <span className="text-orange-200">
                    🔥 x{lastEventResult.newComboCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Legacy System
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
