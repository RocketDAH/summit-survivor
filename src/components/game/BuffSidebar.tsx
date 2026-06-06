'use client';

import { useGameStore } from '@/stores/gameStore';
import { separateBuffsAndDebuffs } from '@/lib/buff';
import { BUFF_CONFIGS, ActiveBuff } from '@/types/meme-event';
import { useEffect, useState } from 'react';

interface BuffItemProps {
  buff: ActiveBuff;
  isDebuff?: boolean;
}

function BuffItem({ buff, isDebuff }: BuffItemProps) {
  const config = BUFF_CONFIGS[buff.type];
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate remaining percentage for time-based buffs
  const remainingPercent = buff.remainingTime && buff.duration
    ? (buff.remainingTime / buff.duration) * 100
    : null;

  // Check if expiring soon
  const isExpiringSoon = buff.remainingTime && buff.remainingTime < 5;

  return (
    <div
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
        ${flash ? 'animate-pulse scale-105' : 'scale-100'}
        ${isDebuff ? 'bg-red-900/50 border border-red-500/30' : 'bg-green-900/50 border border-green-500/30'}
        ${isExpiringSoon ? 'animate-pulse' : ''}
      `}
    >
      {/* Emoji */}
      <span className="text-xl">{config.emoji}</span>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-white truncate">
          {config.name}
        </div>
        
        {/* Time remaining */}
        {buff.remainingTime !== undefined && (
          <div className="text-xs text-gray-400">
            {Math.ceil(buff.remainingTime)}초
          </div>
        )}
        
        {/* Uses remaining */}
        {buff.usesLeft !== undefined && (
          <div className="text-xs text-gray-400">
            {buff.usesLeft}회 남음
          </div>
        )}
      </div>

      {/* Progress bar for time-based */}
      {remainingPercent !== null && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${isDebuff ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${remainingPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface BuffLogItemProps {
  message: string;
  timestamp: number;
}

function BuffLogItem({ message, timestamp }: BuffLogItemProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="text-sm text-gray-300 px-2 py-1 bg-black/20 rounded animate-fade-in">
      {message}
    </div>
  );
}

export function BuffSidebar() {
  const activeBuffs = useGameStore(s => s.activeBuffs);
  const buffHistory = useGameStore(s => s.buffHistory);
  const lastEventResult = useGameStore(s => s.lastEventResult);
  
  const { buffs, debuffs } = separateBuffsAndDebuffs(activeBuffs);

  return (
    <div className="flex flex-col gap-4 w-64 max-h-[calc(100vh-200px)] overflow-hidden">
      {/* Active Buffs */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
          <span>✨</span> 활성 버프
          {buffs.length > 0 && (
            <span className="bg-green-500/30 px-1.5 rounded text-green-300">
              {buffs.length}
            </span>
          )}
        </h3>
        
        <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
          {buffs.length === 0 ? (
            <div className="text-gray-500 text-sm px-2">없음</div>
          ) : (
            buffs.map(buff => (
              <BuffItem key={buff.id} buff={buff} />
            ))
          )}
        </div>
      </div>

      {/* Active Debuffs */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
          <span>💀</span> 활성 디버프
          {debuffs.length > 0 && (
            <span className="bg-red-500/30 px-1.5 rounded text-red-300">
              {debuffs.length}
            </span>
          )}
        </h3>
        
        <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
          {debuffs.length === 0 ? (
            <div className="text-gray-500 text-sm px-2">없음</div>
          ) : (
            debuffs.map(buff => (
              <BuffItem key={buff.id} buff={buff} isDebuff />
            ))
          )}
        </div>
      </div>

      {/* Buff Log */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          📜 로그
        </h3>
        
        <div className="flex flex-col gap-1 overflow-y-auto max-h-48">
          {buffHistory.slice(-5).reverse().map((entry, idx) => (
            <BuffLogItem
              key={`${entry.appliedAt}-${idx}`}
              message={entry.message}
              timestamp={entry.appliedAt}
            />
          ))}
          
          {/* Last event result */}
          {lastEventResult && (
            <div className="text-xs text-gray-400 px-2 py-1 bg-black/10 rounded">
              {lastEventResult.selectedItem.name} 선택
              {lastEventResult.selectionType === 'auto' && ' (자동)'}
              {lastEventResult.hpChange !== 0 && (
                <span className={lastEventResult.hpChange > 0 ? 'text-green-400' : 'text-red-400'}>
                  {' '}HP {lastEventResult.hpChange > 0 ? '+' : ''}{lastEventResult.hpChange}
                </span>
              )}
              {lastEventResult.altitudeChange !== 0 && (
                <span className={lastEventResult.altitudeChange > 0 ? 'text-blue-400' : 'text-orange-400'}>
                  {' '}고도 {lastEventResult.altitudeChange > 0 ? '+' : ''}{lastEventResult.altitudeChange}m
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function BuffSidebarCompact() {
  const activeBuffs = useGameStore(s => s.activeBuffs);
  const { buffs, debuffs } = separateBuffsAndDebuffs(activeBuffs);

  return (
    <div className="flex items-center gap-2">
      {buffs.map(buff => (
        <span key={buff.id} className="text-xl" title={BUFF_CONFIGS[buff.type].name}>
          {BUFF_CONFIGS[buff.type].emoji}
        </span>
      ))}
      {debuffs.map(buff => (
        <span key={buff.id} className="text-xl opacity-60" title={BUFF_CONFIGS[buff.type].name}>
          {BUFF_CONFIGS[buff.type].emoji}
        </span>
      ))}
    </div>
  );
}
