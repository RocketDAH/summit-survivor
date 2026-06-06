import { create } from "zustand";
import { GameState, GameStore, GameEvent, ItemDefinition, GAME_CONSTANTS } from "@/types/game";
import { 
  MemeItem, 
  DilemmaEvent, 
  ActiveBuff, 
  ComboState, 
  EventResult,
  SelectionType,
  MEME_GAME_CONSTANTS,
  ItemEffect,
  BUFF_CONFIGS,
} from "@/types/meme-event";
import { getRandomItem, generateEventId } from "@/lib/random";
import { calculateScore } from "@/lib/score";
import { 
  generateDilemmaEvent, 
  autoSelectItem, 
  isEventExpired, 
  getEventTimeRatio 
} from "@/lib/event-generator";
import { 
  tickBuffs, 
  addBuff, 
  hasBuff, 
  consumeShield, 
  separateBuffsAndDebuffs,
  getHpDecreaseRate,
  getAltitudeIncreaseRate,
  applyHpModifiers,
  applyAltitudeModifiers,
  createBuff,
} from "@/lib/buff";
import { 
  updateCombo, 
  resetCombo, 
  INITIAL_COMBO_STATE,
  getComboInfo,
} from "@/lib/combo";

// Extended state with meme event system
interface MemeEventState extends GameState {
  // Dilemma system
  currentDilemmaEvent: DilemmaEvent | null;
  useMemeSystem: boolean;
  
  // Buffs/Debuffs
  activeBuffs: ActiveBuff[];
  buffHistory: { buff: ActiveBuff; appliedAt: number; message: string }[];
  
  // Combo
  combo: ComboState;
  comboHistory: { category: string; count: number; timestamp: number }[];
  
  // Stats
  autoSelections: number;
  lastEventResult: EventResult | null;
}

interface MemeEventActions {
  // Dilemma actions
  generateDilemma: () => void;
  selectDilemmaItem: (position: 'left' | 'right' | 'center') => void;
  handleAutoSelect: () => void;
  
  // Buff actions
  addActiveBuff: (buffType: import("@/types/meme-event").BuffType, duration?: number, uses?: number) => void;
  removeActiveBuff: (buffId: string) => void;
  
  // Toggle system
  toggleMemeSystem: (enabled: boolean) => void;
}

type ExtendedGameStore = GameState & MemeEventState & GameStore & MemeEventActions;

const initialState: GameState = {
  status: "idle",
  hp: MEME_GAME_CONSTANTS.MAX_HP,
  maxHp: MEME_GAME_CONSTANTS.MAX_HP,
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

const memeInitialState: Omit<MemeEventState, keyof GameState> = {
  currentDilemmaEvent: null,
  useMemeSystem: true,
  activeBuffs: [],
  buffHistory: [],
  combo: INITIAL_COMBO_STATE,
  comboHistory: [],
  autoSelections: 0,
  lastEventResult: null,
};

export const useGameStore = create<ExtendedGameStore>((set, get) => ({
  ...initialState,
  ...memeInitialState,

  startGame: () => {
    set({
      ...initialState,
      ...memeInitialState,
      status: "playing",
      startTime: Date.now(),
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      ...memeInitialState,
    });
  },

  tick: (deltaTime: number) => {
    const state = get();
    if (state.status !== "playing") return;

    const { buffs, debuffs } = separateBuffsAndDebuffs(state.activeBuffs);

    // Update time
    const newTimeRemaining = Math.max(0, state.timeRemaining - deltaTime);
    
    // Update altitude with buff modifiers
    const altitudeRate = getAltitudeIncreaseRate(
      GAME_CONSTANTS.ALTITUDE_INCREASE_RATE,
      buffs,
      debuffs
    );
    const newAltitude = Math.min(
      state.targetAltitude,
      state.altitude + altitudeRate * deltaTime
    );
    
    // Update HP with buff modifiers
    const hpRate = getHpDecreaseRate(
      GAME_CONSTANTS.HP_DECREASE_RATE,
      buffs,
      debuffs
    );
    const newHp = Math.max(0, state.hp - hpRate * deltaTime);
    
    // Tick buffs (decrease remaining time)
    const tickedBuffs = tickBuffs(state.activeBuffs, deltaTime);

    // Check legacy event expiration
    let currentEvent = state.currentEvent;
    if (currentEvent && Date.now() >= currentEvent.expiresAt) {
      currentEvent = null;
      set((s) => ({ eventsSkipped: s.eventsSkipped + 1 }));
    }

    // Check dilemma event expiration and auto-select
    let currentDilemmaEvent = state.currentDilemmaEvent;
    if (state.useMemeSystem && currentDilemmaEvent && isEventExpired(currentDilemmaEvent)) {
      get().handleAutoSelect();
      currentDilemmaEvent = null;
    }

    set({
      timeRemaining: newTimeRemaining,
      altitude: newAltitude,
      hp: newHp,
      currentEvent,
      currentDilemmaEvent,
      activeBuffs: tickedBuffs,
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

  // Legacy event selection
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
    if (state.status !== "playing") return;
    
    // Use meme system if enabled
    if (state.useMemeSystem) {
      get().generateDilemma();
      return;
    }

    // Legacy system
    if (state.currentEvent) return;

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

  // Meme event system actions
  generateDilemma: () => {
    const state = get();
    if (state.status !== "playing" || state.currentDilemmaEvent) return;

    const { buffs, debuffs } = separateBuffsAndDebuffs(state.activeBuffs);
    
    const event = generateDilemmaEvent(
      state.hp,
      state.maxHp,
      state.altitude,
      state.targetAltitude,
      state.combo,
      debuffs
    );

    set({ currentDilemmaEvent: event });
  },

  selectDilemmaItem: (position: 'left' | 'right' | 'center') => {
    const state = get();
    if (!state.currentDilemmaEvent || state.status !== "playing") return;

    const event = state.currentDilemmaEvent;
    let selectedItem: MemeItem;
    
    switch (position) {
      case 'left':
        selectedItem = event.leftItem;
        break;
      case 'right':
        selectedItem = event.rightItem;
        break;
      case 'center':
        if (!event.centerItem) return;
        selectedItem = event.centerItem;
        break;
    }

    // Apply effects
    const { buffs, debuffs } = separateBuffsAndDebuffs(state.activeBuffs);
    let newHp = state.hp;
    let newAltitude = state.altitude;
    let newBuffs = [...state.activeBuffs];
    const newBuffsGained: ActiveBuff[] = [];
    const debuffsRemoved: string[] = [];

    for (const effect of selectedItem.effects) {
      switch (effect.type) {
        case 'hp': {
          const modifiedHp = applyHpModifiers(effect.value ?? 0, buffs, debuffs, state.combo);
          
          // Shield blocks negative effects
          if (modifiedHp < 0 && hasBuff(buffs, 'shield')) {
            newBuffs = consumeShield(newBuffs);
          } else {
            newHp = Math.min(state.maxHp, Math.max(0, newHp + modifiedHp));
          }
          break;
        }
        case 'altitude': {
          const modifiedAltitude = applyAltitudeModifiers(effect.value ?? 0, buffs, debuffs);
          newAltitude = Math.min(state.targetAltitude, Math.max(0, newAltitude + modifiedAltitude));
          break;
        }
        case 'buff':
        case 'debuff': {
          if (effect.buffType) {
            const newBuff = createBuff(effect.buffType, effect.duration, effect.uses);
            newBuffs = addBuff(newBuffs, effect.buffType, effect.duration, effect.uses);
            newBuffsGained.push(newBuff);
          }
          break;
        }
        case 'remove_debuff': {
          const { debuffs: currentDebuffs } = separateBuffsAndDebuffs(newBuffs);
          const count = effect.removeCount === 'all' ? currentDebuffs.length : (effect.removeCount ?? 1);
          const toRemove = currentDebuffs.slice(0, count);
          for (const d of toRemove) {
            debuffsRemoved.push(d.id);
            newBuffs = newBuffs.filter(b => b.id !== d.id);
          }
          break;
        }
        case 'random_hp': {
          if (effect.range) {
            const [min, max] = effect.range;
            const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
            const modifiedHp = applyHpModifiers(randomValue, buffs, debuffs, state.combo);
            
            if (modifiedHp < 0 && hasBuff(buffs, 'shield')) {
              newBuffs = consumeShield(newBuffs);
            } else {
              newHp = Math.min(state.maxHp, Math.max(0, newHp + modifiedHp));
            }
          }
          break;
        }
        case 'special': {
          // Handle special effects
          if (effect.specialId === 'full_heal') {
            newHp = state.maxHp;
          } else if (effect.specialId === 'revival') {
            newHp = Math.max(newHp, 50);
          } else if (effect.specialId === 'time_bonus') {
            set(s => ({ timeRemaining: Math.min(s.totalTime, s.timeRemaining + 10) }));
          }
          break;
        }
      }
    }

    // Update combo
    const newCombo = updateCombo(state.combo, selectedItem.category);
    const comboMaintained = newCombo.count > 1;

    // Create event result
    const result: EventResult = {
      eventId: event.id,
      selectedItem,
      selectionType: position as SelectionType,
      hpChange: newHp - state.hp,
      altitudeChange: newAltitude - state.altitude,
      buffsGained: newBuffsGained,
      debuffsRemoved,
      comboMaintained,
      newComboCount: newCombo.count,
    };

    // Update buff history
    const newBuffHistory = [...state.buffHistory];
    for (const buff of newBuffsGained) {
      const config = BUFF_CONFIGS[buff.type];
      newBuffHistory.push({
        buff,
        appliedAt: Date.now(),
        message: `${config.emoji} ${config.name} 획득!`,
      });
    }

    // Update combo history
    const newComboHistory = [...state.comboHistory];
    if (comboMaintained) {
      newComboHistory.push({
        category: selectedItem.category,
        count: newCombo.count,
        timestamp: Date.now(),
      });
    }

    set({
      hp: newHp,
      altitude: newAltitude,
      activeBuffs: newBuffs,
      combo: newCombo,
      currentDilemmaEvent: null,
      eventsCollected: state.eventsCollected + 1,
      lastEventResult: result,
      buffHistory: newBuffHistory.slice(-10), // Keep last 10
      comboHistory: newComboHistory.slice(-10),
    });
  },

  handleAutoSelect: () => {
    const state = get();
    if (!state.currentDilemmaEvent) return;

    const { selectedItem, position } = autoSelectItem(state.currentDilemmaEvent);
    
    // Apply selection
    get().selectDilemmaItem(position);
    
    // Mark as auto selection
    set(s => ({
      autoSelections: s.autoSelections + 1,
      lastEventResult: s.lastEventResult 
        ? { ...s.lastEventResult, selectionType: 'auto' as SelectionType }
        : null,
    }));
  },

  addActiveBuff: (buffType, duration, uses) => {
    set(state => ({
      activeBuffs: addBuff(state.activeBuffs, buffType, duration, uses),
    }));
  },

  removeActiveBuff: (buffId) => {
    set(state => ({
      activeBuffs: state.activeBuffs.filter(b => b.id !== buffId),
    }));
  },

  toggleMemeSystem: (enabled) => {
    set({ useMemeSystem: enabled });
  },
}));
