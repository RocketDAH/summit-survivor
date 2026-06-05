// Game Type Definitions

export type ItemType = "positive" | "negative" | "random";

export type GameStatus = "idle" | "playing" | "victory" | "defeat";

export interface ItemDefinition {
  id: string;
  name: string;
  type: ItemType;
  effect: number;
  description: string;
  icon: string;
}

export interface GameEvent {
  id: string;
  item: ItemDefinition;
  timestamp: number;
  expiresAt: number;
}

export interface GameState {
  status: GameStatus;
  hp: number;
  maxHp: number;
  altitude: number;
  targetAltitude: number;
  timeRemaining: number;
  totalTime: number;
  score: number;
  currentEvent: GameEvent | null;
  eventsCollected: number;
  eventsSkipped: number;
  positiveItems: number;
  negativeItems: number;
  randomItems: number;
  startTime: number | null;
  endTime: number | null;
}

export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  tick: (deltaTime: number) => void;
  selectEvent: () => void;
  skipEvent: () => void;
  generateEvent: () => void;
  applyItemEffect: (item: ItemDefinition) => void;
  checkVictory: () => boolean;
  checkDefeat: () => boolean;
  calculateScore: () => number;
}

export type GameStore = GameState & GameActions;

// Game Constants
export const GAME_CONSTANTS = {
  MAX_HP: 100,
  TARGET_ALTITUDE: 3000,
  TOTAL_TIME: 120, // 2 minutes in seconds
  EVENT_INTERVAL: 2.5, // seconds (더 여유로운 선택 시간)
  HP_DECREASE_RATE: 1, // per second
  ALTITUDE_INCREASE_RATE: 25, // per second (3000m / 120s = 25m/s)
} as const;

// HP State thresholds
export const HP_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 40,
  LOW: 20,
} as const;

export type HpState = "high" | "medium" | "low" | "critical";

export function getHpState(hp: number, maxHp: number): HpState {
  const percentage = (hp / maxHp) * 100;
  if (percentage >= HP_THRESHOLDS.HIGH) return "high";
  if (percentage >= HP_THRESHOLDS.MEDIUM) return "medium";
  if (percentage >= HP_THRESHOLDS.LOW) return "low";
  return "critical";
}
