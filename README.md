# 렛서 채용 사이트 (letsur-careers)

렛서 채용 사이트 `careers.letsur.ai`의 소스입니다. Webflow에서 **Next.js + Vercel + Supabase**로 이관했습니다.
메인 렛서 홈페이지(`letsur-homepage-3.0`)와는 별개의 사이트입니다.

> 운영 이관 절차, DB 구조, 남은 작업은 **[HANDOVER.md](./HANDOVER.md)**를 먼저 읽어주세요.

## 주요 기능

- **공개 사이트:** 회사 소개(`/`), 팀 문화(`/culture`), 채용공고 목록·상세(`/recruit`, 근무지 네이버 지도), 인재풀 등록 폼(`/recruit/talent-pool/apply`)
- **관리자(`/admin`):** 채용 공고 등록·수정·순서 편집, 인재풀 신청 조회·다운로드·삭제, 직군·경력사항·고용형태·지원 직무 선택지 관리

## 기술 스택

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui (Base UI) · Supabase (DB · Auth · Storage) · Vercel

## 시작하기

```bash
cd next-app
npm install
cp .env.example .env.local   # 값 채우기 (아래 표 참고)
npm run dev                  # http://localhost:3002
```

| 환경변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable(anon) 키 |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | (선택) 네이버 지도 Client ID |

- 로컬도 **운영 DB**에 연결됩니다. 로컬 관리자에서 바꾼 내용은 실제 사이트에 바로 반영됩니다.
- 네이버 지도는 NCP에 등록된 도메인에서만 뜨므로 localhost에서는 표시되지 않습니다.

## 폴더 구조

```
next-app/              Next.js 앱 (Vercel Root Directory)
├─ src/app/(site)/     공개 페이지
├─ src/app/admin/      관리자
├─ src/components/     섹션·UI 컴포넌트
└─ src/lib/            Supabase 조회·제출 로직
supabase/migrations/   DB 변경 SQL (SQL Editor에서 실행)
stories/               화면별 기획·구조 정의
asset/                 디자인 원본 이미지
data/                  Webflow에서 내보낸 원본 CSV
```

## 배포

`main` 브랜치에 push하면 Vercel이 자동으로 배포합니다.
DB 구조를 바꿀 때는 `supabase/migrations/`에 SQL을 추가하고 Supabase SQL Editor에서 실행한 뒤 배포하세요. 코드가 새 컬럼을 쓰면 SQL을 **먼저** 실행해야 합니다.
