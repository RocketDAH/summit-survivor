import { create } from 'zustand'

interface GameEvent {
  id: string
  type: 'positive' | 'negative' | 'random'
  title: string
  description: string
  choices: {
    text: string
    hpChange: number
    progressChange: number
    score: number
  }[]
}

interface GameState {
  gameStarted: boolean
  gameOver: boolean
  hp: number
  maxHp: number
  progress: number
  maxProgress: number
  timeLeft: number
  score: number
  currentEvent: GameEvent | null

  startGame: () => void
  endGame: () => void
  updateHp: (change: number) => void
  updateProgress: (change: number) => void
  updateTime: (time: number) => void
  setCurrentEvent: (event: GameEvent | null) => void
  makeChoice: (choiceIndex: number) => void
  reset: () => void
}

const SAMPLE_EVENTS: GameEvent[] = [
  {
    id: '1',
    type: 'positive',
    title: '체력 회복 아이템',
    description: '에너지 바를 발견했습니다!',
    choices: [
      { text: '사용하기 (+15 HP)', hpChange: 15, progressChange: 0, score: 10 },
      { text: '무시하기', hpChange: 0, progressChange: 5, score: 5 }
    ]
  },
  {
    id: '2',
    type: 'negative',
    title: '험난한 길',
    description: '가시덤불이 앞을 막고 있습니다.',
    choices: [
      { text: '돌파하기 (-10 HP)', hpChange: -10, progressChange: 30, score: 20 },
      { text: '우회하기 (-5 HP)', hpChange: -5, progressChange: 15, score: 10 }
    ]
  },
  {
    id: '3',
    type: 'random',
    title: '신비한 상자',
    description: '무엇이 들어있을까요?',
    choices: [
      { text: '열어보기', hpChange: Math.random() > 0.5 ? 10 : -10, progressChange: 20, score: 15 },
      { text: '그냥 가기', hpChange: 0, progressChange: 10, score: 5 }
    ]
  }
]

export const useGameStore = create<GameState>((set, get) => ({
  gameStarted: false,
  gameOver: false,
  hp: 100,
  maxHp: 120,
  progress: 0,
  maxProgress: 3000,
  timeLeft: 120,
  score: 0,
  currentEvent: null,

  startGame: () => set({
    gameStarted: true,
    gameOver: false,
    hp: 100,
    progress: 0,
    timeLeft: 120,
    score: 0
  }),

  endGame: () => set({ gameOver: true, currentEvent: null }),

  updateHp: (change: number) => {
    const currentHp = get().hp
    const newHp = Math.min(Math.max(currentHp + change, 0), get().maxHp)
    set({ hp: newHp })
    if (newHp <= 0) {
      get().endGame()
    }
  },

  updateProgress: (change: number) => {
    const newProgress = Math.min(get().progress + change, get().maxProgress)
    set({ progress: newProgress, score: get().score + Math.floor(change / 10) })
    if (newProgress >= get().maxProgress) {
      get().endGame()
    }
  },

  updateTime: (time: number) => {
    set({ timeLeft: time })
    if (time <= 0) {
      get().endGame()
    }
  },

  setCurrentEvent: (event: GameEvent | null) => set({ currentEvent: event }),

  makeChoice: (choiceIndex: number) => {
    const { currentEvent } = get()
    if (!currentEvent) return

    const choice = currentEvent.choices[choiceIndex]
    get().updateHp(choice.hpChange)
    get().updateProgress(choice.progressChange)
    set({ score: get().score + choice.score })
    set({ currentEvent: null })
  },

  reset: () => set({
    gameStarted: false,
    gameOver: false,
    hp: 100,
    progress: 0,
    timeLeft: 120,
    score: 0,
    currentEvent: null
  })
}))

export { SAMPLE_EVENTS }