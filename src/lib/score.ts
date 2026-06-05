import { GameState, GAME_CONSTANTS } from "@/types/game";

interface ScoreBreakdown {
  baseScore: number;
  timeBonus: number;
  hpBonus: number;
  collectionBonus: number;
  victoryBonus: number;
  total: number;
}

/**
 * Calculate the final score based on game state
 * 
 * Scoring Formula:
 * - Base Score: altitude reached (max 3000)
 * - Time Bonus: remaining time * 10 (only on victory)
 * - HP Bonus: remaining HP * 5
 * - Collection Bonus: positive items * 50, random items * 30
 * - Victory Bonus: +1000 for reaching summit
 */
export function calculateScore(state: GameState): ScoreBreakdown {
  const isVictory = state.status === "victory";
  
  // Base score from altitude
  const baseScore = Math.floor(state.altitude);
  
  // Time bonus (only on victory)
  const timeBonus = isVictory ? Math.floor(state.timeRemaining * 10) : 0;
  
  // HP bonus
  const hpBonus = Math.floor(state.hp * 5);
  
  // Collection bonus
  const collectionBonus = 
    state.positiveItems * 50 + 
    state.randomItems * 30;
  
  // Victory bonus
  const victoryBonus = isVictory ? 1000 : 0;
  
  // Total
  const total = baseScore + timeBonus + hpBonus + collectionBonus + victoryBonus;
  
  return {
    baseScore,
    timeBonus,
    hpBonus,
    collectionBonus,
    victoryBonus,
    total,
  };
}

/**
 * Format score with thousand separators
 */
export function formatScore(score: number): string {
  return score.toLocaleString("ko-KR");
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format altitude with "m" suffix
 */
export function formatAltitude(altitude: number): string {
  return `${Math.floor(altitude).toLocaleString("ko-KR")}m`;
}

/**
 * Calculate percentage for progress bars
 */
export function calculatePercentage(value: number, max: number): number {
  return Math.min(100, Math.max(0, (value / max) * 100));
}
