# API Contracts: 정상까지 (Summit Survivor)

**Feature**: 001-himalaya-clicker-survival
**Date**: 2026-06-02
**Base URL**: `/api`
**Backend**: Next.js API Routes + Supabase

## Overview

리더보드 관련 REST API 명세. 게임 로직은 클라이언트에서 처리하고, 서버는 점수 저장/조회만 담당. Next.js API Routes를 통해 Supabase와 통신.

---

## API Routes 구조

```text
app/api/
├── scores/
│   └── route.ts           # POST /api/scores
└── leaderboard/
    ├── route.ts           # GET /api/leaderboard
    └── [playerName]/
        └── route.ts       # GET /api/leaderboard/:playerName
```

---

## Endpoints

### POST /api/scores

점수 제출

**Implementation**: `app/api/scores/route.ts`

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

**Implementation Example**:
```typescript
// app/api/scores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  
  // 점수 계산 (서버에서)
  const score = calculateScore(body);
  
  // Supabase에 저장
  const { data, error } = await supabase
    .from('scores')
    .insert({ ...body, score })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: { code: 'INSERT_FAILED', message: error.message } },
      { status: 500 }
    );
  }
  
  return NextResponse.json(data, { status: 201 });
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

**Implementation**: `app/api/leaderboard/route.ts`

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

**Implementation Example**:
```typescript
// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const { data, error, count } = await supabase
    .from('scores')
    .select('*', { count: 'exact' })
    .order('score', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    return NextResponse.json(
      { error: { code: 'QUERY_FAILED', message: error.message } },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    entries: data,
    total: count || 0
  });
}
```

---

### GET /api/leaderboard/player/:playerName

특정 플레이어 기록 조회

**Implementation**: `app/api/leaderboard/[playerName]/route.ts`

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

**Implementation Example**:
```typescript
// app/api/leaderboard/[playerName]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerName: string } }
) {
  const supabase = createClient();
  const playerName = decodeURIComponent(params.playerName);
  
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('player_name', playerName)
    .order('score', { ascending: false });
  
  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { error: { code: 'PLAYER_NOT_FOUND', message: 'Player not found' } },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    playerName,
    bestScore: data[0].score,
    bestRank: await getRank(supabase, data[0].score),
    totalGames: data.length,
    records: data
  });
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

Next.js API Routes는 기본적으로 같은 도메인에서의 요청만 허용합니다. 
외부 도메인에서 접근이 필요한 경우 `middleware.ts` 또는 각 route에서 CORS 헤더를 설정하세요.

**Option 1: Global Middleware** (`middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

**Option 2: Per-Route** (각 `route.ts`에 추가)

```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

**Note**: 프로덕션에서는 `*` 대신 특정 도메인만 허용하도록 변경 필요

```typescript
// 프로덕션 예시
const allowedOrigins = ['https://your-domain.com'];
const origin = request.headers.get('origin');

if (origin && allowedOrigins.includes(origin)) {
  response.headers.set('Access-Control-Allow-Origin', origin);
}
```

---

## Environment Variables

### Development (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Production (Vercel)

Vercel 대시보드 → Project Settings → Environment Variables에서 설정:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note**: `NEXT_PUBLIC_` 접두사가 있는 환경 변수는 클라이언트에 노출되므로, 민감한 정보는 서버 전용 환경 변수로 관리하세요.

---

## Supabase Client Setup

**Implementation**: `lib/supabase.ts`

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
```

**Usage in API Route**:

```typescript
import { createClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('scores').select('*');
  // ...
}
```
