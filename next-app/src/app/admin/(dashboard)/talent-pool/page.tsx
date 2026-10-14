"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/**
 * 인재풀 신청 목록(2026-10-14) — 공개 폼(`/recruit/talent-pool/apply`) 제출분을 관리자에서 조회.
 * 이전엔 Supabase 대시보드에서만 볼 수 있었음. 파일은 비공개 버킷(`talent-pool-files`)이라 클릭 시
 * 로그인 세션으로 파일을 받아 원래 파일명으로 저장. 삭제는 개인정보 파기 요청 대응용(파일도 함께 삭제) —
 * 행별 🗑 외에 체크박스로 여러 건을 골라 한 번에 지우는 "선택 삭제"도 지원(2026-10-14 요청).
 * 신규 신청 메일 알림(recruit@letsur.ai)은 발송 수단 결정이 필요해 태희님께 이관.
 * 권한: supabase/migrations/20261014_talent_pool_admin.sql (authenticated select/delete).
 */
type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  desired_position: string | null;
  resume_path: string | null;
  resume_name: string | null;
  portfolio_path: string | null;
  portfolio_name: string | null;
  portfolio_url: string | null;
  notes: string | null;
  created_at: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const fileButtonClass =
  "flex items-center gap-1 rounded border border-[#d9dbde] bg-white px-2.5 py-[5px] text-[13px] font-medium whitespace-nowrap text-[#6e6e6e] hover:bg-[#f5f5f5]";

export default function AdminTalentPoolPage() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 삭제 대상 — 행별 🗑은 1건, "선택 삭제"는 체크된 여러 건
  const [deleteTargets, setDeleteTargets] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));

  const load = async () => {
    const { data, error } = await supabase
      .from("talent_pool_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows(data as Submission[]);
    setSelected(new Set());
  };

  useEffect(() => {
    load();
  }, []);

  /**
   * 서명 URL의 `download` 옵션은 한글 파일명을 퍼센트 인코딩된 채(%EC%9D%B4…)로 내려줘 저장 파일명이
   * 깨짐(2026-10-14 확인) — 파일을 blob으로 받아 `<a download>`로 원래 이름을 직접 붙여 저장한다.
   */
  const openFile = async (path: string, name: string | null) => {
    const { data, error } = await supabase.storage.from("talent-pool-files").download(path);
    if (error || !data) {
      setError(`파일을 열 수 없습니다: ${error?.message ?? "알 수 없는 오류"}`);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = name ?? path.split("/").pop() ?? "file";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = async () => {
    if (!deleteTargets.length) return;
    const paths = deleteTargets.flatMap((t) => [t.resume_path, t.portfolio_path]).filter(Boolean) as string[];
    if (paths.length) {
      const { error } = await supabase.storage.from("talent-pool-files").remove(paths);
      if (error) {
        setError(`파일 삭제 실패: ${error.message}`);
        return;
      }
    }
    const { error } = await supabase
      .from("talent_pool_submissions")
      .delete()
      .in(
        "id",
        deleteTargets.map((t) => t.id),
      );
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-base text-red-600">{error}</p>}

      {/* min-h-8 = "선택 삭제" 버튼(h-8) 높이 — 체크 시 버튼이 나타나며 제목 줄이 4px 늘어나 표 전체가
          아래로 밀리던 문제 방지(2026-10-14) */}
      <div className="flex min-h-8 flex-row items-center justify-between">
        <span className="text-lg font-semibold text-[#0a0a0a]">인재풀 신청 ({rows.length})</span>
        {selected.size > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteTargets(rows.filter((r) => selected.has(r.id)))}
            className="text-red-600 hover:text-red-600"
          >
            <Trash2 />
            선택 삭제 ({selected.size})
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-[40px] w-[40px] bg-[#f9f9f9]">
              <Checkbox
                aria-label="전체 선택"
                checked={allSelected}
                indeterminate={selected.size > 0 && !allSelected}
                onCheckedChange={toggleAll}
                disabled={rows.length === 0}
              />
            </TableHead>
            <TableHead className="h-[40px] w-[140px] bg-[#f9f9f9]">이름</TableHead>
            <TableHead className="h-[40px] bg-[#f9f9f9]">연락처</TableHead>
            <TableHead className="h-[40px] w-[160px] bg-[#f9f9f9]">희망 포지션</TableHead>
            <TableHead className="h-[40px] bg-[#f9f9f9]">제출 서류</TableHead>
            <TableHead className="h-[40px] w-[200px] bg-[#f9f9f9]">추천인</TableHead>
            <TableHead className="h-[40px] w-[150px] bg-[#f9f9f9]">제출 날짜</TableHead>
            <TableHead className="h-[40px] w-[64px] bg-[#f9f9f9] text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} className={selected.has(r.id) ? "bg-muted/50" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`${r.name} 선택`}
                  checked={selected.has(r.id)}
                  onCheckedChange={() => toggleOne(r.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="text-sm">
                <div className="flex flex-col">
                  <a href={`mailto:${r.email}`} className="hover:underline">
                    {r.email}
                  </a>
                  <span className="text-muted-foreground">{r.phone}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{r.desired_position ?? <span className="text-muted-foreground">-</span>}</TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  {r.resume_path && (
                    <button type="button" onClick={() => openFile(r.resume_path!, r.resume_name)} className={fileButtonClass}>
                      <Download className="size-[14px]" />
                      이력서
                    </button>
                  )}
                  {r.portfolio_path && (
                    <button
                      type="button"
                      onClick={() => openFile(r.portfolio_path!, r.portfolio_name)}
                      className={fileButtonClass}
                    >
                      <Download className="size-[14px]" />
                      기타 서류
                    </button>
                  )}
                  {r.portfolio_url && (
                    <a href={r.portfolio_url} target="_blank" rel="noopener noreferrer" className={fileButtonClass}>
                      <ExternalLink className="size-[14px]" />
                      링크
                    </a>
                  )}
                  {!r.resume_path && !r.portfolio_path && !r.portfolio_url && (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm" title={r.notes ?? undefined}>
                {r.notes ?? <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap text-muted-foreground">{formatDate(r.created_at)}</TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  onClick={() => setDeleteTargets([r])}
                  aria-label="신청 삭제"
                  className="ml-auto flex size-8 items-center justify-center rounded border border-[#d9dbde] bg-white text-[#6e6e6e] hover:bg-[#f5f5f5] hover:text-red-600"
                >
                  <Trash2 className="size-[16px]" />
                </button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="pt-6 pb-4 text-center text-sm text-muted-foreground">
                접수된 인재풀 신청이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleteTargets.length > 0}
        onOpenChange={(o) => !o && setDeleteTargets([])}
        title="신청 삭제"
        description={
          deleteTargets.length === 1
            ? `"${deleteTargets[0].name}" 님의 신청과 첨부 파일을 삭제할까요? 되돌릴 수 없습니다.`
            : `선택한 ${deleteTargets.length}건의 신청과 첨부 파일을 삭제할까요? 되돌릴 수 없습니다.`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
