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

## Backend Database (PostgreSQL)

### LeaderboardEntry

리더보드 엔트리

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | `UUID` | PRIMARY KEY | 고유 식별자 |
| player_name | `VARCHAR(50)` | NOT NULL | 플레이어 이름 |
| score | `INTEGER` | NOT NULL | 최종 점수 |
| altitude | `INTEGER` | NOT NULL | 도달 고도 |
| cleared | `BOOLEAN` | NOT NULL | 정상 도달 여부 |
| survival_time | `INTEGER` | NOT NULL | 생존 시간 (초) |
| items_collected | `INTEGER` | NOT NULL | 획득 아이템 수 |
| remaining_hp | `INTEGER` | NOT NULL | 남은 HP |
| created_at | `TIMESTAMP` | DEFAULT NOW() | 기록 시간 |

**Indexes**:
- `idx_leaderboard_score` on (score DESC)
- `idx_leaderboard_player` on (player_name)

**Prisma Schema**:
```prisma
model LeaderboardEntry {
  id             String   @id @default(uuid())
  playerName     String   @map("player_name") @db.VarChar(50)
  score          Int
  altitude       Int
  cleared        Boolean
  survivalTime   Int      @map("survival_time")
  itemsCollected Int      @map("items_collected")
  remainingHp    Int      @map("remaining_hp")
  createdAt      DateTime @default(now()) @map("created_at")

  @@index([score(sort: Desc)])
  @@index([playerName])
  @@map("leaderboard_entries")
}
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
│   GameState     │ (Frontend - Runtime)
│─────────────────│
│ • status        │
│ • hp            │
│ • altitude      │
│ • timeRemaining │
│ • currentEvent ─┼───► GameEvent
│ • score         │
└────────┬────────┘
         │
         │ Game Over
         ▼
┌─────────────────┐
│ LeaderboardEntry│ (Backend - Persistent)
│─────────────────│
│ • playerName    │
│ • score         │
│ • altitude      │
│ • cleared       │
└─────────────────┘
```
