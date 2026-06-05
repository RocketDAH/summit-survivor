"use client";

import { useGameStore } from "@/stores/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import { MainScreen } from "@/components/screens/MainScreen";
import { StatusBar } from "@/components/game/StatusBar";
import { ClimbingVisual } from "@/components/game/ClimbingVisual";
import { EventDisplay } from "@/components/game/EventDisplay";
import { ResultScreen } from "@/components/screens/ResultScreen";

export default function GamePage() {
  const status = useGameStore((state) => state.status);
  const hp = useGameStore((state) => state.hp);
  const altitude = useGameStore((state) => state.altitude);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  
  useGameLoop();

  // Debug info
  console.log("Game State:", { status, hp, altitude, timeRemaining });

  return (
    <main 
      className="pixel-min-h-screen pixel-flex-center pixel-p-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="pixel-w-full" style={{ maxWidth: "600px" }}>
        {status === "idle" && <MainScreen />}

        {status === "playing" && (
          <div className="pixel-flex pixel-flex-col">
            {/* Debug Info */}
            <div className="pixel-card pixel-card--panel pixel-mb-2 pixel-text-xs" style={{ background: "#000" }}>
              <span className="pixel-text-accent">DEBUG: </span>
              <span>HP: {hp.toFixed(1)} | </span>
              <span>고도: {altitude.toFixed(0)}m | </span>
              <span>시간: {timeRemaining.toFixed(1)}s</span>
            </div>
            <StatusBar />
            <ClimbingVisual />
            <EventDisplay />
          </div>
        )}

        {(status === "victory" || status === "defeat") && <ResultScreen />}
      </div>
    </main>
  );
}
