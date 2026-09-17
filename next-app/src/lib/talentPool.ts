import { supabase } from "@/lib/supabase";

/**
 * `stories/06-talent-pool.md` 스펙 기준 — 제출 시 파일(있으면) 먼저 `talent-pool-files` 스토리지에
 * 올리고, 경로만 `talent_pool_submissions` 테이블에 저장한다. 버킷이 비공개라 저장되는 건 공개 URL이
 * 아니라 스토리지 내부 경로(추후 관리자 화면에서 서비스 롤로 서명 URL을 발급해 열람하는 걸 전제).
 */
export type TalentPoolSubmissionInput = {
  name: string;
  email: string;
  phone: string;
  desiredPosition: string;
  notes: string;
  resumeFile: File | null;
  /** "기타 제출 서류"는 파일 업로드 또는 URL 링크 둘 중 하나로 받는다 — 동시에 둘 다 값이 있으면
   * 폼에서 선택된 모드(`portfolioMode`)의 값만 넘겨주는 걸 전제로 파일을 우선한다. */
  portfolioFile: File | null;
  portfolioUrl: string;
};

async function uploadFile(file: File, prefix: "resume" | "portfolio"): Promise<string> {
  const path = `${prefix}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("talent-pool-files").upload(path, file);
  if (error) throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
  return path;
}

export async function submitTalentPool(input: TalentPoolSubmissionInput): Promise<void> {
  const [resumePath, portfolioPath] = await Promise.all([
    input.resumeFile ? uploadFile(input.resumeFile, "resume") : Promise.resolve(null),
    input.portfolioFile ? uploadFile(input.portfolioFile, "portfolio") : Promise.resolve(null),
  ]);

  const { error } = await supabase.from("talent_pool_submissions").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    desired_position: input.desiredPosition || null,
    resume_path: resumePath,
    portfolio_path: portfolioPath,
    portfolio_url: portfolioPath ? null : input.portfolioUrl.trim() || null,
    notes: input.notes || null,
  });

  if (error) throw new Error(`제출에 실패했습니다: ${error.message}`);
}
