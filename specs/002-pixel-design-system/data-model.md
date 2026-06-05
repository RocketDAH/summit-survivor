# Data Model: 픽셀 디자인 시스템

**Feature**: 002-pixel-design-system
**Date**: 2026-06-05

## 개요

이 문서는 픽셀 디자인 시스템의 디자인 토큰과 엔티티 구조를 정의합니다.

---

## 1. 색상 토큰 (Color Tokens)

### 1.1 기본 색상 (Base Colors)

| 토큰 이름 | CSS 변수 | HEX 값 | 용도 |
|----------|---------|--------|------|
| Primary | `--color-primary` | `#1a3a5c` | 산/하늘 배경, 주요 강조 |
| Primary Light | `--color-primary-light` | `#2d5a87` | 호버 상태 |
| Primary Dark | `--color-primary-dark` | `#0d1f33` | 그림자, 깊이 |
| Secondary | `--color-secondary` | `#e8f4fc` | 눈, 하이라이트 |
| Background | `--color-background` | `#0a1628` | 메인 배경 |
| Surface | `--color-surface` | `#152238` | 카드/패널 배경 |
| Accent | `--color-accent` | `#ffd700` | 정상 도달, 보상, 강조 |

### 1.2 시맨틱 색상 (Semantic Colors)

#### 아이템 타입별 색상
| 토큰 이름 | CSS 변수 | HEX 값 | 용도 |
|----------|---------|--------|------|
| Positive | `--color-positive` | `#4ade80` | 긍정 아이템 (HP 회복) |
| Positive Dark | `--color-positive-dark` | `#22c55e` | 긍정 아이템 강조 |
| Negative | `--color-negative` | `#ef4444` | 부정 아이템 (피해) |
| Negative Dark | `--color-negative-dark` | `#dc2626` | 부정 아이템 강조 |
| Random | `--color-random` | `#a855f7` | 랜덤 아이템 |
| Random Alt | `--color-random-alt` | `#facc15` | 랜덤 아이템 보조 |

#### HP 상태 색상
| 토큰 이름 | CSS 변수 | HEX 값 | 조건 |
|----------|---------|--------|------|
| HP High | `--color-hp-high` | `#4ade80` | HP >= 80% |
| HP Medium | `--color-hp-medium` | `#facc15` | 40% <= HP < 80% |
| HP Low | `--color-hp-low` | `#ef4444` | HP < 40% |
| HP Critical | `--color-hp-critical` | `#991b1b` | HP < 20% (깜빡임) |

### 1.3 UI 색상
| 토큰 이름 | CSS 변수 | HEX 값 | 용도 |
|----------|---------|--------|------|
| Text Primary | `--color-text-primary` | `#ffffff` | 주요 텍스트 |
| Text Secondary | `--color-text-secondary` | `#94a3b8` | 보조 텍스트 |
| Text Disabled | `--color-text-disabled` | `#475569` | 비활성 텍스트 |
| Border | `--color-border` | `#334155` | 테두리 |
| Border Accent | `--color-border-accent` | `#ffd700` | 강조 테두리 |

---

## 2. 타이포그래피 토큰 (Typography Tokens)

### 2.1 폰트 패밀리

| 토큰 이름 | CSS 변수 | 값 | 용도 |
|----------|---------|-----|------|
| Font Display | `--font-display` | `'Press Start 2P', monospace` | 제목, 점수 |
| Font Body | `--font-body` | `'VT323', monospace` | 본문, 설명 |
| Font Korean | `--font-korean` | `'DungGeunMo', monospace` | 한글 텍스트 |

### 2.2 폰트 크기 스케일

| 토큰 이름 | CSS 변수 | 값 | 용도 |
|----------|---------|-----|------|
| Text XS | `--text-xs` | `8px` | 매우 작은 텍스트 |
| Text SM | `--text-sm` | `12px` | 작은 텍스트, 캡션 |
| Text Base | `--text-base` | `16px` | 기본 텍스트 |
| Text LG | `--text-lg` | `20px` | 큰 텍스트 |
| Text XL | `--text-xl` | `24px` | 제목 |
| Text 2XL | `--text-2xl` | `32px` | 대형 제목 |
| Text 3XL | `--text-3xl` | `48px` | 점수, 결과 |

### 2.3 타이포그래피 스타일

```
Display Style (제목, 점수)
├── font-family: var(--font-display)
├── font-weight: 400
├── letter-spacing: 2px
└── text-transform: uppercase

Body Style (본문)
├── font-family: var(--font-body)
├── font-weight: 400
├── letter-spacing: 1px
└── line-height: 1.5

Number Style (숫자, 타이머)
├── font-family: var(--font-display)
├── font-variant-numeric: tabular-nums
├── font-weight: 400
└── letter-spacing: 0
```

---

## 3. 스페이싱 토큰 (Spacing Tokens)

8px 그리드 기반 시스템

| 토큰 이름 | CSS 변수 | 값 | 픽셀 그리드 |
|----------|---------|-----|-----------|
| Space 0 | `--space-0` | `0px` | 0 |
| Space 1 | `--space-1` | `4px` | 0.5 단위 |
| Space 2 | `--space-2` | `8px` | 1 단위 |
| Space 3 | `--space-3` | `12px` | 1.5 단위 |
| Space 4 | `--space-4` | `16px` | 2 단위 |
| Space 5 | `--space-5` | `24px` | 3 단위 |
| Space 6 | `--space-6` | `32px` | 4 단위 |
| Space 7 | `--space-7` | `48px` | 6 단위 |
| Space 8 | `--space-8` | `64px` | 8 단위 |

---

## 4. 애니메이션 토큰 (Animation Tokens)

### 4.1 지속시간 (Duration)

| 토큰 이름 | CSS 변수 | 값 | 용도 |
|----------|---------|-----|------|
| Duration Instant | `--duration-instant` | `50ms` | 즉각 피드백 |
| Duration Fast | `--duration-fast` | `100ms` | 빠른 전환 |
| Duration Normal | `--duration-normal` | `200ms` | 일반 전환 |
| Duration Slow | `--duration-slow` | `300ms` | 강조 애니메이션 |
| Duration Event | `--duration-event` | `1500ms` | 이벤트 주기 (1.5초) |

### 4.2 이징 함수 (Easing)

| 토큰 이름 | CSS 변수 | 값 | 용도 |
|----------|---------|-----|------|
| Ease Step | `--ease-step` | `steps(4)` | 프레임 기반 (픽셀 느낌) |
| Ease Step Smooth | `--ease-step-smooth` | `steps(8)` | 부드러운 프레임 |
| Ease Bounce | `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 바운스 효과 |
| Ease Linear | `--ease-linear` | `linear` | 선형 진행 |

### 4.3 애니메이션 키프레임

```
item-appear
├── 0%: opacity 0, scale 0.5
├── 50%: opacity 1, scale 1.1
└── 100%: opacity 1, scale 1

item-disappear
├── 0%: opacity 1, translateY 0
└── 100%: opacity 0, translateY -20px

hp-change
├── 0%: scale 1
├── 25%: scale 1.2
├── 50%: scale 0.9
└── 100%: scale 1

number-pop
├── 0%: translateY 0, opacity 1
├── 100%: translateY -30px, opacity 0

pulse-critical
├── 0%, 100%: opacity 1
├── 50%: opacity 0.5
```

---

## 5. 아이콘 시스템 (Icon System)

### 5.1 아이콘 크기

| 크기 | 값 | 용도 |
|------|-----|------|
| Icon SM | `16x16px` | 인라인, 상태 표시 |
| Icon MD | `32x32px` | 기본 아이템 |
| Icon LG | `48x48px` | 강조 아이템, 결과 화면 |

### 5.2 아이콘 목록

#### 긍정 아이템 (Positive)
| ID | 이름 | 스프라이트 위치 |
|----|------|---------------|
| `icon-food` | 식량 | row 0, col 0 |
| `icon-water` | 물 | row 0, col 1 |
| `icon-tent` | 텐트 | row 0, col 2 |

#### 부정 아이템 (Negative)
| ID | 이름 | 스프라이트 위치 |
|----|------|---------------|
| `icon-rockfall` | 낙석 | row 1, col 0 |
| `icon-storm` | 폭풍 | row 1, col 1 |
| `icon-injury` | 부상 | row 1, col 2 |

#### 랜덤 아이템 (Random)
| ID | 이름 | 스프라이트 위치 |
|----|------|---------------|
| `icon-treasure` | 보물상자 | row 2, col 0 |
| `icon-mushroom` | 버섯 | row 2, col 1 |
| `icon-unknown` | 미확인 | row 2, col 2 |

#### 상태 아이콘 (Status)
| ID | 이름 | 스프라이트 위치 |
|----|------|---------------|
| `icon-hp` | 체력 | row 3, col 0 |
| `icon-timer` | 타이머 | row 3, col 1 |
| `icon-altitude` | 고도 | row 3, col 2 |

---

## 6. UI 컴포넌트 모델

### 6.1 Button

```
Button Entity
├── Variants: primary, secondary, danger, ghost
├── Sizes: sm (32px), md (40px), lg (48px)
├── States: default, hover, active, disabled
└── Props
    ├── variant: string
    ├── size: string
    ├── disabled: boolean
    └── fullWidth: boolean
```

### 6.2 ProgressBar

```
ProgressBar Entity
├── Variants: hp, altitude, timer
├── Props
    ├── value: number (0-100)
    ├── max: number
    ├── variant: string
    ├── showLabel: boolean
    └── animated: boolean
└── Color Logic
    ├── HP variant: color based on percentage thresholds
    ├── Altitude variant: always primary color
    └── Timer variant: warning color when < 30s
```

### 6.3 Card

```
Card Entity
├── Variants: item, result, panel
├── Props
    ├── variant: string
    ├── itemType: 'positive' | 'negative' | 'random' (for item variant)
    ├── clickable: boolean
    └── selected: boolean
└── Styles
    ├── Border: 2px solid, color based on itemType
    ├── Background: var(--color-surface)
    └── Hover: brightness increase, border glow
```

### 6.4 Modal

```
Modal Entity
├── Variants: result, confirm, info
├── Props
    ├── open: boolean
    ├── title: string
    ├── variant: string
    └── onClose: function
└── Animations
    ├── Open: fade in + scale up
    └── Close: fade out + scale down
```

### 6.5 Tooltip

```
Tooltip Entity
├── Props
    ├── content: string
    ├── position: 'top' | 'bottom' | 'left' | 'right'
    └── delay: number (ms)
└── Styles
    ├── Background: var(--color-surface)
    ├── Border: 1px solid var(--color-border)
    └── Font: var(--font-body)
```

---

## 7. 반응형 브레이크포인트

| 브레이크포인트 | CSS 변수 | 값 | 픽셀 스케일 |
|--------------|---------|-----|-----------|
| Mobile | `--bp-mobile` | `480px` | 1x - 2x |
| Tablet | `--bp-tablet` | `768px` | 2x |
| Desktop | `--bp-desktop` | `1024px` | 2x - 3x |
| Wide | `--bp-wide` | `1440px` | 3x - 4x |

### 스케일 매핑
```
@media (max-width: 480px)  → --pixel-scale: 1 또는 2
@media (max-width: 768px)  → --pixel-scale: 2
@media (max-width: 1024px) → --pixel-scale: 2 또는 3
@media (min-width: 1024px) → --pixel-scale: 3 또는 4
```

---

## 8. 테마 구조

### 8.1 기본 테마 (Himalaya Dark)

```css
:root {
  /* Base */
  --color-primary: #1a3a5c;
  --color-secondary: #e8f4fc;
  --color-background: #0a1628;
  --color-surface: #152238;
  --color-accent: #ffd700;
  
  /* Semantic */
  --color-positive: #4ade80;
  --color-negative: #ef4444;
  --color-random: #a855f7;
  
  /* HP */
  --color-hp-high: #4ade80;
  --color-hp-medium: #facc15;
  --color-hp-low: #ef4444;
  
  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #94a3b8;
}
```

### 8.2 확장 가능 구조 (후순위)

```
themes/
├── himalaya.css    (MVP - 기본)
├── hallasan.css    (후순위)
├── baekdu.css      (후순위)
└── everest.css     (후순위)
```

---

## 엔티티 관계도

```
┌─────────────────┐
│  Design System  │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬───────────┐
    │         │          │           │
┌───▼───┐ ┌───▼───┐ ┌────▼────┐ ┌────▼────┐
│ Tokens │ │ Icons │ │Components│ │Animation│
└───┬───┘ └───┬───┘ └────┬────┘ └────┬────┘
    │         │          │           │
    └─────────┴──────────┴───────────┘
                   │
           ┌───────┴───────┐
           │               │
      ┌────▼────┐    ┌─────▼─────┐
      │  Theme  │    │ Responsive │
      └─────────┘    └───────────┘
```
