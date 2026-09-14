import { createClient } from "@supabase/supabase-js";

/**
 * Publishable(anon) 키 기반 클라이언트 — RLS(Row Level Security)로 접근 범위가 제한되어
 * 서버/클라이언트 어디서 써도 안전하다. 관리자 전용 쓰기 작업(공고 등록/수정 등)은 이 클라이언트로는
 * 불가능하고(RLS가 막음), 이후 관리자 인증을 붙이면 그 세션으로 별도 처리한다.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
