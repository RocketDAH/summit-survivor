"use client";

import { useGameStore } from "@/stores/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import { MainScreen } from "@/components/screens/MainScreen";
import { StatusBar } from "@/components/game/StatusBar";
import { ClimbingVisual } from "@/components/game/ClimbingVisual";
import { EventDisplay } from "@/components/game/EventDisplay";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { BuffSidebar, BuffSidebarCompact } from "@/components/game/BuffSidebar";
import { ComboIndicatorCompact } from "@/components/game/ComboIndicator";
import { FEATURES } from "@/lib/featureFlags";
import { RedesignGame } from "@/components/game/RedesignGame";

export default function GamePage() {
  // 리디자인 플래그가 켜지면 새 시스템으로 분기 (기본값 꺼짐 → 기존 게임 그대로)
  if (FEATURES.redesign) {
    return <RedesignGame />;
  }
  return <LegacyGamePage />;
}

function LegacyGamePage() {
  const status = useGameStore((state) => state.status);
  const useMemeSystem = useGameStore((state) => state.useMemeSystem);

  // Initialize game loop
  useGameLoop();

  return (
    <main className="w-full min-h-screen p-4">
      {/* Idle Screen */}
      {status === "idle" && (
        <div className="max-w-[600px] mx-auto">
          <MainScreen />
        </div>
      )}

      {/* Playing Screen */}
      {status === "playing" && (
        <div className="flex gap-4 max-w-[1200px] mx-auto">
          {/* Main Game Area */}
          <div className="flex-1 flex flex-col" style={{ maxWidth: useMemeSystem ? "800px" : "600px" }}>
            <StatusBar />
            
            {/* Mobile buff/combo indicators */}
            {useMemeSystem && (
              <div className="md:hidden flex items-center justify-between px-4 py-2 bg-gray-800/50 rounded-lg mb-2">
                <ComboIndicatorCompact />
                <BuffSidebarCompact />
              </div>
            )}

            <ClimbingVisual />
            <EventDisplay />
          </div>
          
          {/* Buff Sidebar - Desktop only */}
          {useMemeSystem && (
            <div className="hidden md:block">
              <BuffSidebar />
            </div>
          )}
        </div>
      )}

      {/* Result Screen (Modal Overlay) */}
      {(status === "victory" || status === "defeat") && <ResultScreen />}
    </main>
  );
}
