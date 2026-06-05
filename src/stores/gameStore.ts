import { create } from "zustand";
import { GameState, GameStore, GameEvent, ItemDefinition, GAME_CONSTANTS } from "@/types/game";
import { getRandomItem, generateEventId } from "@/lib/random";
import { calculateScore } from "@/lib/score";

const initialState: GameState = {
  status: "idle",
  hp: GAME_CONSTANTS.MAX_HP,
  maxHp: GAME_CONSTANTS.MAX_HP,
  altitude: 0,
  targetAltitude: GAME_CONSTANTS.TARGET_ALTITUDE,
  timeRemaining: GAME_CONSTANTS.TOTAL_TIME,
  totalTime: GAME_CONSTANTS.TOTAL_TIME,
  score: 0,
  currentEvent: null,
  eventsCollected: 0,
  eventsSkipped: 0,
  positiveItems: 0,
  negativeItems: 0,
  randomItems: 0,
  startTime: null,
  endTime: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: () => {
    set({
      ...initialState,
      status: "playing",
      startTime: Date.now(),
    });
  },

  resetGame: () => {
    set(initialState);
  },

  tick: (deltaTime: number) => {
    const state = get();
    if (state.status !== "playing") return;

    // Update time
    const newTimeRemaining = Math.max(0, state.timeRemaining - deltaTime);
    
    // Update altitude (auto-climb)
    const newAltitude = Math.min(
      state.targetAltitude,
      state.altitude + GAME_CONSTANTS.ALTITUDE_INCREASE_RATE * deltaTime
    );
    
    // Update HP (auto-decrease)
    const newHp = Math.max(0, state.hp - GAME_CONSTANTS.HP_DECREASE_RATE * deltaTime);
    
    // Check current event expiration
    let currentEvent = state.currentEvent;
    if (currentEvent && Date.now() >= currentEvent.expiresAt) {
      currentEvent = null;
      set((s) => ({ eventsSkipped: s.eventsSkipped + 1 }));
    }

    set({
      timeRemaining: newTimeRemaining,
      altitude: newAltitude,
      hp: newHp,
      currentEvent,
    });

    // Check game end conditions
    const updatedState = get();
    if (updatedState.checkVictory() || updatedState.checkDefeat()) {
      const finalScore = updatedState.calculateScore();
      set({
        score: finalScore,
        endTime: Date.now(),
      });
    }
  },

  selectEvent: () => {
    const state = get();
    if (!state.currentEvent || state.status !== "playing") return;

    const item = state.currentEvent.item;
    get().applyItemEffect(item);
    
    set((s) => ({
      currentEvent: null,
      eventsCollected: s.eventsCollected + 1,
      positiveItems: item.type === "positive" ? s.positiveItems + 1 : s.positiveItems,
      negativeItems: item.type === "negative" ? s.negativeItems + 1 : s.negativeItems,
      randomItems: item.type === "random" ? s.randomItems + 1 : s.randomItems,
    }));
  },

  skipEvent: () => {
    const state = get();
    if (!state.currentEvent || state.status !== "playing") return;

    set((s) => ({
      currentEvent: null,
      eventsSkipped: s.eventsSkipped + 1,
    }));
  },

  generateEvent: () => {
    const state = get();
    if (state.status !== "playing" || state.currentEvent) return;

    const item = getRandomItem();
    const now = Date.now();
    const event: GameEvent = {
      id: generateEventId(),
      item,
      timestamp: now,
      expiresAt: now + GAME_CONSTANTS.EVENT_INTERVAL * 1000,
    };

    set({ currentEvent: event });
  },

  applyItemEffect: (item: ItemDefinition) => {
    set((state) => ({
      hp: Math.min(state.maxHp, Math.max(0, state.hp + item.effect)),
    }));
  },

  checkVictory: () => {
    const state = get();
    if (state.altitude >= state.targetAltitude && state.status === "playing") {
      set({ status: "victory" });
      return true;
    }
    return false;
  },

  checkDefeat: () => {
    const state = get();
    if ((state.hp <= 0 || state.timeRemaining <= 0) && state.status === "playing") {
      set({ status: "defeat" });
      return true;
    }
    return false;
  },

  calculateScore: () => {
    const state = get();
    const breakdown = calculateScore(state);
    return breakdown.total;
  },
}));
