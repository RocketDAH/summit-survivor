# API Contracts: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02
**Base URL**: `/api`

## Overview

리더보드 관련 REST API 명세. 게임 로직은 클라이언트에서 처리하고, 서버는 점수 저장/조회만 담당.

---

## Endpoints

### POST /api/scores

점수 제출

**Request**:
```typescript
interface SubmitScoreRequest {
  playerName: string;        // 1-50자
  itemsCollected: number;    // 0 이상
  survivalTimeSeconds: number; // 0-120
  remainingHp: number;       // 0-100
  altitude: number;          // 0-3000
  cleared: boolean;          // 정상 도달 여부
}
```

**Example Request**:
```json
{
  "playerName": "산악인",
  "itemsCollected": 20,
  "survivalTimeSeconds": 100,
  "remainingHp": 50,
  "altitude": 3000,
  "cleared": true
}
```

**Response** (201 Created):
```typescript
interface SubmitScoreResponse {
  id: string;
  playerName: string;
  score: number;           // 서버에서 계산
  altitude: number;
  cleared: boolean;
  rank: number;            // 현재 순위
  createdAt: string;       // ISO 8601
}
```

**Example Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "playerName": "산악인",
  "score": 750,
  "altitude": 3000,
  "cleared": true,
  "rank": 42,
  "createdAt": "2026-06-02T15:30:00.000Z"
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_NAME` | playerName이 빈 문자열이거나 50자 초과 |
| 400 | `INVALID_DATA` | 필수 필드 누락 또는 범위 초과 |
| 429 | `RATE_LIMITED` | 분당 10회 초과 요청 |

---

### GET /api/leaderboard

리더보드 조회 (상위 100명)

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 100 | 조회할 최대 수 (1-100) |
| offset | number | 0 | 시작 위치 |

**Response** (200 OK):
```typescript
interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
}

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  altitude: number;
  cleared: boolean;
  createdAt: string;
}
```

**Example Response**:
```json
{
  "entries": [
    {
      "rank": 1,
      "playerName": "등산왕",
      "score": 980,
      "altitude": 3000,
      "cleared": true,
      "createdAt": "2026-06-02T14:00:00.000Z"
    },
    {
      "rank": 2,
      "playerName": "산악인",
      "score": 750,
      "altitude": 3000,
      "cleared": true,
      "createdAt": "2026-06-02T15:30:00.000Z"
    }
  ],
  "total": 1234
}
```

---

### GET /api/leaderboard/player/:playerName

특정 플레이어 기록 조회

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| playerName | string | 플레이어 이름 (URL 인코딩) |

**Response** (200 OK):
```typescript
interface PlayerRecordsResponse {
  playerName: string;
  bestScore: number;
  bestRank: number;
  totalGames: number;
  records: PlayerRecord[];
}

interface PlayerRecord {
  id: string;
  score: number;
  altitude: number;
  cleared: boolean;
  createdAt: string;
}
```

**Example Response**:
```json
{
  "playerName": "산악인",
  "bestScore": 750,
  "bestRank": 42,
  "totalGames": 15,
  "records": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "score": 750,
      "altitude": 3000,
      "cleared": true,
      "createdAt": "2026-06-02T15:30:00.000Z"
    }
  ]
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 404 | `PLAYER_NOT_FOUND` | 해당 이름의 플레이어 기록 없음 |

---

## Common Error Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

**Example**:
```json
{
  "error": {
    "code": "INVALID_NAME",
    "message": "Player name must be 1-50 characters",
    "details": {
      "provided": "",
      "minLength": 1,
      "maxLength": 50
    }
  }
}
```

---

## Rate Limiting

- **Limit**: 분당 10회 요청 (POST /api/scores)
- **Header**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response** (429):
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 45
    }
  }
}
```

---

## CORS Configuration

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Note: 프로덕션에서는 특정 도메인만 허용하도록 변경 필요
