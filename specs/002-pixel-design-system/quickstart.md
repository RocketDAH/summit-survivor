# Quickstart: 픽셀 디자인 시스템

**Feature**: 002-pixel-design-system
**Date**: 2026-06-05

## 소개

정상까지(Summit Survivor) 게임을 위한 레트로 픽셀 아트 스타일 디자인 시스템입니다.

---

## 빠른 시작

### 1. CSS 파일 연결

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- 픽셀 폰트 로드 -->
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  
  <!-- 디자인 시스템 CSS -->
  <link rel="stylesheet" href="design-system/index.css">
</head>
<body>
  <!-- 게임 컨텐츠 -->
</body>
</html>
```

### 2. 기본 사용 예시

```html
<!-- 버튼 -->
<button class="pixel-btn pixel-btn--primary">
  게임 시작
</button>

<!-- HP 바 -->
<div class="pixel-progress pixel-progress--hp pixel-progress--animated">
  <div class="pixel-progress__fill" style="width: 75%"></div>
  <span class="pixel-progress__label">75/100</span>
</div>

<!-- 아이템 카드 -->
<div class="pixel-card pixel-card--item pixel-card--positive pixel-card--clickable">
  <span class="pixel-icon pixel-icon--food pixel-icon--md"></span>
  <div class="pixel-card__content">
    <h3 class="pixel-card__title">식량</h3>
    <p class="pixel-card__desc">HP +20</p>
  </div>
</div>
```

---

## 주요 컴포넌트

### 버튼 (Button)

```html
<!-- 기본 버튼 -->
<button class="pixel-btn pixel-btn--primary">Primary</button>
<button class="pixel-btn pixel-btn--secondary">Secondary</button>
<button class="pixel-btn pixel-btn--danger">Danger</button>
<button class="pixel-btn pixel-btn--ghost">Ghost</button>

<!-- 크기 -->
<button class="pixel-btn pixel-btn--primary pixel-btn--sm">Small</button>
<button class="pixel-btn pixel-btn--primary pixel-btn--md">Medium</button>
<button class="pixel-btn pixel-btn--primary pixel-btn--lg">Large</button>

<!-- 전체 너비 -->
<button class="pixel-btn pixel-btn--primary pixel-btn--full">Full Width</button>
```

### 프로그레스 바 (Progress Bar)

```html
<!-- HP 바 (자동 색상 변경) -->
<div class="pixel-progress pixel-progress--hp">
  <div class="pixel-progress__fill" style="width: 80%"></div>
</div>

<!-- 고도 바 -->
<div class="pixel-progress pixel-progress--altitude">
  <div class="pixel-progress__fill" style="width: 50%"></div>
  <span class="pixel-progress__label">1,500m</span>
</div>

<!-- 타이머 바 -->
<div class="pixel-progress pixel-progress--timer">
  <div class="pixel-progress__fill" style="width: 60%"></div>
  <span class="pixel-progress__label">1:12</span>
</div>
```

### 아이템 카드 (Item Card)

```html
<!-- 긍정 아이템 -->
<div class="pixel-card pixel-card--item pixel-card--positive pixel-card--clickable">
  <span class="pixel-icon pixel-icon--food pixel-icon--md"></span>
  <h3 class="pixel-card__title">식량</h3>
  <p class="pixel-card__desc">HP +20</p>
</div>

<!-- 부정 아이템 -->
<div class="pixel-card pixel-card--item pixel-card--negative pixel-card--clickable">
  <span class="pixel-icon pixel-icon--rockfall pixel-icon--md"></span>
  <h3 class="pixel-card__title">낙석</h3>
  <p class="pixel-card__desc">HP -30</p>
</div>

<!-- 랜덤 아이템 -->
<div class="pixel-card pixel-card--item pixel-card--random pixel-card--clickable">
  <span class="pixel-icon pixel-icon--treasure pixel-icon--md"></span>
  <h3 class="pixel-card__title">보물상자</h3>
  <p class="pixel-card__desc">???</p>
</div>
```

### 모달 (Modal)

```html
<div class="pixel-modal pixel-modal--open pixel-modal--result">
  <div class="pixel-modal__overlay"></div>
  <div class="pixel-modal__container">
    <div class="pixel-modal__header">
      <h2 class="pixel-modal__title">게임 결과</h2>
    </div>
    <div class="pixel-modal__body">
      <p class="pixel-text-display pixel-text-2xl pixel-text-accent">
        정상 도달!
      </p>
      <p class="pixel-text-number pixel-text-xl">
        점수: 2,450
      </p>
    </div>
    <div class="pixel-modal__footer">
      <button class="pixel-btn pixel-btn--primary">다시 시작</button>
      <button class="pixel-btn pixel-btn--secondary">메인으로</button>
    </div>
  </div>
</div>
```

---

## 아이콘 사용

### 기본 사용

```html
<!-- 크기별 아이콘 -->
<span class="pixel-icon pixel-icon--food pixel-icon--sm"></span>  <!-- 16x16 -->
<span class="pixel-icon pixel-icon--food pixel-icon--md"></span>  <!-- 32x32 -->
<span class="pixel-icon pixel-icon--food pixel-icon--lg"></span>  <!-- 48x48 -->
```

### 사용 가능한 아이콘

| 클래스 | 아이콘 | 타입 |
|--------|--------|------|
| `pixel-icon--food` | 식량 | 긍정 |
| `pixel-icon--water` | 물 | 긍정 |
| `pixel-icon--tent` | 텐트 | 긍정 |
| `pixel-icon--rockfall` | 낙석 | 부정 |
| `pixel-icon--storm` | 폭풍 | 부정 |
| `pixel-icon--injury` | 부상 | 부정 |
| `pixel-icon--treasure` | 보물상자 | 랜덤 |
| `pixel-icon--mushroom` | 버섯 | 랜덤 |
| `pixel-icon--unknown` | 미확인 | 랜덤 |
| `pixel-icon--hp` | 체력 | 상태 |
| `pixel-icon--timer` | 타이머 | 상태 |
| `pixel-icon--altitude` | 고도 | 상태 |

---

## 색상 사용

### CSS 변수로 색상 사용

```css
.my-element {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border-color: var(--color-positive);
}
```

### 유틸리티 클래스로 색상 사용

```html
<p class="pixel-text-positive">HP +20</p>
<p class="pixel-text-negative">HP -30</p>
<p class="pixel-text-accent">정상 도달!</p>
```

---

## 타이포그래피

### 폰트 클래스

```html
<!-- 디스플레이 폰트 (제목, 점수) -->
<h1 class="pixel-text-display pixel-text-2xl">SUMMIT SURVIVOR</h1>

<!-- 본문 폰트 -->
<p class="pixel-text-body pixel-text-base">게임 설명 텍스트</p>

<!-- 숫자 폰트 (고정폭) -->
<span class="pixel-text-number pixel-text-xl">00:59</span>
```

### 크기 클래스

```html
<p class="pixel-text-xs">매우 작은 텍스트 (8px)</p>
<p class="pixel-text-sm">작은 텍스트 (12px)</p>
<p class="pixel-text-base">기본 텍스트 (16px)</p>
<p class="pixel-text-lg">큰 텍스트 (20px)</p>
<p class="pixel-text-xl">매우 큰 텍스트 (24px)</p>
<p class="pixel-text-2xl">제목 (32px)</p>
<p class="pixel-text-3xl">대형 제목 (48px)</p>
```

---

## 애니메이션

### 애니메이션 클래스

```html
<!-- 아이템 등장 -->
<div class="pixel-card pixel-anim-appear">...</div>

<!-- 아이템 퇴장 -->
<div class="pixel-card pixel-anim-disappear">...</div>

<!-- 선택 시 바운스 -->
<div class="pixel-card pixel-anim-bounce">...</div>

<!-- HP 위험 시 깜빡임 -->
<div class="pixel-progress pixel-anim-pulse">...</div>

<!-- 피해 시 흔들림 -->
<div class="pixel-container pixel-anim-shake">...</div>

<!-- 숫자 변화 팝업 -->
<span class="pixel-anim-pop">+20</span>
```

### JavaScript로 애니메이션 트리거

```javascript
// 아이템 등장 애니메이션
function showItem(element) {
  element.classList.add('pixel-anim-appear');
  element.addEventListener('animationend', () => {
    element.classList.remove('pixel-anim-appear');
  }, { once: true });
}

// HP 변화 팝업
function showHpChange(amount) {
  const popup = document.createElement('span');
  popup.className = 'pixel-anim-pop pixel-text-number';
  popup.textContent = amount > 0 ? `+${amount}` : amount;
  popup.classList.add(amount > 0 ? 'pixel-text-positive' : 'pixel-text-negative');
  
  document.body.appendChild(popup);
  popup.addEventListener('animationend', () => popup.remove());
}
```

---

## 반응형 디자인

### 픽셀 스케일 컨테이너

```html
<div class="pixel-container">
  <!-- 이 안의 모든 요소가 정수 배율로 스케일링됨 -->
  <div class="pixel-card">...</div>
</div>
```

### 반응형 유틸리티

```html
<!-- 모바일에서는 작게, 데스크톱에서는 크게 -->
<h1 class="pixel-text-lg md:pixel-text-xl lg:pixel-text-2xl">
  SUMMIT SURVIVOR
</h1>

<!-- 모바일에서는 세로, 태블릿 이상에서는 가로 -->
<div class="pixel-flex flex-col md:flex-row">
  <div class="pixel-card">...</div>
  <div class="pixel-card">...</div>
</div>
```

---

## 게임 화면 예시

### 메인 화면

```html
<div class="pixel-container">
  <header class="pixel-flex pixel-center pixel-mb-6">
    <h1 class="pixel-text-display pixel-text-2xl pixel-text-accent">
      정상까지
    </h1>
    <p class="pixel-text-body pixel-text-sm pixel-text-secondary">
      SUMMIT SURVIVOR
    </p>
  </header>
  
  <main class="pixel-flex pixel-center">
    <button class="pixel-btn pixel-btn--primary pixel-btn--lg">
      게임 시작
    </button>
    <button class="pixel-btn pixel-btn--secondary pixel-btn--lg pixel-mt-4">
      리더보드
    </button>
  </main>
</div>
```

### 게임 플레이 화면

```html
<div class="pixel-container">
  <!-- 상단 HUD -->
  <header class="pixel-flex pixel-p-4">
    <div class="pixel-flex">
      <span class="pixel-icon pixel-icon--hp pixel-icon--sm"></span>
      <div class="pixel-progress pixel-progress--hp pixel-ml-2" style="width: 150px;">
        <div class="pixel-progress__fill" style="width: 75%"></div>
      </div>
    </div>
    
    <div class="pixel-flex pixel-ml-4">
      <span class="pixel-icon pixel-icon--timer pixel-icon--sm"></span>
      <span class="pixel-text-number pixel-text-lg pixel-ml-2">01:23</span>
    </div>
    
    <div class="pixel-flex pixel-ml-4">
      <span class="pixel-icon pixel-icon--altitude pixel-icon--sm"></span>
      <span class="pixel-text-number pixel-text-lg pixel-ml-2">1,850m</span>
    </div>
  </header>
  
  <!-- 이벤트 영역 -->
  <main class="pixel-flex pixel-center pixel-p-6">
    <div class="pixel-card pixel-card--item pixel-card--positive pixel-card--clickable pixel-anim-appear">
      <span class="pixel-icon pixel-icon--food pixel-icon--lg"></span>
      <h3 class="pixel-card__title pixel-text-display">식량</h3>
      <p class="pixel-card__desc pixel-text-body">HP +20 회복</p>
    </div>
  </main>
  
  <!-- 고도 진행 바 -->
  <footer class="pixel-p-4">
    <div class="pixel-progress pixel-progress--altitude">
      <div class="pixel-progress__fill" style="width: 62%"></div>
      <span class="pixel-progress__label">1,850m / 3,000m</span>
    </div>
  </footer>
</div>
```

---

## 파일 구조

```
design-system/
├── index.css              # 메인 진입점
├── tokens/
│   ├── colors.css         # 색상 변수
│   ├── typography.css     # 폰트 변수
│   ├── spacing.css        # 간격 변수
│   └── animation.css      # 애니메이션 변수
├── components/
│   ├── button.css         # 버튼
│   ├── progress-bar.css   # 프로그레스 바
│   ├── card.css           # 카드
│   ├── modal.css          # 모달
│   └── tooltip.css        # 툴팁
├── icons/
│   ├── sprite-16.png      # 16x16 스프라이트
│   ├── sprite-32.png      # 32x32 스프라이트
│   ├── sprite-48.png      # 48x48 스프라이트
│   └── icons.css          # 아이콘 클래스
└── utilities/
    ├── text.css           # 텍스트 유틸리티
    ├── layout.css         # 레이아웃 유틸리티
    ├── spacing.css        # 스페이싱 유틸리티
    └── animation.css      # 애니메이션 유틸리티
```

---

## 다음 단계

1. **아이콘 에셋 제작**: 스프라이트 시트 PNG 파일 생성
2. **CSS 구현**: 각 토큰 및 컴포넌트 CSS 파일 작성
3. **테스트 페이지**: 모든 컴포넌트를 포함한 테스트 HTML 작성
4. **게임 통합**: Summit Survivor 게임에 디자인 시스템 적용
