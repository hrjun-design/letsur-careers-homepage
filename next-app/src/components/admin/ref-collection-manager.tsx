"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/**
 * 직군/경력사항/고용형태/지원 직무 4개 참조 테이블이 전부 (slug, name, sort_order) 구조로
 * 동일해서, 웹플로우 CMS의 "간단한 컬렉션"(채용 공고처럼 여러 필드·리치텍스트가 아니라 이름
 * 하나뿐인 컬렉션) 관리 화면을 공용 컴포넌트 하나로 구현(2026-09-11). `/admin/recruit/
 * {job-groups,careers,employment-types,desired-positions}` 4개 페이지가 이 컴포넌트에
 * 테이블 이름·라벨만 다르게 넘겨 사용.
 *
 * 목록 UI — 2026-09-18, 채용 공고 관리 화면과 톤을 맞춰 카드로 감싸던 레이아웃을 제거하고
 * 제목+카운트를 헤더 행에, 테두리 없는 테이블을 그 아래 바로 배치. "새 옵션 추가"도 상시
 * 노출된 인라인 폼 카드 대신, 헤더 우측 버튼으로 열리는 다이얼로그로 변경(수정도 같은
 * 다이얼로그 재사용).
 */
type RefRow = { id: string; slug: string; name: string; sort_order: number };

const emptyForm = { id: null as string | null, slug: "", name: "", sort_order: "0" };

export function RefCollectionManager({
  table,
  label,
}: {
  table: "job_groups" | "careers" | "employment_types" | "desired_positions";
  label: string;
}) {
  const [rows, setRows] = useState<RefRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RefRow | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from(table).select("*").order("sort_order");
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows(data as RefRow[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { slug: form.slug.trim(), name: form.name.trim(), sort_order: Number(form.sort_order) || 0 };
    const result = form.id
      ? await supabase.from(table).update(payload).eq("id", form.id)
      : await supabase.from(table).insert(payload);

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setForm(emptyForm);
    setFormOpen(false);
    load();
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setError(null);
    setFormOpen(true);
  };

  const handleEdit = (row: RefRow) => {
    setForm({ id: row.id, slug: row.slug, name: row.name, sort_order: String(row.sort_order) });
    setError(null);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);
    if (error) {
      setError(error.message);
      return;
    }
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-base text-red-600">{error}</p>}

      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-semibold text-[#0a0a0a]">
          {label} ({rows.length})
        </span>
        <Button
          type="button"
          onClick={handleCreate}
          className="rounded bg-[#00ab7f] font-semibold text-white hover:bg-[#00ab7f]/90"
        >
          <Plus />
          옵션 추가
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-[40px] w-[280px] bg-[#f9f9f9]">표시 이름</TableHead>
            <TableHead className="h-[40px] bg-[#f9f9f9]">슬러그</TableHead>
            <TableHead className="h-[40px] w-[120px] bg-[#f9f9f9]">순서</TableHead>
            <TableHead className="h-[40px] w-[100px] bg-[#f9f9f9] text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.slug}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.sort_order}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        aria-label="작업 메뉴"
                        className="ml-auto flex size-8 items-center justify-center rounded border border-[#d9dbde] bg-white text-[#6e6e6e] hover:bg-[#f5f5f5]"
                      />
                    }
                  >
                    <MoreHorizontal className="size-[16px]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(row)}>
                      <Pencil />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(row)}>
                      <Trash2 />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-base text-muted-foreground">
                등록된 옵션이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setForm(emptyForm);
            setError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? `${label} 옵션 수정` : `새 ${label} 옵션 추가`}</DialogTitle>
          </DialogHeader>
          <form id="ref-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="ref-name">표시 이름</Label>
              <Input
                id="ref-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="ref-slug">슬러그 (영문)</Label>
              <Input
                id="ref-slug"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="ref-sort">정렬 순서</Label>
              <Input
                id="ref-sort"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              취소
            </Button>
            <Button type="submit" form="ref-form" disabled={saving}>
              {saving ? "저장 중..." : form.id ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`${label} 옵션 삭제`}
        description={
          deleteTarget
            ? `"${deleteTarget.name}" 옵션을 삭제할까요? 이 옵션을 쓰는 공고가 있으면 삭제가 거부됩니다.`
            : ""
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
