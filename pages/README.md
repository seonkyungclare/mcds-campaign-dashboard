# MCDS 화면 (pages/)

`pages/`의 모든 화면은 **MCDS 디자인 시스템**([`mcds.css`](mcds.css))을 참조하는 독립 HTML입니다.
빌드 없이 브라우저에서 바로 열리고, GitHub Pages로 배포됩니다.

## 새 화면 만드는 법

1. [`_template.html`](_template.html)을 복사해서 새 파일(`something.html`)로 저장.
2. `<title>`, `page-title`, 활성 LNB 메뉴(`nav-item--active`)만 바꾸고, 콘텐츠 영역을 채운다.
3. 브라우저로 열어 확인 → 커밋/푸시하면 자동 배포.

> 요청 예시: **"MCDS 참조해서 ○○ 화면 만들어줘"** — `mcds.css`를 기준으로 만듭니다.
> 정확도가 중요하면 **Figma 노드 URL**을 함께 주세요(정확한 토큰·간격을 MCDS에서 추출).

## 규칙 (중요)

- **색상·간격·타이포는 토큰만 사용.** 하드코딩 hex 색상 금지 → `var(--accent)`, `var(--fg-default)`, `var(--border)`, `var(--r-8)` 등.
- **GNB / LNB는 `_template.html` 마크업 그대로.** (활성 메뉴만 변경)
- **재사용 컴포넌트는 `mcds.css`에 추가**하고, 화면 고유 스타일만 페이지 `<style>`에 인라인. (같은 컴포넌트를 페이지마다 인라인 = 드리프트 원인)
- 라디오는 빈 `.radio__dot` + `data-on` 토글, 체크박스는 `aria-checked` 토글 (CSS가 시각화). 공용 JS 헬퍼는 `_template.html` 하단 참고.

## 주요 토큰 (`mcds.css` `:root`)

| 용도 | 토큰 | 값 |
|---|---|---|
| 강조색 | `--accent` / `--accent-hovered` | `#2b52f0` / `#1a40d9` |
| 기본 텍스트 | `--fg-default` / `--fg-subtle` / `--fg-muted` | `#1a1a1a` / `#666` / `#808080` |
| 테두리 | `--border` / `--border-light` | `#d9d9d9` / `#ececec` |
| 연강조 배경 | `--accent-light-low` / `--accent-bg-low` | `#edf3ff` / `#f7faff` |
| 위험(critical) | `--critical` | `#e5231b` |
| 라운드 | `--r-4` / `--r-8` | `4px` / `8px` |
| 폰트 | `--font` | Pretendard |

## 준비된 컴포넌트 (클래스)

- 레이아웃: `.gnb` · `.lnb` · `.layout` · `.main` · `.content` / `.content__inner` · `.page-title`
- 섹션/폼: `.section` / `.section__title` · `.form` · `.row` / `.row__label` / `.row__field` · `.req`
- 입력: `.textfield` · `.datepicker` · `.num-field`
- 선택: `.radio` / `.radio-card` / `.radio-box`(구좌 4상태) · `.checkbox`(체크/부분/비활성) · `.chip`(tone×size×border)
- 버튼: `.btn` + `.btn--{primary|secondary|tertiary|warning}` + `.btn--{32|36|40|48}`
- 기타: `.tooltip`(position×tone) · `.callout` · `.slot-card` · `.bottombar` · `.info`(3열 안내)

※ 목록에 없는 컴포넌트(테이블·페이지네이션·Steps/Tabs·Select 드롭다운 등)가 필요하면 요청 시 `mcds.css`에 추가합니다.

## 화면 플로우

진입점 `index.html`(→ `dsp-home.html`) 기준:

```
dsp-home (디스플레이 광고 관리 현황)
  └ 캠페인 만들기 → campaign-create (캠페인 생성)
       └ 생성 → ad-group-create (광고 그룹 생성)
            └ 생성 → ad-create (광고 생성)
```

## 로컬 미리보기

```bash
python3 -m http.server 5173 --bind 127.0.0.1 --directory pages
# http://localhost:5173/  (→ 현황 홈)
```

배포: `main`에 푸시하면 GitHub Actions가 `pages/`를 `/pages/` 하위로 자동 배포.
