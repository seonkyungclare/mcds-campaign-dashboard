# MCDS 캠페인 관리 대시보드

MUSINSA Design System(MCDS)을 적용해 재설계한 **상품광고 · 디스플레이 광고 플랫폼**의 캠페인 조회/수정 화면입니다.

배포: `https://seonkyungclare.github.io/mcds-campaign-dashboard/`

## 기술 스택

React 18, TypeScript 5, Vite 5, Tailwind CSS 3. 상태는 React Hooks만 사용하며 외부 상태 관리 라이브러리는 없습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run verify   # 빌드 + 헤드리스 브라우저 검증 (15개 항목)
```

## 디자인 토큰

모든 색상·타이포그래피·간격 값은 `src/tokens.ts` 한 곳에 정의되어 있고, 컴포넌트는 하드코딩된 색상 없이 이 토큰만 참조합니다. Tailwind는 레이아웃(flex/grid/responsive)에만 쓰고, MCDS 고유 값은 인라인 스타일로 적용해 Figma 스펙과 픽셀 단위로 일치시켰습니다.

주요 토큰은 다음과 같습니다. 강조색은 `#2b52f0`이며 hovered `#1a40d9`, pressed `#1e34b3`, disabled `#bacbff`로 이어집니다. 기본 텍스트는 `#1a1a1a`, 비활성 텍스트는 `#b3b3b3`입니다. 서체는 Pretendard 14px / 행간 20px, 간격은 8px 그리드를 기준으로 합니다.

## 컴포넌트

`src/components/`에 8개 컴포넌트가 있습니다.

**Radio** — 20×20px, 라벨과 8px 간격. `state`를 넘기지 않으면 hover를 내부에서 추적하고, 넘기면 쇼케이스용으로 상태를 고정합니다. enabled/hovered/disabled × selected 조합 6가지를 모두 지원합니다.

**Switch** — MCDS 스펙 그대로 size 24는 40×24px에 핸들 18px, size 20은 36×20px에 핸들 14px이며 양쪽 모두 padding 3px, 이동 거리 16px입니다. enabled/hovered/pressed/disabled × ON/OFF × 2 사이즈 = 16가지 조합.

**TextField** — 라벨, leading 아이콘, 포커스 링, 에러 상태와 메시지.

**Select** — 커스텀 드롭다운. 바깥 클릭과 Escape로 닫히며 `role="listbox"`를 사용합니다.

**Table** — 제네릭 타입. 컬럼별 `render`, `sortable`, `sortValue`를 지원하고, 같은 데이터 키에서 파생된 컬럼(예: 클릭과 CTR)은 `id`로 구분합니다.

**Badge / Button / Segment** — 상태 뱃지, 3가지 variant 버튼, 탭형 세그먼트 컨트롤.

## 화면 구성

헤더 아래에 필터 영역(광고 계정 Radio, 상태·기간 Select, 검색 TextField, 운영중만 보기 Switch), 지표 요약 영역(Switch로 접기, 6개 KPI 카드), 캠페인 목록(Segment로 성과/예산 뷰 전환, 정렬 가능한 테이블, 페이지네이션)이 이어집니다.

지표 카드 값은 고정값이 아니라 현재 필터가 적용된 캠페인 목록에서 매번 다시 계산합니다(`totalsOf`). CTR·CVR·CPC는 원본 숫자에서 파생되며, 포맷팅은 렌더 시점에만 적용해 정렬이 문자열이 아닌 숫자 기준으로 동작합니다.

## 검증

`npm run verify`는 dist를 로컬 서버로 띄우고 Chromium으로 다음을 확인합니다. Switch·Radio의 실제 렌더 크기와 핸들 이동 거리가 MCDS 스펙과 일치하는지, 강조색이 `rgb(43, 82, 240)`으로 계산되는지, 계정·검색·상태 필터가 행 수를 바꾸는지, 지표가 필터에 따라 재계산되는지, Select 드롭다운과 Segment 전환과 정렬이 동작하는지, 콘솔 에러가 없는지를 검사합니다. 현재 15개 항목 전부 통과합니다.

## 배포

`.github/workflows/deploy.yml`이 main 브랜치 푸시마다 빌드 후 GitHub Pages에 배포합니다.

최초 1회만 저장소 **Settings → Pages → Source** 를 **GitHub Actions** 로 설정하면 됩니다. (`gh-pages` 브랜치 방식이 아닙니다.)

Project Pages는 `/<저장소명>/` 하위에서 서빙되므로 워크플로가 `VITE_BASE_PATH`를 저장소 이름으로 자동 주입하고, 딥링크 404를 막기 위해 `index.html`을 `404.html`로 복사합니다.

## 출처

Figma MCDS 파일(`lAbzqUQAovN15n5n6g6Zxl`) — Radio `6098-67236`, Switch `6098-67437`. 원본 화면은 상품광고 디스플레이 광고 플랫폼 파일(`jrUcVUavDfB7mQrYcNoKGt`)의 `2760-86223` 노드입니다.

캠페인 데이터(`src/data/campaigns.ts`)는 화면 확인용 목업이며 실제 광고 실적이 아닙니다.
