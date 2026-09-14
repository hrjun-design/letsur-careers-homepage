import { supabase } from "@/lib/supabase";

/**
 * Supabase `jobs` 조회 공용 헬퍼 — 목록(`/recruit`)·상세(`/recruit/[slug]`) 페이지가 공유.
 * job_group_id/career_id/employment_type_id는 각각 job_groups/careers/employment_types 테이블을
 * 참조(FK)하므로, PostgREST 임베디드 리소스 문법(`job_groups(name)`)으로 조인해 표시 라벨을 가져온다.
 */
const JOB_SELECT =
  "slug, title, location, apply_url, description_html, display_date, job_groups(name), careers(name), employment_types(name)";

type JobRow = {
  slug: string;
  title: string;
  location: string | null;
  apply_url: string | null;
  description_html: string | null;
  display_date: string | null;
  job_groups: { name: string } | null;
  careers: { name: string } | null;
  employment_types: { name: string } | null;
};

export type JobSummary = {
  slug: string;
  title: string;
  group: string;
  career: string;
  type: string;
};

export type JobDetail = JobSummary & {
  location: string | null;
  applyUrl: string | null;
  descriptionHtml: string | null;
  displayDate: string | null;
};

function toDetail(row: JobRow): JobDetail {
  return {
    slug: row.slug,
    title: row.title,
    group: row.job_groups?.name ?? "",
    career: row.careers?.name ?? "",
    type: row.employment_types?.name ?? "",
    location: row.location,
    applyUrl: row.apply_url,
    descriptionHtml: row.description_html,
    displayDate: row.display_date,
  };
}

export async function getOpenJobs(): Promise<JobSummary[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("status", "open")
    .order("display_date", { ascending: false });

  if (error) {
    console.error("Failed to load jobs:", error.message);
    return [];
  }
  return (data as unknown as JobRow[]).map(toDetail);
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("slug", slug)
    .eq("status", "open")
    .maybeSingle();

  if (error || !data) return null;
  return toDetail(data as unknown as JobRow);
}
