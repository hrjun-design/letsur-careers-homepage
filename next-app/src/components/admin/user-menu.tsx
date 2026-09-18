"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

/**
 * 헤더 우측 프로필 아이콘 + 드롭다운(2026-09-14, 사용자 제시 레퍼런스 — 렛서 AI 게이트웨이
 * 어드민의 아바타→계정 정보/설정/로그아웃 패턴). 이 프로젝트엔 별도 "문의" 채널이 없어 그 항목은
 * 제외.
 *
 * 관리자가 전혜림 혼자가 아니라 소연님·태희님 등 여러 명이라(2026-09-14 확인) "관리자"라는
 * 고정 라벨 대신 실명이 보여야 함. Supabase Auth는 이메일/비밀번호만으로 계정을 만들어 별도
 * 이름 필드가 없으므로, `user_metadata.full_name`을 이름 저장 위치로 쓴다 — 각자 최초 로그인 후
 * 이 메뉴의 "계정 설정"에서 본인 이름을 직접 등록하는 셀프 서비스 방식(이름 미설정 상태에선
 * 이메일 앞부분을 임시로 보여줌).
 */
export function UserMenu({ user, className }: { user?: User; className?: string }) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState<string | undefined>(user?.user_metadata?.full_name);

  const email = user?.email;
  const shownName = displayName || email?.split("@")[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const resetForm = () => {
    setFullName(displayName ?? "");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setError("비밀번호는 6자 이상이어야 합니다.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
      ...(newPassword ? { password: newPassword } : {}),
    });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDisplayName(fullName.trim() || undefined);
    setNewPassword("");
    setConfirmPassword("");
    setSettingsOpen(false);
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="계정 메뉴"
              className="flex size-8 items-center justify-center rounded-full ring-1 ring-[#e1e1e1] transition-colors hover:ring-[#b1b1b1] focus-visible:outline-none"
            />
          }
        >
          <Avatar>
            <AvatarFallback>
              <UserIcon className="size-4 text-[#888888]" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-56">
          <div className="flex items-center gap-2 px-1.5 py-1.5">
            <Avatar>
              <AvatarFallback>
                <UserIcon className="size-4 text-[#888888]" />
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-[#111111]">{shownName}</span>
              {email && <span className="truncate text-xs text-[#888888]">{email}</span>}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              resetForm();
              setSettingsOpen(true);
            }}
          >
            <Settings />
            계정 설정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계정 설정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="full-name">이름</Label>
              <Input
                id="full-name"
                value={fullName}
                placeholder="예: 전혜림"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="new-password">새 비밀번호 (변경 시에만 입력)</Label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSettingsOpen(false)}>
              취소
            </Button>
            <Button type="button" onClick={handleSave} disabled={submitting}>
              {submitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
