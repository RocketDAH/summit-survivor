// 버프/디버프 시스템
import {
  BuffType,
  ActiveBuff,
  BUFF_CONFIGS,
  ComboState,
  COMBO_BONUSES,
} from '@/types/meme-event';

// 버프 ID 생성
export function generateBuffId(): string {
  return `buff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 버프 생성
export function createBuff(
  buffType: BuffType,
  duration?: number,
  uses?: number
): ActiveBuff {
  const config = BUFF_CONFIGS[buffType];
  const now = Date.now();
  
  return {
    id: generateBuffId(),
    type: buffType,
    startedAt: now,
    duration: duration ?? config.defaultDuration,
    remainingTime: duration ?? config.defaultDuration,
    totalUses: uses ?? config.defaultUses,
    usesLeft: uses ?? config.defaultUses,
  };
}

// 버프 보유 여부 확인
export function hasBuff(buffs: ActiveBuff[], buffType: BuffType): boolean {
  return buffs.some(b => b.type === buffType);
}

// 버프 찾기
export function findBuff(buffs: ActiveBuff[], buffType: BuffType): ActiveBuff | undefined {
  return buffs.find(b => b.type === buffType);
}

// 버프 추가 (중복 시 시간 갱신)
export function addBuff(
  buffs: ActiveBuff[],
  buffType: BuffType,
  duration?: number,
  uses?: number
): ActiveBuff[] {
  const existing = findBuff(buffs, buffType);
  
  if (existing) {
    // 같은 버프: 시간/사용횟수 갱신
    return buffs.map(b => {
      if (b.type === buffType) {
        const config = BUFF_CONFIGS[buffType];
        const newDuration = duration ?? config.defaultDuration;
        const newUses = uses ?? config.defaultUses;
        return {
          ...b,
          duration: newDuration,
          remainingTime: newDuration,
          totalUses: newUses,
          usesLeft: newUses,
        };
      }
      return b;
    });
  }
  
  // 새 버프 추가
  const newBuff = createBuff(buffType, duration, uses);
  return [...buffs, newBuff];
}

// 버프 제거
export function removeBuff(buffs: ActiveBuff[], buffId: string): ActiveBuff[] {
  return buffs.filter(b => b.id !== buffId);
}

// 버프 타입으로 제거
export function removeBuffByType(buffs: ActiveBuff[], buffType: BuffType): ActiveBuff[] {
  return buffs.filter(b => b.type !== buffType);
}

// 버프 틱 (시간 감소, 만료 제거)
export function tickBuffs(buffs: ActiveBuff[], deltaTime: number): ActiveBuff[] {
  return buffs
    .map(buff => {
      if (buff.remainingTime !== undefined) {
        return {
          ...buff,
          remainingTime: buff.remainingTime - deltaTime,
        };
      }
      return buff;
    })
    .filter(buff => {
      // 시간 기반 버프: 시간 남아있으면 유지
      if (buff.remainingTime !== undefined) {
        return buff.remainingTime > 0;
      }
      // 사용 횟수 기반 버프: 사용 횟수 남아있으면 유지
      if (buff.usesLeft !== undefined) {
        return buff.usesLeft > 0;
      }
      return true;
    });
}

// 실드 사용 (사용 횟수 감소)
export function consumeShield(buffs: ActiveBuff[]): ActiveBuff[] {
  const shieldBuff = findBuff(buffs, 'shield');
  if (!shieldBuff || !shieldBuff.usesLeft) return buffs;
  
  return buffs.map(b => {
    if (b.type === 'shield' && b.usesLeft !== undefined) {
      return {
        ...b,
        usesLeft: b.usesLeft - 1,
      };
    }
    return b;
  }).filter(b => b.type !== 'shield' || (b.usesLeft !== undefined && b.usesLeft > 0));
}

// HP 변화 적용 (버프/디버프 + 콤보 보너스)
export function applyHpModifiers(
  baseHp: number,
  buffs: ActiveBuff[],
  debuffs: ActiveBuff[],
  combo: ComboState
): number {
  let hp = baseHp;
  
  // HP 감소인 경우
  if (hp < 0) {
    // 갓생모드: HP 감소 -50%
    if (hasBuff(buffs, 'godlife')) {
      hp = Math.ceil(hp / 2);
    }
    
    // 광기: 효과 2배
    if (hasBuff(buffs, 'frenzy')) {
      hp = hp * 2;
    }
    
    // 멘붕: HP 감소 +50%
    if (hasBuff(debuffs, 'panic')) {
      hp = Math.floor(hp * 1.5);
    }
  }
  
  // HP 회복인 경우
  if (hp > 0) {
    // 저주: 회복량 -50%
    if (hasBuff(debuffs, 'curse')) {
      hp = Math.floor(hp / 2);
    }
    
    // 광기: 효과 2배
    if (hasBuff(buffs, 'frenzy')) {
      hp = hp * 2;
    }
    
    // 콤보 보너스 적용
    const comboBonus = COMBO_BONUSES[Math.min(combo.count, 5)] ?? 0;
    if (comboBonus > 0) {
      hp = Math.floor(hp * (1 + comboBonus));
    }
  }
  
  return hp;
}

// 고도 변화 적용 (버프/디버프)
export function applyAltitudeModifiers(
  baseAltitude: number,
  buffs: ActiveBuff[],
  debuffs: ActiveBuff[]
): number {
  let altitude = baseAltitude;
  
  // 하이퍼: 고도 상승 +100%
  if (baseAltitude > 0 && hasBuff(buffs, 'hyper')) {
    altitude = altitude * 2;
  }
  
  // 슬로우: 고도 상승 -50%
  if (baseAltitude > 0 && hasBuff(debuffs, 'slow')) {
    altitude = Math.floor(altitude / 2);
  }
  
  // 광기: 효과 2배
  if (hasBuff(buffs, 'frenzy')) {
    altitude = altitude * 2;
  }
  
  return altitude;
}

// HP 감소율 계산 (버프/디버프 적용)
export function getHpDecreaseRate(
  baseRate: number,
  buffs: ActiveBuff[],
  debuffs: ActiveBuff[]
): number {
  let rate = baseRate;
  
  // 존버: HP 감소 완전 중지
  if (hasBuff(buffs, 'zen')) {
    return 0;
  }
  
  // 갓생모드: HP 감소 -50%
  if (hasBuff(buffs, 'godlife')) {
    rate = rate / 2;
  }
  
  // 멘붕: HP 감소 +50%
  if (hasBuff(debuffs, 'panic')) {
    rate = rate * 1.5;
  }
  
  return rate;
}

// 고도 상승율 계산 (버프/디버프 적용)
export function getAltitudeIncreaseRate(
  baseRate: number,
  buffs: ActiveBuff[],
  debuffs: ActiveBuff[]
): number {
  let rate = baseRate;
  
  // 하이퍼: 고도 상승 +100%
  if (hasBuff(buffs, 'hyper')) {
    rate = rate * 2;
  }
  
  // 슬로우: 고도 상승 -50%
  if (hasBuff(debuffs, 'slow')) {
    rate = rate / 2;
  }
  
  return rate;
}

// 버프/디버프 분리
export function separateBuffsAndDebuffs(buffs: ActiveBuff[]): {
  buffs: ActiveBuff[];
  debuffs: ActiveBuff[];
} {
  const activeBuffs: ActiveBuff[] = [];
  const activeDebuffs: ActiveBuff[] = [];
  
  for (const buff of buffs) {
    const config = BUFF_CONFIGS[buff.type];
    if (config.isDebuff) {
      activeDebuffs.push(buff);
    } else {
      activeBuffs.push(buff);
    }
  }
  
  return { buffs: activeBuffs, debuffs: activeDebuffs };
}
