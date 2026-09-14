"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * 관리자 로그인 — 지금은 "사용자 본인 1계정으로 테스트"가 목표라 Supabase Auth 이메일/비밀번호
 * 로그인만 붙임(회원가입 화면은 없음 — 계정은 Supabase 대시보드 Authentication → Users →
 * Add user에서 직접 생성). 나중에 여러 관리자를 추가할 때도 같은 대시보드에서 계정만 추가하면 됨.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
      return;
    }
    router.push("/admin/recruit");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f6f7] px-xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[360px] flex-col gap-[16px] rounded-[8px] border border-[#e1e1e1] bg-white p-[32px]"
      >
        <h1 className="text-[20px] font-semibold text-[#111111]">관리자 로그인</h1>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="h-[44px] w-full rounded-[6px] bg-[#111111] text-base font-semibold text-white disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
