"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, GraduationCap, Handshake, LayoutGrid, PanelLeftIcon, Target } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * shadcn `sidebar-01` 블록 구조 참고(2026-09-11, 사용자 요청) — "컬렉션별 그룹 내비게이션"
 * 패턴을 그대로 가져와, 웹플로우 CMS의 좌측 컬렉션 목록(채용 공고/직군/경력사항/고용형태)과
 * 동일한 구조로 구성. Base UI 기반 실제 shadcn sidebar 컴포넌트를 설치해 사용(collapsible,
 * 모바일 시트 등 동작 그대로) — `/admin` 전용, 공개 사이트(GlobalNav)와는 완전히 분리.
 * Base UI는 Radix의 `asChild` 대신 `render` prop으로 합성한다(SidebarMenuButton도 동일).
 * 사이드바 접기 토글은 실제 렛서 AI 게이트웨이 어드민 레퍼런스처럼 사이드바 헤더 안(로고 옆)에
 * 배치 — 원래 바깥쪽 페이지 헤더에 있던 `SidebarTrigger`를 이쪽으로 옮김(2026-09-11).
 * 헤더 로고는 접혔을 때 심볼만, 펼쳤을 때 심볼+워드마크(logo-admin.svg)를 노출 — 워드마크
 * 이미지 자체에 고정 width/height를 줘서 사이드바 폭 트랜지션 중 리사이즈돼 보이는 문제를
 * 해결(2026-09-11). 펼침 상태에선 워드마크 옆에 별도 토글 버튼을 두지만, 접힘 상태(48px 폭)는
 * 심볼+토글을 나란히 둘 공간이 없어 `CollapsedLogoToggle` 하나로 합침 — 평소엔 심볼을 보여주고
 * hover 시에만 토글 아이콘으로 바뀌는 방식(Open WebUI 레퍼런스 참고, 2026-09-11).
 * 계정 정보·로그아웃은 2026-09-14부터 이 사이드바 푸터가 아니라 헤더 우측 프로필
 * 아이콘(`UserMenu`)으로 이동 — 중복 노출 방지.
 */
const NAV_ITEMS = [
  { title: "채용 공고", url: "/admin/recruit", icon: Briefcase },
  { title: "직군", url: "/admin/recruit/job-groups", icon: LayoutGrid },
  { title: "경력사항", url: "/admin/recruit/careers", icon: GraduationCap },
  { title: "고용형태", url: "/admin/recruit/employment-types", icon: Handshake },
  { title: "지원 직무", url: "/admin/recruit/desired-positions", icon: Target },
];

function SidebarHeaderTrigger() {
  const { open } = useSidebar();
  return (
    <Tooltip>
      <TooltipTrigger render={<SidebarTrigger size="icon" />} />
      <TooltipContent side="right">{open ? "사이드바 닫기" : "사이드바 열기"}</TooltipContent>
    </Tooltip>
  );
}

/** 접힘 상태 전용 — 평소엔 렛서 심볼, hover 시 토글 아이콘으로 바뀌는 32px 버튼 하나. */
function CollapsedLogoToggle() {
  const { toggleSidebar } = useSidebar();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={toggleSidebar}
            className="group/logo-toggle relative flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-sidebar-accent"
          />
        }
      >
        <img
          src="/logo/logo-admin-symbol.svg"
          alt="LETSUR Admin"
          width={20}
          height={20}
          className="h-[20px] w-[20px] group-hover/logo-toggle:hidden"
        />
        <PanelLeftIcon className="hidden size-4 group-hover/logo-toggle:block" />
        <span className="sr-only">사이드바 열기</span>
      </TooltipTrigger>
      <TooltipContent side="right">사이드바 열기</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 py-1.5 group-data-[collapsible=icon]:justify-center">
          <img
            src="/logo/logo-admin.svg"
            alt="LETSUR Admin"
            width={138}
            height={20}
            className="h-[20px] w-[138px] shrink-0 group-data-[collapsible=icon]:hidden"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarHeaderTrigger />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <CollapsedLogoToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-9 text-sm"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
