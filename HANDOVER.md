# 렛서 채용페이지 인수인계

> 작성: 전혜림 · 2026-10-14
> 대상: 김태희님 (채용페이지 운영 관리)

Webflow(`careers.letsur.ai`)로 운영하던 렛서 채용 사이트를 **Next.js + Vercel + Supabase**로 옮긴 프로젝트입니다.
메인 렛서 홈페이지(`letsur-homepage-3.0`)와는 완전히 별개의 사이트예요. 메인 홈페이지 GNB의 "채용"은 이 사이트로 나가는 외부 링크입니다.

코드는 회사 저장소(`letsur-dev`)에 최신본이 올라가 있지만, **배포(Vercel)와 DB(Supabase)는 아직 전혜림 개인 계정**에 있습니다. 아래 [이관 체크리스트](#4-이관-체크리스트)대로 회사 공간으로 옮기면 됩니다.

---

## 1. 바로가기

| 구분 | 주소 |
|---|---|
| 사이트 (임시 배포) | https://letsur-careers-homepage-two.vercel.app |
| 관리자 | https://letsur-careers-homepage-two.vercel.app/admin/login |
| 최종 도메인 (이관 후 연결) | https://careers.letsur.ai (현재는 Webflow를 가리킴) |
| GitHub (회사, 기준 저장소) | https://github.com/letsur-dev/letsur-careers-homepage |
| GitHub (개인, 현재 배포 연결용) | https://github.com/hrjun-design/letsur-careers-homepage · 이관 후 삭제 예정 |
| Vercel | 전혜림 개인 Hobby 계정 · **개인 저장소** `main` push 시 자동 배포 |
| Supabase | `hrjun-design's Project` (ref `vaadjvcbchortgpeobxk`, 리전 ap-southeast-2 시드니, Free 플랜) |

## 2. 사이트 구성

### 공개 페이지

| 경로 | 내용 |
|---|---|
| `/` | Why letsur (회사 소개·미션·서비스) |
| `/culture` | 팀 문화. "렛서의 조직" 섹션은 숨김 상태 → `culture/page.tsx`의 `SHOW_TEAMS`를 `true`로 바꾸면 다시 노출 |
| `/recruit` | 채용공고 목록 + 검색·필터 + FAQ. 공개(`open`) 공고만 노출, 순서는 관리자에서 정한 순서 |
| `/recruit/[slug]` | 공고 상세. 근무지 네이버 지도(클릭 시 네이버 지도 장소 페이지) |
| `/recruit/talent-pool/apply` | 인재풀 등록 폼 (이력서 필수, 기타 서류는 파일 또는 URL) |

### 관리자 (`/admin`, 로그인 필요)

| 메뉴 | 할 수 있는 것 |
|---|---|
| 채용 공고 | 등록·수정·삭제, 공개/비공개 전환, **순서 편집**(우측 상단 [순서 편집] → 드래그 → [순서 저장]) |
| 인재풀 신청 | 신청 목록, 이력서·기타 서류 다운로드(원래 파일명), 개별/선택 삭제(첨부 파일 함께 삭제) |
| 직군 / 경력사항 / 고용형태 / 지원 직무 | 필터·폼에 쓰이는 선택지 추가·수정·삭제 |

- **관리자 계정 추가:** 회원가입 화면이 없습니다. Supabase 대시보드 → Authentication → Users → **Add user**로 만들고, 본인이 로그인 후 우측 상단 프로필 → 계정 설정에서 비밀번호를 바꾸면 됩니다.
- 현재 계정: 전혜림(`hrjun@letsur.ai`), 김태희(`taehee.kim@letsur.ai`), 이소현(`shlee@letsur.ai`)
- **고정 공고**(`is_pinned`, 현재 "렛서 인재풀 등록 안내")는 항상 목록 맨 위에 오고, 순서 편집에서 드래그할 수 없습니다. 고정 여부는 지금 관리자 화면에서 바꿀 수 없어 Supabase에서 직접 수정해야 합니다.

## 3. 기술 정보

### 스택
- Next.js 15 (App Router) + React 19 + Tailwind v4, UI는 shadcn(Base UI 버전, `base-nova`)
- Supabase: DB(Postgres) + Auth(관리자 로그인) + Storage(인재풀 첨부 파일)
- 디자인 토큰(`src/tokens/`)은 메인 홈페이지에서 복사한 것. 자동 동기화가 아니므로 토큰을 바꾸면 양쪽에 수동으로 반영해야 합니다.

### 폴더
```
letsur-careers-3.0/
├─ next-app/              실제 앱 (Vercel Root Directory)
│  └─ src/
│     ├─ app/(site)/      공개 페이지
│     ├─ app/admin/       관리자
│     ├─ components/      섹션·UI 컴포넌트 (ui/ = shadcn)
│     └─ lib/             Supabase 조회·제출 로직
├─ supabase/migrations/   DB 변경 SQL 기록
├─ stories/               화면별 기획·구조 정의
├─ asset/                 Figma에서 export한 원본 이미지
└─ data/                  Webflow에서 내보낸 원본 CSV (이관 시 사용)
```

### DB (Supabase `public` 스키마, 전 테이블 RLS 적용)

| 테이블 | 내용 | 권한 요약 |
|---|---|---|
| `jobs` | 채용 공고 (`status`: draft/open/closed, `is_pinned`, `sort_order`) | 방문자: `open`만 조회 / 관리자: 전체 |
| `job_groups`, `careers`, `employment_types` | 공고의 직군·경력·고용형태 선택지 | 방문자: 조회 / 관리자: 전체 |
| `desired_positions` | 인재풀 폼의 "희망 포지션" 선택지 | 방문자: 조회 / 관리자: 전체 |
| `talent_pool_submissions` | 인재풀 신청 | 방문자: **등록만** / 관리자: 조회·삭제 |

- 함수 `reorder_jobs(ids uuid[])`: 관리자 순서 저장용. 로그인한 관리자만 실행할 수 있습니다.
- Storage 버킷 `talent-pool-files`(**비공개**): 방문자는 업로드만, 관리자는 다운로드·삭제만 할 수 있습니다. 경로는 영문(`resume/시각-난수.pdf`)으로 저장하고, 원래 파일명은 `resume_name`/`portfolio_name` 컬럼에 보관합니다. Storage는 한글 경로를 거부하기 때문입니다.
- `supabase/migrations/`에는 **2026-10-14 이후 변경분만** 있습니다. 초기 테이블은 대시보드에서 직접 만들었습니다. 전체 스키마 파일이 필요하면 Supabase CLI `supabase db dump --schema public`으로 받을 수 있습니다.

### 환경변수 (Vercel · 로컬 `next-app/.env.local`)

| 이름 | 값 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable(anon) 키 |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | (선택) 네이버 지도 Client ID. 없으면 코드의 기본값 `k7qmyg4tzt` 사용 |

- 네이버 지도 키: 이소현님이 NCP 콘솔에서 발급(Application `letsur-recruit-map`). 등록된 도메인은 Vercel 임시 주소와 `careers.letsur.ai` 두 곳이라 **localhost에서는 지도가 뜨지 않는 게 정상**입니다. Client **Secret**은 사용하지 않으며 코드에 넣으면 안 됩니다.

### 로컬 실행
```bash
cd next-app
npm install
npm run dev   # http://localhost:3002
```
- 로컬도 **실제 운영 DB**에 연결됩니다. 로컬 관리자에서 바꾼 내용은 실제 사이트에 바로 반영되니 주의하세요.
- iCloud 동기화 폴더에서 `next dev`를 돌리면 매우 느립니다. iCloud 밖(예: `~/dev/`)에 복사해서 실행하세요.

## 4. 이관 체크리스트

계정을 넘기는 게 아니라 **프로젝트만 회사 공간으로 옮기는** 방식입니다.
- **코드(GitHub):** 회사 저장소 `letsur-dev/letsur-careers-homepage`에 최신본이 이미 올라가 있습니다(2026-10-14). 앞으로는 회사 저장소가 기준입니다.
- **DB(Supabase):** 이전(Transfer) 기능으로 회사 조직에 옮깁니다. 이전 버튼은 보내는 쪽(전혜림)이 누르므로, **태희님이 회사 조직을 만들고 전혜림을 초대**하는 것이 먼저입니다.
- **배포(Vercel):** 옮길 데이터가 없으므로 회사 팀에서 회사 저장소를 새로 연결합니다.

⚠️ **이관 전까지는 두 저장소 모두에 push하세요.** 지금 사이트는 개인 저장소에 연결돼 있어서, 회사 저장소에만 push하면 사이트에 반영되지 않습니다.
```bash
git push personal main   # 사이트 반영 (현재 Vercel 연결)
git push origin main     # 회사 저장소 최신 유지
```

### 0단계: 회사 공간 준비 · 태희님
- [ ] **요금제 결정**
  - Vercel: 조직 소유 비공개 저장소는 Hobby(무료)로 연결할 수 없습니다 → 회사 팀 **Pro**
  - Supabase: Free는 **7일 동안 사용이 없으면 자동 정지**되어 사이트·관리자가 멈춥니다(2026-10-14 실제 발생) → 운영용 **Pro** 권장
- [ ] **GitHub:** 회사 저장소 접근 권한 확인 (Vercel 연결 시 이 저장소를 선택해야 함)
- [ ] **Supabase:** 회사 조직 생성 → 전혜림을 **Owner**로 초대 (양쪽 조직 모두 Owner여야 이전 버튼이 보입니다)
- [ ] **Vercel:** 회사 팀 생성(Pro)

### 1단계: GitHub · 완료
- [x] 회사 저장소 `letsur-dev/letsur-careers-homepage`에 최신본 push (2026-10-14, 커밋 이력 그대로 유지)
- 개인 저장소는 3단계(Vercel 새로 연결)가 끝날 때까지 배포용으로 유지합니다. 그 전에 지우면 사이트 수정 반영이 멈춥니다.

### 2단계: Supabase 이전 · 전혜림
- [ ] 프로젝트 → Project Settings → General → **Transfer project** → 회사 조직 선택
- URL과 키가 그대로라 사이트가 끊기지 않고, 코드·환경변수도 수정할 필요가 없습니다.
- [ ] 이전 확인 후 전혜림 Owner 권한 정리 (필요하면 유지)

### 3단계: Vercel 새로 연결 · 태희님
Vercel에는 옮길 데이터가 없으므로(데이터는 전부 Supabase에 있음) 프로젝트를 이전하기보다 **회사 팀에서 새로 Import**하는 편이 간단합니다.
- [ ] 회사 Vercel 팀 → Add New → Project → `letsur-dev/letsur-careers-homepage` Import
- [ ] **Root Directory: `next-app`** 지정
- [ ] 환경변수 입력: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (값은 Supabase → Project Settings → API, 또는 전혜림에게 전달받기)
- [ ] 배포된 새 주소에서 QA: 공고 목록·상세·인재풀 제출·관리자 로그인과 각 메뉴
  - 네이버 지도는 NCP에 등록된 도메인(현재 Vercel 임시 주소·`careers.letsur.ai`)에서만 뜹니다. 새 Vercel 주소에서는 지도가 안 보이는 게 정상이고, 도메인 연결 후 확인합니다.
- [ ] 확인되면 전혜림이 개인 Vercel 프로젝트 삭제 → 이후 push는 회사 저장소(`origin`)만

### 4단계: 도메인 전환 · 태희님
- [ ] 새 Vercel 프로젝트 → Settings → Domains → `careers.letsur.ai` 추가 → 안내되는 DNS 레코드로 변경 (현재 Webflow를 가리킴)
  - 실제 지원자 트래픽이 넘어오는 시점이므로 날짜를 정해서 진행합니다.
  - 코드가 이미 `careers.letsur.ai` 기준이라 연결 후 수정할 것은 없습니다.
- [ ] 네이버 지도·인재풀 제출 최종 확인
- [ ] **Webflow 해지:** 전환 후 정상 동작을 확인한 다음 해지

### 5단계: 정리
- [ ] 관리자 계정: 전혜림 계정 유지 여부 결정 (Supabase → Authentication → Users)
- [ ] 개인 저장소 `hrjun-design/letsur-careers-homepage` 삭제, 로컬 git remote에서 `personal` 제거

## 5. 남은 작업

**이관과 함께 결정·진행이 필요한 것**
1. **인재풀 신청 알림 메일(`recruit@letsur.ai`):** 발송 수단을 정해야 합니다.
   - A. Resend: `letsur.ai` DNS에 인증 레코드 추가 필요, 무료 월 3,000통
   - B. 회사 Google Workspace 계정: 앱 비밀번호 1개 필요
   - 구현 시 주의: 지금은 브라우저가 Supabase에 직접 저장합니다. 알림을 붙일 때는 **제출을 서버(Route Handler)로 옮겨 저장 성공 시에만 발송**해야 스팸 악용을 막을 수 있습니다. 발송 키는 Vercel 서버 환경변수(`NEXT_PUBLIC_` 아님)에만 둡니다.
   - 알림이 붙기 전까지는 관리자 > 인재풀 신청에서 신규 접수를 확인해야 합니다.
2. **개인정보 수집·이용 동의 문구 법무 검수** (`TalentPoolApplyForm.tsx`, 현재 초안)
   - 보유 기간: 현재 "등록일로부터 2년"
   - 국외 보관: 지원서가 Supabase **호주(시드니)**와 Vercel(미국)에 저장되므로 개인정보처리방침에 국외 이전 고지가 필요한지 확인
   - 선택 동의를 하지 않아도 추천인 입력값이 저장되는 점, 제공하지 않는 제3자 제공 동의 항목 정리
3. **보유 기간이 지난 신청 자동 파기:** 지금은 자동으로 삭제되지 않습니다. 주기적으로 직접 삭제하거나 Supabase Cron(`pg_cron`)으로 하루 한 번 `created_at`이 기간을 넘긴 행과 파일을 지우도록 설정해야 합니다.

**기존에 이월된 것**
- `/culture`, `/admin` 모바일 반응형 점검이 아직 안 되어 있습니다.
- Webflow에 있는 최신 공고 중 아직 옮기지 않은 것이 있을 수 있습니다(예: `forward-deployed-engineer-client-lead`). 관리자에서 등록하면 됩니다.

## 6. 알아두면 좋은 것

- **"로그인 실패"가 뜨는데 비밀번호가 맞다면** Supabase 프로젝트가 정지(Paused)된 경우가 많습니다. 로그인 화면은 어떤 에러든 같은 문구를 보여줍니다. 대시보드에서 Restore project를 누르면 몇 분 뒤 복구됩니다.
- **공고 노출 순서**는 게시일이 아니라 관리자 순서 편집으로 정합니다. 게시일은 정보 표시용입니다.
- **페이지 캐시가 없습니다:** 공고 목록과 상세는 요청마다 DB를 조회하므로 관리자에서 바꾸면 새로고침 즉시 반영됩니다.
- 화면별 기획 의도는 `stories/*.md`, 개발 결정 배경은 `CLAUDE.md`, 날짜별 작업 기록은 `history.md`에 있습니다.
