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

/**
 * 스토리지 경로는 영문·숫자만 — Supabase Storage 키가 한글 등 비ASCII 문자를 거부해("Invalid key")
 * 한글 파일명 이력서가 업로드조차 안 되던 버그(2026-10-14 제출 테스트로 발견). 경로는 시각+난수+확장자로
 * 만들고, 원래 파일명은 `*_name` 컬럼에 따로 저장해 관리자 다운로드 시 그 이름으로 내려준다.
 */
async function uploadFile(file: File, prefix: "resume" | "portfolio"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "pdf";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
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
    resume_name: input.resumeFile?.name ?? null,
    portfolio_path: portfolioPath,
    portfolio_name: portfolioPath ? input.portfolioFile?.name ?? null : null,
    portfolio_url: portfolioPath ? null : input.portfolioUrl.trim() || null,
    notes: input.notes || null,
  });

  if (error) throw new Error(`제출에 실패했습니다: ${error.message}`);
}
