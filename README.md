# 정상까지: Summit Survivor

> 제한 시간 2분 안에 3,000m 정상에 도달하는 웹 기반 **타임어택 생존 클리커** 게임.
> 이동 조작은 없다. 오직 **빠른 판단과 체력 관리**로 살아남는다.

🎮 **지금 플레이: [summit-survivor.vercel.app](https://summit-survivor.vercel.app/)**

히말라야를 자동으로 등반하며, 1.5초마다 등장하는 아이템을 선택하거나 피해
정상까지 버티는 미니게임입니다. PC/모바일 반응형으로 동작합니다.

---

## 게임 개요

| 항목 | 내용 |
|---|---|
| 장르 | 2분 타임어택 생존 클리커 |
| 목표 | 제한 시간(2분) 내 고도 3,000m 정상 도달 |
| 패배 | HP가 0이 되면 즉시 게임 오버 |
| 핵심 재미 | 복잡한 조작이 아닌 "빠른 판단 + 두뇌 회전 + 체력 관리" |
| 플랫폼 | 웹 브라우저 (PC / 모바일 반응형) |

---

## 게임 방식

캐릭터는 **자동으로 등반**하므로 이동 조작은 없습니다. 플레이어는 오직 **선택**에 집중합니다.

- **HP 100에서 시작** (최대 120), 시간이 흐르면 자동으로 감소합니다.
- **1.5초마다 아이템/이벤트가 등장**하고, 그 안에 선택하지 않으면 자동으로 무시됩니다.
- 아이템은 세 종류입니다:
  - ✓ **긍정 아이템** — HP 회복
  - ✗ **부정 아이템** — HP 감소
  - ? **랜덤 아이템** — 운에 맡기기
- **HP가 0이 되면 즉시 게임 오버**, 2분 안에 3,000m에 도달하면 승리합니다.
- 클릭 또는 터치로 한 번에 선택할 수 있어 모바일에서도 바로 플레이됩니다.

플레이 흐름: **메인 화면 → 등반(생존 루프) → 결과 화면(점수) → 리더보드 / 재시작**

---

## 점수 산식

최종 점수는 다음을 합산합니다 (`src/lib/score.ts`):

| 항목 | 계산 |
|---|---|
| 기본 점수 | 도달 고도 (최대 3,000) |
| 시간 보너스 | 남은 시간 × 10 *(승리 시에만)* |
| HP 보너스 | 남은 HP × 5 |
| 수집 보너스 | 긍정 아이템 × 50 + 랜덤 아이템 × 30 |
| 승리 보너스 | 정상 도달 시 +1,000 |

점수는 리더보드(Supabase)에 기록할 수 있습니다.

---

## 기술 스택

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Zustand** — 상태 관리 (타이머 / 이벤트 큐 / HP / 진행도 분리)
- **Tailwind CSS** + 커스텀 픽셀 디자인 시스템 (`src/design-system`)
- **Supabase** — 리더보드 / 점수 저장 (선택적, 미설정 시 게임은 정상 동작하고 리더보드만 비활성)
- 배포: **Vercel** → https://summit-survivor.vercel.app/

---

## 시작하기

### 사전 요구사항
- Node.js 18+ 및 npm

### 설치 및 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:3000)
```

### 빌드 / 배포

```bash
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

### 환경 변수 (`.env.local`)

```bash
# Supabase 리더보드 (선택) — 미설정 시 리더보드 API는 503 반환, 게임은 정상 동작
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (game)/              # 게임 화면 라우트 그룹
│   │   ├── page.tsx         #   메인 게임 화면
│   │   └── leaderboard/     #   리더보드 페이지
│   ├── api/
│   │   ├── scores/          # 점수 제출 API (POST)
│   │   └── leaderboard/     # 리더보드 조회 API (GET)
│   └── layout.tsx
├── components/
│   ├── game/                # 게임 UI (StatusBar, ClimbingVisual, EventDisplay 등)
│   └── screens/             # Main / Result / Leaderboard 화면
├── stores/                  # Zustand 게임 상태
├── hooks/                   # useGameLoop / useTimer
├── lib/                     # score / combo / buff / event-generator / supabase
├── data/                    # 아이템·이벤트 데이터
├── design-system/           # 픽셀 디자인 시스템 (tokens / utilities)
└── types/                   # 타입 정의

specs/                       # 스펙 주도 개발(SDD) 문서
```

> 참고: 코드베이스에는 장비 기반 생존 로그라이트로의 리디자인
> ([`specs/004`](specs/004-equipment-survival-redesign/design.md))이 기능 플래그
> `NEXT_PUBLIC_REDESIGN` 뒤에서 개발 중입니다. **현재 배포본은 위에서 설명한
> 클리커 모드로 동작합니다.**

---

## 개발 방식

본 프로젝트는 **스펙 주도 개발(Spec-Driven Development)** 방식으로 진행됩니다.
각 기능은 `specs/` 아래에 spec → plan → data-model → tasks 순으로 문서화한 뒤
구현합니다.

---

## 크레딧 / 라이선스

아트 에셋은 [Kenney](https://kenney.nl) (CC0)를 사용합니다.
자세한 출처는 [`CREDITS.md`](CREDITS.md)를 참고하세요.
