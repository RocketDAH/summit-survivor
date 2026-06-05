# Research: 픽셀 디자인 시스템

**Feature**: 002-pixel-design-system
**Date**: 2026-06-05

## 1. 픽셀 폰트 선택

### Decision: Press Start 2P + VT323 조합

### Rationale
- **Press Start 2P**: 제목, 점수, 중요 숫자에 사용. 8비트 게임 느낌의 정통 픽셀 폰트
- **VT323**: 본문, 설명 텍스트에 사용. 가독성이 좋고 레트로 터미널 느낌
- 둘 다 Google Fonts에서 무료로 제공되어 웹 폰트 로딩이 간편함
- 한글 지원이 제한적이므로 한글용 픽셀 폰트(예: 둥근모꼴, 도스샘물) 병행 고려

### Alternatives Considered
| 폰트 | 장점 | 단점 | 결정 |
|------|------|------|------|
| Silkscreen | 매우 작은 크기에서 가독성 좋음 | 큰 크기에서 단조로움 | 후보 |
| Pixelify Sans | 현대적 픽셀 느낌 | 레트로 느낌 부족 | 제외 |
| 04b03 | 초소형 픽셀에 최적화 | 라이선스 확인 필요 | 제외 |
| DungGeunMo (둥근모꼴) | 한글 완벽 지원 | 영문과 조합 시 일관성 | 한글용 채택 |

---

## 2. 색상 팔레트 전략

### Decision: 32색 제한 팔레트 (NES/Famicom 스타일 확장)

### Rationale
- 레트로 게임 느낌을 살리면서도 현대적 접근성 기준 충족
- 16색은 너무 제한적, 64색 이상은 레트로 느낌 감소
- WCAG AA 기준(4.5:1 대비) 충족을 위해 색상 쌍 사전 검증 필요

### 색상 정의 방식
```
CSS Custom Properties (CSS Variables) 사용
- 런타임에서 테마 변경 가능
- 브라우저 지원 우수 (IE11 제외)
- 개발자 경험 향상
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| Sass Variables | 빌드 타임 최적화 | 런타임 변경 불가 | 제외 |
| CSS-in-JS | 동적 스타일링 용이 | 런타임 오버헤드 | 제외 |
| CSS Custom Properties | 런타임 유연성, 표준 기술 | IE11 미지원 | 채택 |
| Tailwind Config | 유틸리티 클래스와 통합 | 설정 복잡 | 후보 |

---

## 3. 픽셀 아트 렌더링 기법

### Decision: CSS `image-rendering: pixelated` + 정수 배율 스케일링

### Rationale
- 브라우저 네이티브 지원으로 성능 우수
- JavaScript 없이 순수 CSS로 구현 가능
- 모든 주요 브라우저에서 지원 (Chrome, Firefox, Safari, Edge)

### 핵심 CSS 속성
```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* Firefox fallback */
  -ms-interpolation-mode: nearest-neighbor; /* IE fallback */
}

.pixel-container {
  /* 정수 배율만 사용하여 흐릿함 방지 */
  transform: scale(2); /* 2x, 3x, 4x 등 */
  transform-origin: top left;
}
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| Canvas 2D | 완전한 제어 | 복잡한 구현, 접근성 이슈 | 제외 |
| WebGL | 고성능 렌더링 | 과도한 복잡성 | 제외 |
| SVG | 벡터 기반 확장 | 픽셀 느낌 손실 | 제외 |
| CSS + PNG | 간단, 표준 | 최적 선택 | 채택 |

---

## 4. 아이콘 포맷 및 제공 방식

### Decision: PNG 스프라이트 시트 + CSS 클래스

### Rationale
- 픽셀 아트는 래스터 이미지가 가장 정확하게 표현됨
- 스프라이트 시트로 HTTP 요청 최소화
- CSS 클래스로 사용 편의성 제공

### 스프라이트 시트 구조
```
icons-16.png (16x16 아이콘 모음)
icons-32.png (32x32 아이콘 모음)
icons-48.png (48x48 아이콘 모음)
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| SVG 아이콘 | 무한 확장 | 픽셀 아트 느낌 손실 | 제외 |
| Icon Font | 색상 변경 용이 | 멀티컬러 불가 | 제외 |
| 개별 PNG | 구현 간단 | 많은 HTTP 요청 | 제외 |
| PNG Sprite Sheet | 성능 + 정확도 | 관리 복잡 | 채택 |
| WebP Sprite | 더 작은 용량 | 구형 브라우저 이슈 | 후보 |

---

## 5. 애니메이션 구현 방식

### Decision: CSS Keyframes + 스텝 이징

### Rationale
- GPU 가속으로 60fps 유지 용이
- `steps()` 이징으로 프레임 단위 애니메이션 (픽셀 느낌)
- JavaScript 의존성 없음

### 핵심 패턴
```css
@keyframes pixel-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.bounce {
  animation: pixel-bounce 0.3s steps(3) infinite;
}
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| JavaScript Animation | 완전한 제어 | 성능 오버헤드 | 제외 |
| GSAP | 강력한 기능 | 외부 의존성 | 후보 |
| Framer Motion | React 통합 | 번들 크기 증가 | 제외 |
| CSS Keyframes | 네이티브, 성능 우수 | 복잡한 시퀀스 어려움 | 채택 |
| Web Animations API | 표준 API | 브라우저 지원 차이 | 후보 |

---

## 6. 반응형 픽셀 스케일링 전략

### Decision: 컨테이너 쿼리 + 정수 배율 브레이크포인트

### Rationale
- 픽셀 아트는 정수 배율(1x, 2x, 3x)에서만 선명함
- 컨테이너 크기 기반으로 적절한 배율 자동 선택
- CSS Container Queries로 컴포넌트 단위 반응형 구현

### 브레이크포인트 설계
```
Mobile (< 480px):     1x 또는 2x 스케일
Tablet (480-1024px):  2x 또는 3x 스케일
Desktop (> 1024px):   3x 또는 4x 스케일
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| viewport 기반 Media Query | 익숙한 패턴 | 컴포넌트 독립성 부족 | 폴백 |
| JavaScript resize | 세밀한 제어 | 성능 이슈 | 제외 |
| CSS Container Query | 컴포넌트 단위 | 구형 브라우저 미지원 | 채택 |
| 고정 크기 | 단순함 | 유연성 부족 | 제외 |

---

## 7. 기술 스택 결정

### Decision: Vanilla CSS + CSS Custom Properties

### Rationale
- 게임 프로젝트가 어떤 프레임워크를 사용하든 독립적으로 적용 가능
- 번들 크기 최소화
- 학습 곡선 낮음
- 001 feature의 기술 스택과 무관하게 사용 가능

### 파일 구조
```
design-system/
├── tokens/
│   ├── colors.css       # 색상 변수
│   ├── typography.css   # 폰트 스타일
│   ├── spacing.css      # 간격 단위
│   └── animation.css    # 애니메이션 토큰
├── components/
│   ├── button.css       # 버튼 스타일
│   ├── progress-bar.css # 프로그레스 바
│   ├── card.css         # 카드/패널
│   └── modal.css        # 모달
├── icons/
│   ├── sprite-16.png
│   ├── sprite-32.png
│   └── icons.css        # 아이콘 클래스
└── index.css            # 진입점
```

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| Tailwind CSS | 유틸리티 기반, 빠른 개발 | 커스텀 픽셀 스타일 복잡 | 후보 |
| CSS Modules | 스코프 격리 | 빌드 설정 필요 | 제외 |
| Styled Components | React 친화적 | React 의존성 | 제외 |
| Vanilla CSS | 프레임워크 무관, 간단 | 수동 관리 | 채택 |

---

## 8. 접근성 고려사항

### Decision: 색상 + 형태 이중 표시, 충분한 대비

### Rationale
- 색맹 사용자를 위해 아이템 타입을 색상만으로 구분하지 않음
- 각 아이템 타입에 고유한 형태적 특성 부여
- WCAG AA 기준 4.5:1 대비 비율 준수

### 구현 방식
| 아이템 타입 | 색상 | 형태적 구분 |
|------------|------|-----------|
| 긍정 | 녹색/금색 | 둥근 형태, 상승 화살표 |
| 부정 | 빨강/주황 | 뾰족한 형태, 경고 표시 |
| 랜덤 | 보라/노랑 | 물음표, 반짝임 효과 |

---

## 요약: 기술 결정 사항

| 영역 | 결정 |
|------|------|
| 폰트 | Press Start 2P (제목), VT323 (본문), 둥근모꼴 (한글) |
| 색상 | 32색 팔레트, CSS Custom Properties |
| 렌더링 | CSS `image-rendering: pixelated` |
| 아이콘 | PNG 스프라이트 시트 |
| 애니메이션 | CSS Keyframes + `steps()` 이징 |
| 반응형 | Container Queries + 정수 배율 |
| 기술 스택 | Vanilla CSS |
| 접근성 | 색상 + 형태 이중 표시 |
