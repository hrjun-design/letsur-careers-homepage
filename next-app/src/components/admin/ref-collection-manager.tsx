"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * 직군/경력사항/고용형태 3개 참조 테이블이 전부 (slug, name, sort_order) 구조로 동일해서,
 * 웹플로우 CMS의 "간단한 컬렉션"(채용 공고처럼 여러 필드·리치텍스트가 아니라 이름 하나뿐인
 * 컬렉션) 관리 화면을 공용 컴포넌트 하나로 구현(2026-09-11). `/admin/recruit/{job-groups,
 * careers,employment-types}` 3개 페이지가 이 컴포넌트에 테이블 이름·라벨만 다르게 넘겨 사용.
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
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from(table).select("*").order("sort_order");
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
    load();
  };

  const handleEdit = (row: RefRow) => {
    setForm({ id: row.id, slug: row.slug, name: row.name, sort_order: String(row.sort_order) });
  };

  const handleDelete = async (row: RefRow) => {
    if (!confirm(`"${row.name}" 옵션을 삭제할까요? 이 옵션을 쓰는 공고가 있으면 삭제가 거부됩니다.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) {
      setError(error.message);
      return;
    }
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-base text-red-600">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{form.id ? `${label} 옵션 수정` : `새 ${label} 옵션 추가`}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm text-muted-foreground">표시 이름</label>
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm text-muted-foreground">슬러그 (영문)</label>
              <Input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="flex w-[100px] flex-col gap-1">
              <label className="text-sm text-muted-foreground">정렬 순서</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "저장 중..." : form.id ? "수정" : "추가"}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
                취소
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {label} ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>표시 이름</TableHead>
                <TableHead>슬러그</TableHead>
                <TableHead>순서</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-base text-muted-foreground">{row.slug}</TableCell>
                  <TableCell className="text-base text-muted-foreground">{row.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3 text-base">
                      <button type="button" onClick={() => handleEdit(row)} className="underline">
                        수정
                      </button>
                      <button type="button" onClick={() => handleDelete(row)} className="text-red-600 underline">
                        삭제
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-base text-muted-foreground">
                    등록된 옵션이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
