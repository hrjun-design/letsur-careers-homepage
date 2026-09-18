"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { UserMenu } from "@/components/admin/user-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * `/admin/*`(단, `/admin/login` 제외 — 그쪽은 이 그룹 밖) 공용 셸. 로그인 세션이 없으면
 * `/admin/login`으로 리다이렉트하는 인증 가드를 여기 한 곳에만 둬서, 각 하위 페이지(공고/직군/
 * 경력사항/고용형태)마다 반복하지 않는다. shadcn sidebar-01 블록 구조(SidebarProvider +
 * AppSidebar + SidebarInset + 헤더) 참고(2026-09-11).
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setSession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) router.replace("/admin/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (session === "loading") return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#e1e1e1] px-4">
          <span className="text-base font-medium text-[#111111]">렛서 채용 관리</span>
          <UserMenu user={session?.user} className="ml-auto" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
