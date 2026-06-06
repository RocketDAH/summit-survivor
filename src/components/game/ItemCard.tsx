'use client';

import { MemeItem, CATEGORY_EMOJI, BUFF_CONFIGS, ItemEffect } from '@/types/meme-event';
import { useGameStore } from '@/stores/gameStore';

interface ItemCardProps {
  item: MemeItem;
  position: 'left' | 'right' | 'center';
  onClick: () => void;
  isHovered?: boolean;
  showEffects?: boolean;
}

function formatEffect(effect: ItemEffect): string {
  switch (effect.type) {
    case 'hp':
      return effect.value && effect.value > 0 
        ? `HP +${effect.value}` 
        : `HP ${effect.value}`;
    case 'altitude':
      return effect.value && effect.value > 0
        ? `고도 +${effect.value}m`
        : `고도 ${effect.value}m`;
    case 'buff':
    case 'debuff':
      if (effect.buffType) {
        const config = BUFF_CONFIGS[effect.buffType];
        if (effect.duration) {
          return `${config.emoji} ${config.name} (${effect.duration}초)`;
        }
        if (effect.uses) {
          return `${config.emoji} ${config.name} (${effect.uses}회)`;
        }
        return `${config.emoji} ${config.name}`;
      }
      return '';
    case 'remove_debuff':
      return effect.removeCount === 'all' 
        ? '🩹 디버프 전체 해제' 
        : `🩹 디버프 ${effect.removeCount ?? 1}개 해제`;
    case 'random_hp':
      if (effect.range) {
        return `HP ${effect.range[0]}~${effect.range[1]} (랜덤)`;
      }
      return 'HP ??? (랜덤)';
    case 'special':
      switch (effect.specialId) {
        case 'full_heal': return '💖 HP 완전 회복';
        case 'revival': return '🔄 부활';
        case 'time_bonus': return '⏰ 시간 +10초';
        default: return '⭐ 특수 효과';
      }
    default:
      return '';
  }
}

export function ItemCard({ item, position, onClick, isHovered, showEffects = true }: ItemCardProps) {
  const combo = useGameStore(s => s.combo);
  const activeBuffs = useGameStore(s => s.activeBuffs);
  
  const isComboMatch = combo.category === item.category;
  const hasConfusion = activeBuffs.some(b => b.type === 'confusion');
  
  const positionStyles = {
    left: 'border-blue-500 bg-blue-500/10',
    right: 'border-red-500 bg-red-500/10',
    center: 'border-yellow-500 bg-yellow-500/10',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full p-4 rounded-lg border-2 transition-all duration-200
        ${positionStyles[position]}
        ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
        ${isComboMatch ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
        hover:scale-105 hover:shadow-lg active:scale-95
        focus:outline-none focus:ring-2 focus:ring-white/50
      `}
    >
      {/* Combo indicator */}
      {isComboMatch && combo.count > 0 && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
          🔥 x{combo.count + 1}
        </div>
      )}

      {/* Category emoji */}
      <div className="text-3xl mb-2">
        {CATEGORY_EMOJI[item.category]}
      </div>

      {/* Item name */}
      <h3 className="font-bold text-lg mb-1 text-white">
        {item.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3 italic">
        {item.description}
      </p>

      {/* Effects */}
      {showEffects && !hasConfusion && (
        <div className="space-y-1">
          {item.effects.map((effect, idx) => {
            const formatted = formatEffect(effect);
            if (!formatted) return null;
            
            const isPositive = 
              (effect.type === 'hp' && (effect.value ?? 0) > 0) ||
              (effect.type === 'altitude' && (effect.value ?? 0) > 0) ||
              effect.type === 'buff' ||
              effect.type === 'remove_debuff' ||
              (effect.type === 'special' && effect.specialId !== 'curse');
            
            const isNegative =
              (effect.type === 'hp' && (effect.value ?? 0) < 0) ||
              (effect.type === 'altitude' && (effect.value ?? 0) < 0) ||
              effect.type === 'debuff';

            return (
              <div
                key={idx}
                className={`
                  text-sm px-2 py-0.5 rounded
                  ${isPositive ? 'bg-green-500/30 text-green-300' : ''}
                  ${isNegative ? 'bg-red-500/30 text-red-300' : ''}
                  ${!isPositive && !isNegative ? 'bg-gray-500/30 text-gray-300' : ''}
                `}
              >
                {formatted}
              </div>
            );
          })}
        </div>
      )}

      {/* Confusion effect */}
      {hasConfusion && (
        <div className="text-gray-400 text-sm">
          ❓ 효과를 알 수 없습니다
        </div>
      )}

      {/* Position indicator */}
      <div className={`
        absolute bottom-2 right-2 text-xs font-bold uppercase
        ${position === 'left' ? 'text-blue-400' : ''}
        ${position === 'right' ? 'text-red-400' : ''}
        ${position === 'center' ? 'text-yellow-400' : ''}
      `}>
        {position === 'left' && '← A'}
        {position === 'right' && 'D →'}
        {position === 'center' && 'S ↓'}
      </div>
    </button>
  );
}
