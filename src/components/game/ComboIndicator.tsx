'use client';

import { useGameStore } from '@/stores/gameStore';
import { getComboInfo } from '@/lib/combo';
import { CATEGORY_NAME } from '@/types/meme-event';

export function ComboIndicator() {
  const combo = useGameStore(s => s.combo);
  const comboInfo = getComboInfo(combo);

  if (!comboInfo.isActive) {
    return null;
  }

  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full
      ${comboInfo.isMaster 
        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse' 
        : 'bg-orange-500/80'
      }
    `}>
      {/* Category emoji */}
      <span className="text-xl">{comboInfo.emoji}</span>
      
      {/* Category name */}
      {comboInfo.category && (
        <span className="text-sm font-medium text-white/90">
          {CATEGORY_NAME[comboInfo.category]}
        </span>
      )}
      
      {/* Combo display */}
      <span className="font-bold text-white text-sm">
        {comboInfo.display}
      </span>
      
      {/* Bonus display */}
      {comboInfo.bonusPercent && (
        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded text-white/90">
          {comboInfo.bonusPercent}
        </span>
      )}
    </div>
  );
}

// Compact version for status bar
export function ComboIndicatorCompact() {
  const combo = useGameStore(s => s.combo);
  const comboInfo = getComboInfo(combo);

  if (!comboInfo.isActive) {
    return (
      <div className="text-gray-500 text-sm">
        콤보 없음
      </div>
    );
  }

  return (
    <div className={`
      flex items-center gap-1
      ${comboInfo.isMaster ? 'text-yellow-400' : 'text-orange-400'}
    `}>
      <span>{comboInfo.emoji}</span>
      <span className="font-bold">{comboInfo.display}</span>
    </div>
  );
}
