# Data Model: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02

## Frontend State (Zustand Store)

### GameState

게임의 전체 상태를 관리하는 핵심 엔티티

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| status | `'idle' \| 'playing' \| 'victory' \| 'defeat'` | 게임 상태 | `'idle'` |
| hp | `number` | 현재 체력 (0-100) | `100` |
| altitude | `number` | 현재 고도 (0-3000m) | `0` |
| timeRemaining | `number` | 남은 시간 (초) | `120` |
| currentEvent | `GameEvent \| null` | 현재 표시된 이벤트 | `null` |
| eventTimeRemaining | `number` | 현재 이벤트 남은 시간 (초) | `1.5` |
| itemsCollected | `number` | 획득한 아이템 수 | `0` |
| score | `number` | 최종 점수 | `0` |
| playerName | `string` | 플레이어 이름 | `''` |

**Validation Rules**:
- `hp`: 0 이하 시 게임 오버 (defeat)
- `altitude`: 3000 도달 시 승리 (victory)
- `timeRemaining`: 0 도달 시 게임 종료 (결과에 따라 victory/defeat)
- `eventTimeRemaining`: 0 도달 시 이벤트 자동 스킵 및 새 이벤트 생성

**State Transitions**:
```
idle → playing (startGame)
playing → victory (altitude >= 3000 OR timeRemaining <= 0 && altitude >= 3000)
playing → defeat (hp <= 0 OR timeRemaining <= 0 && altitude < 3000)
victory/defeat → idle (restart)
```

---

### GameEvent

1.5초마다 발생하는 이벤트/아이템

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | 고유 식별자 |
| name | `string` | 표시 이름 (예: '식량', '낙석') |
| type | `'positive' \| 'negative' \| 'random'` | 이벤트 종류 |
| effect | `EventEffect` | 효과 정의 |
| description | `string` | 이벤트 설명 |

---

### EventEffect

이벤트가 적용하는 효과

| Field | Type | Description |
|-------|------|-------------|
| hp | `number \| undefined` | HP 변화량 (+/-) |
| special | `string \| undefined` | 특수 효과 ID |

**Special Effects** (랜덤 아이템):
- `'chest'`: 50% 확률로 HP +30 또는 -30
- `'mushroom'`: 50% 확률로 HP +25 또는 -20
- `'unknown'`: 33% 확률로 HP +40, -40, 또는 효과 없음

---

### ItemDefinition

아이템 정의 (정적 데이터)

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | 고유 식별자 |
| name | `string` | 표시 이름 |
| type | `'positive' \| 'negative' \| 'random'` | 아이템 종류 |
| effect | `EventEffect` | 효과 정의 |
| weight | `number` | 출현 가중치 |
| icon | `string` | 아이콘 (이모지 또는 에셋 경로) |

**Predefined Items**:

| ID | Name | Type | HP Effect | Weight | Icon |
|----|------|------|-----------|--------|------|
| food | 식량 | positive | +15 | 15 | 🍖 |
| water | 물 | positive | +10 | 15 | 💧 |
| tent | 텐트 | positive | +20 | 15 | ⛺ |
| rockfall | 낙석 | negative | -20 | 12 | 🪨 |
| storm | 폭풍 | negative | -15 | 12 | 🌨️ |
| injury | 부상 | negative | -25 | 11 | 🩹 |
| chest | 보물상자 | random | ±30 | 7 | 📦 |
| mushroom | 버섯 | random | +25/-20 | 7 | 🍄 |
| unknown | 미확인 물품 | random | ±40/0 | 6 | ❓ |

**총 가중치**: 100 (긍정 45, 부정 35, 랜덤 20)

---

## Backend Database (Supabase PostgreSQL)

### scores 테이블

리더보드 엔트리 저장

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | 고유 식별자 |
| player_name | `VARCHAR(50)` | NOT NULL | 플레이어 이름 |
| score | `INTEGER` | NOT NULL | 최종 점수 |
| altitude | `INTEGER` | NOT NULL, CHECK (0 <= altitude <= 3000) | 도달 고도 |
| cleared | `BOOLEAN` | NOT NULL, DEFAULT false | 정상 도달 여부 |
| survival_time_seconds | `INTEGER` | NOT NULL, CHECK (0 <= survival_time_seconds <= 120) | 생존 시간 (초) |
| items_collected | `INTEGER` | NOT NULL, CHECK (items_collected >= 0) | 획득 아이템 수 |
| remaining_hp | `INTEGER` | NOT NULL, CHECK (0 <= remaining_hp <= 100) | 남은 HP |
| created_at | `TIMESTAMPTZ` | DEFAULT NOW() | 기록 시간 |

**Indexes**:
- `idx_scores_score` on (score DESC)
- `idx_scores_player` on (player_name)

**Row Level Security (RLS)**:
- SELECT: 모든 사용자 허용 (리더보드 조회)
- INSERT: 모든 사용자 허용 (점수 제출)

**SQL Schema** (Supabase SQL Editor에서 실행):
```sql
-- scores 테이블 생성
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name VARCHAR(50) NOT NULL,
  items_collected INTEGER NOT NULL CHECK (items_collected >= 0),
  survival_time_seconds INTEGER NOT NULL CHECK (survival_time_seconds >= 0 AND survival_time_seconds <= 120),
  remaining_hp INTEGER NOT NULL CHECK (remaining_hp >= 0 AND remaining_hp <= 100),
  altitude INTEGER NOT NULL CHECK (altitude >= 0 AND altitude <= 3000),
  cleared BOOLEAN NOT NULL DEFAULT false,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 점수 기준 인덱스 (내림차순)
CREATE INDEX idx_scores_score ON scores(score DESC);

-- 플레이어 이름 기준 인덱스
CREATE INDEX idx_scores_player ON scores(player_name);

-- Row Level Security 활성화
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 점수 조회 가능
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  USING (true);

-- 모든 사용자가 점수 제출 가능
CREATE POLICY "Anyone can insert scores"
  ON scores FOR INSERT
  WITH CHECK (true);
```

**TypeScript Types** (Supabase에서 자동 생성):
```typescript
export interface Score {
  id: string;
  player_name: string;
  score: number;
  altitude: number;
  cleared: boolean;
  survival_time_seconds: number;
  items_collected: number;
  remaining_hp: number;
  created_at: string;
}

export interface ScoreInsert {
  player_name: string;
  items_collected: number;
  survival_time_seconds: number;
  remaining_hp: number;
  altitude: number;
  cleared: boolean;
  score: number;
}
```

**Usage Example**:
```typescript
import { createClient } from '@/lib/supabase';

// 점수 제출
const { data, error } = await createClient()
  .from('scores')
  .insert({
    player_name: '산악인',
    score: 750,
    altitude: 3000,
    cleared: true,
    survival_time_seconds: 100,
    items_collected: 20,
    remaining_hp: 50
  })
  .select()
  .single();

// 리더보드 조회
const { data: leaderboard } = await createClient()
  .from('scores')
  .select('*')
  .order('score', { ascending: false })
  .limit(100);
```

---

## Score Calculation

```typescript
interface ScoreInput {
  itemsCollected: number;    // 획득 아이템 수
  survivalTimeSeconds: number; // 생존 시간 (초)
  remainingHp: number;       // 남은 HP
  reachedSummit: boolean;    // 정상 도달 여부
}

interface ScoreBreakdown {
  baseScore: number;      // itemsCollected * 10
  survivalBonus: number;  // survivalTimeSeconds * 2
  hpBonus: number;        // remainingHp * 3
  summitBonus: number;    // reachedSummit ? 200 : 0
  total: number;
}
```

**Formula**:
```
총점 = (아이템 수 × 10) + (생존 시간 × 2) + (남은 HP × 3) + (정상 도달 ? 200 : 0)
```

**예시 계산**:
- 아이템 20개, 생존 100초, HP 50, 정상 도달
- = (20 × 10) + (100 × 2) + (50 × 3) + 200
- = 200 + 200 + 150 + 200 = **750점**

---

## Entity Relationships

```
┌─────────────────┐
│   GameState     │ (Frontend - Zustand Store)
│─────────────────│
│ • status        │
│ • hp            │
│ • altitude      │
│ • timeRemaining │
│ • currentEvent ─┼───► GameEvent
│ • score         │
└────────┬────────┘
         │
         │ Game Over (API Request)
         ▼
┌─────────────────┐
│  scores table   │ (Supabase - PostgreSQL)
│─────────────────│
│ • player_name   │
│ • score         │
│ • altitude      │
│ • cleared       │
└─────────────────┘
```

**Data Flow**:
1. **게임 플레이** (클라이언트): GameState에서 모든 로직 실행
2. **게임 종료**: 점수 계산 후 `POST /api/scores`로 제출
3. **API Route**: Next.js API Route에서 점수 검증 및 Supabase에 저장
4. **리더보드 조회**: `GET /api/leaderboard`로 Supabase에서 데이터 조회
