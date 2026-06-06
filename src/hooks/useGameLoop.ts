"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { GAME_CONSTANTS } from "@/types/game";
import { MEME_GAME_CONSTANTS } from "@/types/meme-event";

export function useGameLoop() {
  const lastTimeRef = useRef<number>(0);
  const lastEventTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const state = useGameStore.getState();
      
      if (state.status !== "playing") {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Calculate delta time in seconds
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = currentTime;

      // Update game state (HP decrease, altitude increase, time decrease)
      state.tick(deltaTime);

      // Generate new event if needed
      const updatedState = useGameStore.getState();
      const useMemeSystem = updatedState.useMemeSystem;
      
      // Check if event is needed based on system type
      const hasActiveEvent = useMemeSystem 
        ? updatedState.currentDilemmaEvent !== null
        : updatedState.currentEvent !== null;
        
      if (!hasActiveEvent) {
        const eventInterval = useMemeSystem 
          ? MEME_GAME_CONSTANTS.EVENT_INTERVAL 
          : GAME_CONSTANTS.EVENT_INTERVAL;
        const eventDeltaTime = currentTime - lastEventTimeRef.current;
        
        if (eventDeltaTime >= eventInterval * 1000 || lastEventTimeRef.current === 0) {
          updatedState.generateEvent();
          lastEventTimeRef.current = currentTime;
        }
      }

      // Continue the loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    lastTimeRef.current = 0;
    lastEventTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
}
