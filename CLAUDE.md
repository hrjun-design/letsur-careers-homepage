# letsur-careers-3.0

## 배경

렛서 메인 홈페이지(`letsur-homepage-3.0`)의 GNB "채용" 항목은 **outlink로 계속 유지**된다 — 메인 사이트 서브라우트가 아니다. 대신 그 outlink가 가리키는 대상 자체(현재 Webflow `careers.letsur.ai`)를 이 별도 프로젝트로 이관해 Vercel 배포로 대체하는 것이 목표.

- 2026-09-09 최초 시도 때 메인 홈페이지 레포 안에 `/careers` 서브라우트로 잘못 만들었다가, 사용자가 "outlink 구조는 유지하고 채용페이지는 별도 도메인으로"라고 정정 — 이 프로젝트로 전체 분리
- 실서버(이관 대상) 소스: <https://careers.letsur.ai/>
- 담당: DB/프론트/백엔드 전부 전혜림(Claude와 함께 구현), 공고 게시는 소연님, 채용페이지 운영 관리는 태희님 직접

## 핵심 아키텍처 결정

1. **메인 렛서 홈페이지와 완전히 독립된 배포.** `letsur-homepage-3.0`의 GNB·Footer·컴포넌트를 공유하지 않는다 — 이 사이트만의 `GlobalNav`/`Footer`를 별도로 가진다.
2. **스택은 메인 홈페이지와 동일하게 맞춤(브랜드 일관성)** — Next.js 15 + Tailwind v4, `src/tokens/base.css`/`tokens.css`를 그대로 복사해 디자인 토큰 공유(자동 동기화 아님 — 토큰 변경 시 양쪽 수동 반영 필요).
3. **GitHub repo 착수 (2026-09-14)** — 이 폴더(`letsur-careers-3.0/`) 루트가 git 저장소, `main`(정식 배포용)·`staging`(프리뷰용) 브랜치 운영. 저장소: `https://github.com/hrjun-design/letsur-careers-homepage`(전혜림 개인 계정 — 조직(`letsur-dev`) 소유 + Private 조합은 Vercel Hobby 플랜에서 import 불가해 개인 계정으로 이동). 로컬 remote는 `personal`(실사용)과 `origin`(조직 소유, 현재 빈 채로 미사용) 둘 다 등록돼 있음 — 헷갈리지 말 것, 푸시는 `personal`로.
   - **⚠️ TODO — Vercel 프로젝트 Import 진행 중.** Root Directory는 반드시 `next-app`으로 지정(레포 루트가 아님). 환경변수 `NEXT_PUBLIC_SUPABASE_URL`·`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 등록 필요. `careers.letsur.ai` 도메인 연결(현재 Webflow가 물고 있는 도메인 이관)은 아직 별개 후속 작업.
4. **로컬 dev 포트: 3002** (메인 홈페이지가 3001을 쓰는 경우가 많아 충돌 방지).
5. **⚠️ `next/image`는 항상 `fill` + 크기 지정된 `relative` 부모 컨테이너 패턴만 사용한다.** `width`/`height` props(비-fill 모드)에 그보다 작은 CSS 높이 클래스(`h-[40px]` 등, 표준 스케일도 동일)를 얹으면 이미지가 완전히 안 보이는 버그를 실제로 겪음(2026-09-09, `InvestorLogos.tsx`). 원인 미규명 — 재발 방지 차원에서 이 패턴 자체를 금지.
6. **관리자(`/admin/recruit`) 직군·경력사항·고용형태는 하드코딩이 아니라 Supabase 참조 테이블(`job_groups`·`careers`·`employment_types`, 전부 `slug`/`name`/`sort_order` 동일 구조)로 분리, 각각 전용 관리 화면(`/admin/recruit/{job-groups,careers,employment-types}`)을 둠.** 실서버(Webflow `careers.letsur.ai`)가 이 3개를 별도 CMS Collection으로 운영 중이라 그 구조를 그대로 이관 — "채용 공고"(`jobs` 테이블)가 이 3개 테이블을 참조(FK)하는 방식도 동일. 목적은 소연님·태희님이 개발자 없이 직접 옵션을 추가·수정·삭제할 수 있게 하는 것(예: 고용형태에 "프리랜서" 추가). 3개 관리 화면은 `RefCollectionManager` 공용 컴포넌트 하나로 구현(2026-09-11).

## 파일 구조

| 파일/폴더 | 역할 |
|---|---|
| `CLAUDE.md` | 이 문서 |
| `history.md` | 세션별 작업 일지 |
| `stories/*.md` | 화면별 구조·콘텐츠 정의 (01-home, 02-culture, 03-recruit-list, 04-recruit-detail, 05-faq, 06-talent-pool) |
| `context/레퍼런스.md` | 인재풀 등록 등 디자인 레퍼런스 |
| `asset/` | 피그마에서 사전 export된 이미지 원본, `0 base`(공통)/`1 why letsur`/`2 culture`/`3 recruit` 하위 폴더 구성 (원래 `letsur-homepage-3.0/asset/6 Careers/`에 있던 것을 이관 후 2026-09-09 "6 Careers" 래퍼 폴더 제거, 하위 폴더를 `asset/` 바로 아래로 평탄화) |
| `next-app/` | 실제 배포 앱 |

## 섹션/라우트 목록

- `/` — 홈 (Why letsur) — **구현 완료** (`stories/01-home.md` 참고)
- `/culture` — 팀 문화 — **구현 완료(카피는 Webflow 실서버 크롤링 기준, Figma 미대조)** (`stories/02-culture.md` 참고) — Figma 채널이 다른 파일에 연결돼 있어 node `1090:2373`을 못 가져와서, 대신 `careers.letsur.ai/culture` 실서버 텍스트를 그대로 옮겨 카피 확정(2026-09-09). 아이콘-값/복지 항목 매칭 순서, 팀 사진-팀명 매칭은 추정치 — Figma 재연결 시 재확인 권장
- `/recruit` — 채용공고 목록 — **구현 완료** (Figma 대신 실서버 기준, 검색+필터+공고 리스트+FAQ 아코디언+합류여정 4단계, 2026-09-11)
- `/recruit/[slug]` — 채용공고 상세 — 미착수
- `/recruit/talent-pool` — 인재풀 등록 — 미착수 (스펙은 확정, `stories/06-talent-pool.md` 참고, `/recruit` 하단 상시 배너 진입점도 아직 미반영)
- FAQ — `/recruit` 하단 섹션으로 확인·구현 완료(4그룹 9문항 아코디언)

## Figma

- 파일: "홈페이지3.0 외부 공유용" (`hKf0LhcWBmjevQqAGN3wlX`)
- 채널(talk-to-figma 소켓): 세션마다 사용자가 새로 발급 — CLAUDE.md에 고정 채널 코드 기록하지 않음
- 시트: "채용 페이지 디자인" (node `825:17382`) → 섹션 `251001_채용페이지_개발단 전달` (node `825:18169`)
- ⚠️ 홈 화면(node `825:18670`) 구현 시 GNB/Footer 노드(`825:23392`)를 Figma에서 직접 대조하지 못함 — MCP 연결 타임아웃으로 Webflow 실서버 크롤링 데이터 기준으로 임시 작성. **다음 작업 시 Figma로 재확인 필수.** (이후 GNB/Footer는 메인 홈페이지 마스터 파일 `X4mGxjTMeIBiy4sf8Z54If` node `965:11388`/`1141:11328`/`970:9941` 기준으로 재작업 완료됨)
- ⚠️ 팀 문화 페이지(node `1090:2373`) 작업 시도 시 Figma MCP 채널이 "홈페이지3.0 외부 공유용"이 아니라 "렛서 홈페이지 3.0 디자인 마스터"(`X4mGxjTMeIBiy4sf8Z54If`) 파일의 "Headers & Footers" 페이지에 연결돼 있어 node를 못 가져옴. **카피는 사용자 지시로 Figma 대신 `careers.letsur.ai/culture` 실서버 크롤링으로 대체 확정(2026-09-09)** — 레이아웃 세부(간격·아이콘 배치 등)는 여전히 Figma 미대조 상태, 재연결 시 확인 권장.
