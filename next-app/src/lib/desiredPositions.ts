import { supabase } from "@/lib/supabase";

/**
 * 인재풀 등록 폼의 "지원 직무" 선택지 — 정해진 목록이 아니라 관리자가 수시로 추가/삭제하므로
 * `job_groups` 등과 동일한 참조 테이블(`desired_positions`) + `/admin/recruit/desired-positions`
 * 관리 화면(`RefCollectionManager` 재사용)으로 운영한다.
 */
export type DesiredPosition = { slug: string; name: string };

export async function getDesiredPositions(): Promise<DesiredPosition[]> {
  const { data, error } = await supabase
    .from("desired_positions")
    .select("slug, name")
    .order("sort_order");

  if (error) {
    console.error("Failed to load desired positions:", error.message);
    return [];
  }
  return data as DesiredPosition[];
}
