-- 채용 공고 표시 순서(관리자 드래그 정렬) — 2026-10-14
-- Supabase 대시보드 SQL Editor에서 1회 실행

alter table public.jobs add column if not exists sort_order integer not null default 0;

-- 초기값: 현재 공개 목록 정렬(고정 우선 → 게시일 최신순)과 동일하게
with ranked as (
  select id, row_number() over (order by is_pinned desc, display_date desc nulls last, created_at desc) as rn
  from public.jobs
)
update public.jobs j set sort_order = r.rn from ranked r where j.id = r.id;

-- 관리자 드래그 순서 일괄 저장 (배열 순서대로 1..n). security invoker라 RLS(authenticated update 정책) 그대로 적용
create or replace function public.reorder_jobs(ids uuid[])
returns void
language sql
security invoker
set search_path = public
as $$
  update public.jobs j
  set sort_order = t.ord
  from unnest(ids) with ordinality as t(id, ord)
  where j.id = t.id;
$$;

revoke execute on function public.reorder_jobs(uuid[]) from anon, public;
grant execute on function public.reorder_jobs(uuid[]) to authenticated;
