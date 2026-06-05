# CSS API Contract: 픽셀 디자인 시스템

**Version**: 1.0.0
**Date**: 2026-06-05

## 개요

이 문서는 픽셀 디자인 시스템의 CSS API 계약을 정의합니다. 모든 CSS 클래스, 변수, 유틸리티는 이 계약을 따릅니다.

---

## 1. CSS Custom Properties (변수)

### 1.1 색상 변수

```css
/* 기본 색상 */
--color-primary: <color>
--color-primary-light: <color>
--color-primary-dark: <color>
--color-secondary: <color>
--color-background: <color>
--color-surface: <color>
--color-accent: <color>

/* 시맨틱 색상 */
--color-positive: <color>
--color-positive-dark: <color>
--color-negative: <color>
--color-negative-dark: <color>
--color-random: <color>
--color-random-alt: <color>

/* HP 상태 색상 */
--color-hp-high: <color>
--color-hp-medium: <color>
--color-hp-low: <color>
--color-hp-critical: <color>

/* 텍스트 색상 */
--color-text-primary: <color>
--color-text-secondary: <color>
--color-text-disabled: <color>

/* 테두리 색상 */
--color-border: <color>
--color-border-accent: <color>
```

### 1.2 타이포그래피 변수

```css
/* 폰트 패밀리 */
--font-display: <font-family>
--font-body: <font-family>
--font-korean: <font-family>

/* 폰트 크기 */
--text-xs: <length>      /* 8px */
--text-sm: <length>      /* 12px */
--text-base: <length>    /* 16px */
--text-lg: <length>      /* 20px */
--text-xl: <length>      /* 24px */
--text-2xl: <length>     /* 32px */
--text-3xl: <length>     /* 48px */
```

### 1.3 스페이싱 변수

```css
--space-0: <length>      /* 0px */
--space-1: <length>      /* 4px */
--space-2: <length>      /* 8px */
--space-3: <length>      /* 12px */
--space-4: <length>      /* 16px */
--space-5: <length>      /* 24px */
--space-6: <length>      /* 32px */
--space-7: <length>      /* 48px */
--space-8: <length>      /* 64px */
```

### 1.4 애니메이션 변수

```css
/* 지속시간 */
--duration-instant: <time>   /* 50ms */
--duration-fast: <time>      /* 100ms */
--duration-normal: <time>    /* 200ms */
--duration-slow: <time>      /* 300ms */
--duration-event: <time>     /* 1500ms */

/* 이징 */
--ease-step: <timing-function>
--ease-step-smooth: <timing-function>
--ease-bounce: <timing-function>
--ease-linear: <timing-function>
```

### 1.5 레이아웃 변수

```css
--pixel-scale: <number>      /* 1, 2, 3, 4 */
--bp-mobile: <length>        /* 480px */
--bp-tablet: <length>        /* 768px */
--bp-desktop: <length>       /* 1024px */
--bp-wide: <length>          /* 1440px */
```

---

## 2. 컴포넌트 클래스

### 2.1 Button

**기본 클래스**: `.pixel-btn`

**Modifier 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-btn--primary` | 주요 버튼 (기본) |
| `.pixel-btn--secondary` | 보조 버튼 |
| `.pixel-btn--danger` | 위험/취소 버튼 |
| `.pixel-btn--ghost` | 배경 없는 버튼 |
| `.pixel-btn--sm` | 작은 크기 (32px) |
| `.pixel-btn--md` | 중간 크기 (40px, 기본) |
| `.pixel-btn--lg` | 큰 크기 (48px) |
| `.pixel-btn--full` | 전체 너비 |
| `.pixel-btn--disabled` | 비활성 상태 |

**사용 예시**:
```html
<button class="pixel-btn pixel-btn--primary pixel-btn--lg">
  시작하기
</button>
```

### 2.2 ProgressBar

**기본 클래스**: `.pixel-progress`

**구조**:
```html
<div class="pixel-progress pixel-progress--hp">
  <div class="pixel-progress__fill" style="width: 75%"></div>
  <span class="pixel-progress__label">75/100</span>
</div>
```

**Modifier 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-progress--hp` | HP 바 (색상 자동 변경) |
| `.pixel-progress--altitude` | 고도 바 |
| `.pixel-progress--timer` | 타이머 바 |
| `.pixel-progress--animated` | 애니메이션 활성화 |

**자식 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-progress__fill` | 채워진 영역 |
| `.pixel-progress__label` | 텍스트 레이블 |

### 2.3 Card

**기본 클래스**: `.pixel-card`

**구조**:
```html
<div class="pixel-card pixel-card--item pixel-card--positive">
  <div class="pixel-card__icon">
    <span class="pixel-icon pixel-icon--food"></span>
  </div>
  <div class="pixel-card__content">
    <h3 class="pixel-card__title">식량</h3>
    <p class="pixel-card__desc">HP +20</p>
  </div>
</div>
```

**Modifier 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-card--item` | 아이템 카드 |
| `.pixel-card--result` | 결과 카드 |
| `.pixel-card--panel` | 패널 카드 |
| `.pixel-card--positive` | 긍정 아이템 스타일 |
| `.pixel-card--negative` | 부정 아이템 스타일 |
| `.pixel-card--random` | 랜덤 아이템 스타일 |
| `.pixel-card--clickable` | 클릭 가능 |
| `.pixel-card--selected` | 선택됨 |

**자식 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-card__icon` | 아이콘 영역 |
| `.pixel-card__content` | 콘텐츠 영역 |
| `.pixel-card__title` | 제목 |
| `.pixel-card__desc` | 설명 |

### 2.4 Modal

**기본 클래스**: `.pixel-modal`

**구조**:
```html
<div class="pixel-modal pixel-modal--open">
  <div class="pixel-modal__overlay"></div>
  <div class="pixel-modal__container">
    <div class="pixel-modal__header">
      <h2 class="pixel-modal__title">게임 결과</h2>
    </div>
    <div class="pixel-modal__body">
      <!-- 콘텐츠 -->
    </div>
    <div class="pixel-modal__footer">
      <button class="pixel-btn">다시 시작</button>
    </div>
  </div>
</div>
```

**Modifier 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-modal--open` | 열림 상태 |
| `.pixel-modal--result` | 결과 모달 |
| `.pixel-modal--confirm` | 확인 모달 |
| `.pixel-modal--info` | 정보 모달 |

### 2.5 Tooltip

**기본 클래스**: `.pixel-tooltip`

**사용**:
```html
<span class="pixel-tooltip" data-tooltip="HP가 회복됩니다">
  식량
</span>
```

**Modifier 클래스**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-tooltip--top` | 위에 표시 (기본) |
| `.pixel-tooltip--bottom` | 아래에 표시 |
| `.pixel-tooltip--left` | 왼쪽에 표시 |
| `.pixel-tooltip--right` | 오른쪽에 표시 |

---

## 3. 아이콘 클래스

**기본 클래스**: `.pixel-icon`

**크기 Modifier**:
| 클래스 | 설명 |
|--------|------|
| `.pixel-icon--sm` | 16x16px |
| `.pixel-icon--md` | 32x32px (기본) |
| `.pixel-icon--lg` | 48x48px |

**아이콘 Modifier**:
| 클래스 | 아이콘 |
|--------|--------|
| `.pixel-icon--food` | 식량 |
| `.pixel-icon--water` | 물 |
| `.pixel-icon--tent` | 텐트 |
| `.pixel-icon--rockfall` | 낙석 |
| `.pixel-icon--storm` | 폭풍 |
| `.pixel-icon--injury` | 부상 |
| `.pixel-icon--treasure` | 보물상자 |
| `.pixel-icon--mushroom` | 버섯 |
| `.pixel-icon--unknown` | 미확인 |
| `.pixel-icon--hp` | 체력 |
| `.pixel-icon--timer` | 타이머 |
| `.pixel-icon--altitude` | 고도 |

**사용 예시**:
```html
<span class="pixel-icon pixel-icon--food pixel-icon--lg"></span>
```

---

## 4. 유틸리티 클래스

### 4.1 텍스트

| 클래스 | 설명 |
|--------|------|
| `.pixel-text-display` | 디스플레이 폰트 |
| `.pixel-text-body` | 본문 폰트 |
| `.pixel-text-number` | 숫자 폰트 (고정폭) |
| `.pixel-text-xs` | 매우 작은 크기 |
| `.pixel-text-sm` | 작은 크기 |
| `.pixel-text-base` | 기본 크기 |
| `.pixel-text-lg` | 큰 크기 |
| `.pixel-text-xl` | 매우 큰 크기 |
| `.pixel-text-center` | 가운데 정렬 |
| `.pixel-text-positive` | 긍정 색상 |
| `.pixel-text-negative` | 부정 색상 |
| `.pixel-text-accent` | 강조 색상 |

### 4.2 레이아웃

| 클래스 | 설명 |
|--------|------|
| `.pixel-container` | 픽셀 스케일 적용 컨테이너 |
| `.pixel-flex` | Flexbox 컨테이너 |
| `.pixel-grid` | Grid 컨테이너 |
| `.pixel-center` | 가운데 정렬 |

### 4.3 스페이싱

| 클래스 | 설명 |
|--------|------|
| `.pixel-m-{0-8}` | margin |
| `.pixel-mt-{0-8}` | margin-top |
| `.pixel-mb-{0-8}` | margin-bottom |
| `.pixel-ml-{0-8}` | margin-left |
| `.pixel-mr-{0-8}` | margin-right |
| `.pixel-p-{0-8}` | padding |
| `.pixel-pt-{0-8}` | padding-top |
| `.pixel-pb-{0-8}` | padding-bottom |
| `.pixel-pl-{0-8}` | padding-left |
| `.pixel-pr-{0-8}` | padding-right |

---

## 5. 애니메이션 클래스

| 클래스 | 설명 |
|--------|------|
| `.pixel-anim-appear` | 등장 애니메이션 |
| `.pixel-anim-disappear` | 퇴장 애니메이션 |
| `.pixel-anim-bounce` | 바운스 효과 |
| `.pixel-anim-pulse` | 깜빡임 효과 |
| `.pixel-anim-shake` | 흔들림 효과 |
| `.pixel-anim-pop` | 팝업 효과 (숫자 변화) |

---

## 6. 데이터 속성

| 속성 | 설명 | 예시 |
|------|------|------|
| `data-tooltip` | 툴팁 내용 | `data-tooltip="HP +20"` |
| `data-item-type` | 아이템 타입 | `data-item-type="positive"` |
| `data-hp-percent` | HP 퍼센트 | `data-hp-percent="75"` |

---

## 7. 반응형 Modifier

모든 유틸리티 클래스에 반응형 접두사 사용 가능:

| 접두사 | 브레이크포인트 |
|--------|--------------|
| (없음) | 모든 크기 |
| `sm:` | >= 480px |
| `md:` | >= 768px |
| `lg:` | >= 1024px |
| `xl:` | >= 1440px |

**사용 예시**:
```html
<div class="pixel-text-base md:pixel-text-lg lg:pixel-text-xl">
  반응형 텍스트
</div>
```

---

## 8. CSS 파일 진입점

### Import 방식

```css
/* 전체 시스템 */
@import 'pixel-design-system/index.css';

/* 개별 모듈 */
@import 'pixel-design-system/tokens/colors.css';
@import 'pixel-design-system/tokens/typography.css';
@import 'pixel-design-system/components/button.css';
```

### CDN 방식 (빌드 후)

```html
<link rel="stylesheet" href="pixel-design-system.min.css">
```

---

## 9. 버전 호환성

- 주요 버전 변경 시 Breaking Changes 문서화
- CSS 변수명 변경은 Major 버전 업데이트 필요
- 새 클래스 추가는 Minor 버전 업데이트
- 버그 수정은 Patch 버전 업데이트
