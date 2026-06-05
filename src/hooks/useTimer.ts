"use client";

import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { formatTime } from "@/lib/score";

export function useTimer() {
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const totalTime = useGameStore((state) => state.totalTime);
  const status = useGameStore((state) => state.status);

  const formattedTime = useMemo(() => {
    return formatTime(timeRemaining);
  }, [timeRemaining]);

  const percentage = useMemo(() => {
    return (timeRemaining / totalTime) * 100;
  }, [timeRemaining, totalTime]);

  const isWarning = timeRemaining <= 30 && timeRemaining > 10;
  const isCritical = timeRemaining <= 10;

  return {
    timeRemaining,
    formattedTime,
    percentage,
    isWarning,
    isCritical,
    isRunning: status === "playing",
  };
}
