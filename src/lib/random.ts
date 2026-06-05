import { ItemDefinition, ItemType } from "@/types/game";
import {
  POSITIVE_ITEMS,
  NEGATIVE_ITEMS,
  RANDOM_ITEMS,
  ITEM_DISTRIBUTION,
} from "@/data/items";

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random item from an array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random item type based on distribution (45/35/20)
 */
export function getRandomItemType(): ItemType {
  const roll = Math.random() * 100;
  
  if (roll < ITEM_DISTRIBUTION.positive) {
    return "positive";
  } else if (roll < ITEM_DISTRIBUTION.positive + ITEM_DISTRIBUTION.negative) {
    return "negative";
  } else {
    return "random";
  }
}

/**
 * Get a random item based on type distribution
 */
export function getRandomItem(): ItemDefinition {
  const type = getRandomItemType();
  
  let item: ItemDefinition;
  
  switch (type) {
    case "positive":
      item = randomChoice(POSITIVE_ITEMS);
      break;
    case "negative":
      item = randomChoice(NEGATIVE_ITEMS);
      break;
    case "random":
      item = { ...randomChoice(RANDOM_ITEMS) };
      // Randomize the effect for random items (-30 to +30)
      item.effect = randomInt(-30, 30);
      break;
    default:
      item = randomChoice(POSITIVE_ITEMS);
  }
  
  return item;
}

/**
 * Generate unique event ID
 */
export function generateEventId(): string {
  return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
