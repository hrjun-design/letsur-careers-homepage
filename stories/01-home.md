# 01. Home (Why letsur)

## 피그마

- 파일: "홈페이지3.0 외부 공유용" (`hKf0LhcWBmjevQqAGN3wlX`)
- 프레임: `251001_홈화면_1440` (node `825:18669`) — 1440px 데스크톱, 10/1자 최신
- 모바일 프레임(node `825:19666`)은 이번 스코프에 포함 안 함

## 섹션 구성 (구현 완료, 2026-09-09)

GNB/Footer는 사이트 공통 레이아웃(`src/components/GlobalNav.tsx`, `Footer.tsx`)이 처리 — 이 페이지(`src/app/page.tsx`)는 아래 8개 섹션만 조합:

1. Hero (`components/sections/home/Hero.tsx`)
2. Mission — "미션" (`Mission.tsx`)
3. CoreValues — "핵심가치" 3개 (`CoreValues.tsx`)
4. Roadmap — "비즈니스 로드맵" (`Roadmap.tsx`)
5. Services — "제품과 서비스"(스테이엑스·에이블캠퍼스) (`Services.tsx`)
6. ClientLogos — "고객사" 12개 로고 (`ClientLogos.tsx`)
7. InvestorLogos — "투자사" 4개 로고 (`InvestorLogos.tsx`)
8. RecruitBanner — "채용 공고 배너" (`RecruitBanner.tsx`)

## 에셋

- `asset/6 Careers/1 why letsur/`에서 export된 이미지 9개를 `next-app/public/images/why-letsur/`로 복사해서 사용
- 고객사 로고 12개·투자사 로고 4개는 `next-app/public/images/logos/`에 별도로 복사(메인 홈페이지 레포의 `public/images/{main/cases,cases,aboutus}/logos*/`에서 가져온 것 — 이 사이트는 메인 레포와 완전히 분리된 배포라 그 경로에 런타임 접근 불가하므로 반드시 이 프로젝트 안에 실물 파일이 있어야 함)

## ⚠️ 알려진 갭 (확인 필요)

1. **AI 로드맵 3단계 카드의 장식 그래픽**(네트워크 노드/벤다이어그램/궤도) — 원본이 벡터 도형 조합인데 Figma MCP(`figma-mcp-for-claude`)의 `export_node_as_image`가 파일로 저장하는 방법이 없어서 SVG로 손으로 근사 재현함(`Roadmap.tsx`). 원본과 100% 동일하지 않음 — 디자이너가 PNG로 직접 export해서 주면 교체 필요.
2. **최하단 "채용 공고 배너" 섹션의 배경 사진**(AdobeStock 추정) — 로컬에 사전 export본이 없어 그라디언트로 대체(`RecruitBanner.tsx`). 마찬가지로 PNG 필요 시 교체.
3. **"스테이엑스" 카피** — "제품과 서비스" 섹션에 옛 제품명 "스테이엑스"가 피그마 원문 그대로 남아있음. 메인 렛서 홈페이지 쪽 `렛서 홈페이지 정비/CLAUDE.md`의 8/25 결정("스테이엑스 개념 설명 섹션 제거, AI Gateway로 통합")과 배치될 수 있음 — 이번엔 피그마 원문 그대로 반영, 유지할지 재확인 필요.
4. **GNB/Footer가 Figma 미대조 상태** — 위 CLAUDE.md 참고. Webflow 실서버 크롤링 데이터로 임시 작성됨.

## 내부/외부 링크

- "채용 공고 바로가기"(Hero, RecruitBanner) → `/recruit` (이 사이트 내부, 아직 미구현)
- "스테이엑스 더 알아보기"(Services) → `https://letsur.ai/kr/ai-gateway` (메인 홈페이지, 외부 링크로 처리 — 이 사이트에서 메인 레포 내부 라우트에 접근 불가하므로)
- "에이블캠퍼스 더 알아보기"(Services) → `https://www.aible-campus.com/` (외부)

## 렌더 확인

- 로컬 dev 서버(포트 3002) `curl localhost:3002/` → HTTP 200, `<title>LETSUR Careers</title>` 확인(2026-09-09)
- 브라우저 시각 확인·반응형 크로스체크는 아직 안 함
