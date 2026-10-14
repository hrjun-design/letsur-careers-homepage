-- 인재풀 신청 관리자 조회 + 한글 파일명 대응 — 2026-10-14
-- Supabase 대시보드 SQL Editor에서 1회 실행 (⚠️ 프론트 배포 전에 실행해야 함: 제출 시 *_name 컬럼에 저장)

-- 원래 파일명 보관 (스토리지 경로는 영문화, 다운로드 시 원래 이름으로)
alter table public.talent_pool_submissions add column if not exists resume_name text;
alter table public.talent_pool_submissions add column if not exists portfolio_name text;

-- 로그인한 관리자: 신청 조회·삭제(개인정보 파기 요청 대응)
create policy "Authenticated can read talent pool"
  on public.talent_pool_submissions for select to authenticated using (true);
create policy "Authenticated can delete talent pool"
  on public.talent_pool_submissions for delete to authenticated using (true);

-- 로그인한 관리자: 첨부 파일 서명 URL 발급(select)·삭제
create policy "Authenticated can read talent pool files"
  on storage.objects for select to authenticated using (bucket_id = 'talent-pool-files');
create policy "Authenticated can delete talent pool files"
  on storage.objects for delete to authenticated using (bucket_id = 'talent-pool-files');
