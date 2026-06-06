# 구현 계획 — 장비 생존 리디자인 (충돌 없는 협업)

> 목적: design.md를 두 사람(**A / B**)이 **머지 충돌 없이 병렬 구현**하도록 작업을 나눈다.
> 원칙 한 줄: **충돌은 "코드를 많이 고쳐서"가 아니라 "같은 파일을 같이 고쳐서" 난다 → 파일 소유권을 안 겹치게 나눈다.**

---

## 0. 3대 원칙

1. **계약(contract) 먼저** — 타입/시그니처를 한 번에 합의·커밋. 이후 거의 안 바뀜. (`src/types/redesign.ts`)
2. **세로로 쪼개기** — 레이어(프론트/백)가 아니라 **시스템별**로. 각자 *파일/폴더*를 소유.
3. **핫스팟 분해** — 단일 `gameStore`를 **Zustand 슬라이스**로 쪼개 각자 자기 슬라이스 파일만 편집.

---

## 1. ✅ Phase 0 — 이미 완료된 골격 (이 커밋)

둘이 바로 출발할 수 있도록 **계약 + 빈 슬라이스 + 스토어 조합 + 기능 플래그**가 이미 들어가 있다. `npx tsc --noEmit` 통과, 플래그 ON 시 end-to-end 동작 확인.

```
src/types/redesign.ts          ← 공유 계약 (타입·상수·슬라이스 인터페이스)  [공유, 변경은 별도 PR]
src/lib/featureFlags.ts        ← FEATURES.redesign 스위치
src/stores/redesignStore.ts    ← 슬라이스 조합만 (거의 안 바뀜)
src/stores/slices/
  climbSlice.ts        (A)  등반/HP/드레인/마스터 틱   ← 배관 구현 완료
  equipmentSlice.ts    (A)  장착/파생스탯(캡120)       ← 구현 완료
  hazardSlice.ts       (A)  위협 발생 타이밍           ← 배관 구현, 선택/적용 TODO(A)
  consumableSlice.ts   (B)  자동 줍기/회복/방어        ← 기본 구현, 정책 TODO(B)
  choiceSlice.ts       (B)  500m 멈춤·선택            ← 배관 구현, 카드 생성 TODO(B)
  metaSlice.ts         (B)  status/score/시작·리셋     ← 구현 완료
src/data/redesign/
  equipment.ts   (A) / consumables.ts (B) / hazards.ts (A)   ← 예시 일부 + TODO
src/components/game/RedesignGame.tsx  (B)  마운트 스텁(WIP 화면)
src/app/page.tsx                       ← 플래그 분기 (라이브 진입점)
```

### 켜는 법
`.env.local` 에 `NEXT_PUBLIC_REDESIGN=1` → `/` 가 리디자인으로 분기. 미설정 시 기존 게임 그대로.

---

## 2. 작업 분할 (소유권 맵)

| 영역 | 파일 | 소유 |
|---|---|---|
| 등반 코어(속도/드레인/틱) | `slices/climbSlice.ts` | **A** |
| 장비 시스템 | `slices/equipmentSlice.ts`, `data/redesign/equipment.ts`, `lib/equipment.ts`* | **A** |
| 위협 시스템 | `slices/hazardSlice.ts`, `data/redesign/hazards.ts` | **A** |
| 소비 시스템 | `slices/consumableSlice.ts`, `data/redesign/consumables.ts` | **B** |
| 빌드 선택 + 멈춤 | `slices/choiceSlice.ts`, `components/game/BuildChoice.tsx`* | **B** |
| 비주얼/HUD(하트·페이퍼돌) | `components/game/RedesignGame.tsx`, `RedesignHud.tsx`*, `ClimbingVisual` | **B** |

`*` = 아직 없음, 해당 소유자가 새로 생성. **한 파일은 한 사람만.**
(A/B 배정은 선호대로 교체 가능 — 단 슬라이스 단위로 통째 가져가기.)

### 데이터 파일은 병렬화 최적
`data/redesign/*` 는 design.md 수치를 옮겨적는 작업이라 **파일이 분리돼 충돌이 없음.** 막힐 때 서로 채우기 좋다. 수치 변경 시 **design.md 해당 표도 같이 수정**(단일 진실원).

---

## 3. 계약(슬라이스 간 호출) — 이미 `redesign.ts`에 고정됨

슬라이스는 서로 **함수 시그니처로만** 통신한다(상대 구현이 비어 있어도 import 가능 → 동시 시작 가능):

| 호출하는 쪽 | 호출 | 제공: 소유 |
|---|---|---|
| climb.tick | `getDerivedStats()` | equipment (A) |
| climb.tick | `tickHazards(dt)`, `maybeSpawnHazard(dt)` | hazard (A) |
| climb.tick | `autoUseHeal()` | consumable (B) |
| climb.tick | `maybeOpenChoice(altitude)` | choice (B) |
| climb.tick | `checkEnd()` | meta (B) |
| hazard | `autoUseDefense(hazard)` → 0~1, `damage(n)` | consumable (B), climb (A) |
| choice.pickCard | `equip(def)` | equipment (A) |

> **틱 오케스트레이션 순서**(climbSlice.tick)도 계약의 일부. 바꾸려면 합의.

---

## 4. 순서

- **Phase 0 ✅** (이 커밋): 계약 + 골격 + 플래그.
- **Phase 1 (병렬)**: 각자 TODO(소유자) 채우기.
  - A: 위협 선택/적용(`resolveHazard`), 위협·장비 데이터 완성, 게임 루프(`useGameLoop` 확장).
  - B: 빌드 카드 생성·UI(`BuildChoice`), 소비 정책·데이터, HUD(하트/페이퍼돌).
- **Phase 2 (통합)**: 플래그로 신/구 전환하며 점진 검증 → 안정되면 레거시 제거 + 플래그 기본 ON.

---

## 5. Git 워크플로

1. 통합 브랜치 `feature/equipment-redesign` (develop에서 분기).
2. 각자 짧은 서브브랜치 → **작은 PR 자주** → 통합 브랜치로 머지.
3. PR 전 통합 브랜치 위로 **rebase**.
4. **공유 파일**(`types/redesign.ts`, `redesignStore.ts`, 상수)을 고쳐야 하면
   → **별도의 작은 "계약 변경" PR 먼저** 머지하고 둘 다 rebase. 기능 PR에 섞지 않기.
5. 한 파일 = 한 소유자. (`.github/CODEOWNERS` 권장)

### CODEOWNERS 예시
```
/src/stores/slices/climbSlice.ts      @userA
/src/stores/slices/equipmentSlice.ts  @userA
/src/stores/slices/hazardSlice.ts     @userA
/src/data/redesign/equipment.ts       @userA
/src/data/redesign/hazards.ts         @userA
/src/stores/slices/consumableSlice.ts @userB
/src/stores/slices/choiceSlice.ts     @userB
/src/data/redesign/consumables.ts     @userB
/src/components/game/RedesignGame.tsx @userB
```

---

## 6. "한 명이 많이 고쳐서 못 시작" 문제의 해법 (요약)

- 계약을 **먼저 고정** → 상대 구현이 비어도 내 쪽 시작 가능.
- **슬라이스로 핫스팟 분해** → `gameStore` 한 파일을 같이 안 만짐.
- **플래그 뒤에서 작업** → 미완성도 머지 가능, 자주 머지 → 충돌이 작음.
- 바이브코딩해도 **내 소유 파일 안에서만** → 충돌 0.

---

## 7. 열린 항목

- `lib/equipment.ts` 등 헬퍼 분리 여부(슬라이스가 커지면).
- `app/page.tsx` 와 `app/(game)/page.tsx` 가 둘 다 `/` 로 해석됨 → **라우트 정리 필요**(레거시 (game) 페이지 제거 검토). 현재 라이브는 `app/page.tsx`.
- 게임 루프: 레거시 `useGameLoop` 확장 vs 리디자인 전용 루프(현재 `RedesignGame` 내 임시 rAF).
```
