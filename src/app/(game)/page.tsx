"use client";

import { useGameStore } from "@/stores/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import { MainScreen } from "@/components/screens/MainScreen";
import { StatusBar } from "@/components/game/StatusBar";
import { EventDisplay } from "@/components/game/EventDisplay";
import { ResultScreen } from "@/components/screens/ResultScreen";

export default function GamePage() {
  const status = useGameStore((state) => state.status);
  
  // Initialize game loop
  useGameLoop();

  return (
    <main className="pixel-w-full pixel-min-h-screen pixel-p-4" style={{ maxWidth: "600px" }}>
      {/* Idle Screen */}
      {status === "idle" && <MainScreen />}

      {/* Playing Screen */}
      {status === "playing" && (
        <div className="pixel-flex pixel-flex-col">
          <StatusBar />
          <EventDisplay />
        </div>
      )}

      {/* Result Screen (Modal Overlay) */}
      {(status === "victory" || status === "defeat") && <ResultScreen />}
    </main>
  );
}
