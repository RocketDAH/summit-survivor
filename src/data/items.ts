import { ItemDefinition } from "@/types/game";

export const POSITIVE_ITEMS: ItemDefinition[] = [
  {
    id: "food",
    name: "비상식량",
    type: "positive",
    effect: 15,
    description: "체력을 15 회복합니다",
    icon: "food",
  },
  {
    id: "water",
    name: "깨끗한 물",
    type: "positive",
    effect: 10,
    description: "체력을 10 회복합니다",
    icon: "water",
  },
  {
    id: "tent",
    name: "휴식처",
    type: "positive",
    effect: 20,
    description: "체력을 20 회복합니다",
    icon: "tent",
  },
];

export const NEGATIVE_ITEMS: ItemDefinition[] = [
  {
    id: "rockfall",
    name: "낙석",
    type: "negative",
    effect: -20,
    description: "체력이 20 감소합니다",
    icon: "rockfall",
  },
  {
    id: "storm",
    name: "눈보라",
    type: "negative",
    effect: -15,
    description: "체력이 15 감소합니다",
    icon: "storm",
  },
  {
    id: "injury",
    name: "부상",
    type: "negative",
    effect: -25,
    description: "체력이 25 감소합니다",
    icon: "injury",
  },
];

export const RANDOM_ITEMS: ItemDefinition[] = [
  {
    id: "treasure",
    name: "보물상자",
    type: "random",
    effect: 0, // Will be randomized
    description: "무엇이 나올지 모릅니다...",
    icon: "treasure",
  },
  {
    id: "mushroom",
    name: "수상한 버섯",
    type: "random",
    effect: 0, // Will be randomized
    description: "먹어도 될까요?",
    icon: "mushroom",
  },
  {
    id: "unknown",
    name: "미확인 물체",
    type: "random",
    effect: 0, // Will be randomized
    description: "이게 뭘까요?",
    icon: "unknown",
  },
];

export const ALL_ITEMS = [...POSITIVE_ITEMS, ...NEGATIVE_ITEMS, ...RANDOM_ITEMS];

// Item type distribution for random generation
export const ITEM_DISTRIBUTION = {
  positive: 45, // 45%
  negative: 35, // 35%
  random: 20, // 20%
} as const;
