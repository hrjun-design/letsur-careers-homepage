"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * 채용 공고 관리자 화면(2026-09-11 shadcn 대시보드 셸로 재구성) — 인증 가드는
 * `(dashboard)/layout.tsx`로 옮겨서 여기서는 데이터만 다룸. 직군/경력사항/고용형태는
 * Supabase 참조 테이블에서 조회(웹플로우 CMS 컬렉션 구조 이관). status는 draft(초안)/
 * open(공개)/closed(마감) 3단계 — 웹플로우의 Draft/Published 개념 반영.
 *
 * 등록/수정 폼 위치 — 2026-09-14, 목록이 최상단 + 우측 상단 "+ 새 공고 등록" 버튼까진 웹플로우
 * CMS 레퍼런스로 확정했으나, 그 버튼 클릭 시 브라우저 팝업(Dialog)으로 뜨는 방식은 사용자가
 * 슈퍼베이스 대시보드 레퍼런스(목록 → 상세 화면이 같은 영역 안에서 전환, 상단에 "< Tables" 같은
 * 뒤로가기 링크만 표시)를 보고 반려 — Dialog를 걷어내고 목록/폼을 같은 카드 영역 안에서
 * `formOpen` 상태로 토글하는 방식으로 변경. 폼 진입 시 상단에 목록으로 돌아가는 링크만 노출.
 */
type RefOption = { id: string; name: string };

type JobRow = {
  id: string;
  slug: string;
  title: string;
  job_group_id: string;
  career_id: string;
  employment_type_id: string;
  location: string | null;
  apply_url: string | null;
  description_html: string | null;
  display_date: string | null;
  status: "draft" | "open" | "closed";
  job_groups: { name: string } | null;
  careers: { name: string } | null;
  employment_types: { name: string } | null;
};

const emptyForm = {
  id: null as string | null,
  slug: "",
  title: "",
  job_group_id: "",
  career_id: "",
  employment_type_id: "",
  location: "",
  apply_url: "",
  description_html: "",
  display_date: "",
  status: "draft" as JobRow["status"],
};

const STATUS_LABEL: Record<JobRow["status"], string> = {
  draft: "초안",
  open: "공개중",
  closed: "마감",
};

const STATUS_VARIANT: Record<JobRow["status"], "secondary" | "default" | "outline"> = {
  draft: "secondary",
  open: "default",
  closed: "outline",
};

// 2026-09-14 — 목록에서 "공개 여부(실제 라이브 중인지)"와 "백오피스 내부 상태(왜 라이브가
// 아닌지: 초안 작성 중 vs 마감됨)"를 별도 열로 나란히 배치해 구분(사용자가 슈퍼베이스 대시보드의
// Published/Status 2열 구조를 레퍼런스로 제시). open일 때만 "공개 여부"가 라이브고, 나머지
// 상세 사유(초안/마감)는 "라이브가 아닐 때"만 오른쪽 열에 표시.
const IS_LIVE = (status: JobRow["status"]) => status === "open";

// Base UI Select는 items 맵을 넘기지 않으면 트리거에 라벨 대신 원시 value(여기선 UUID)를
// 그대로 표시한다 — 직군/경력사항/고용형태/상태 각각에 id/코드 → 표시 문자열 맵을 넘겨준다.
const STATUS_ITEMS: Record<JobRow["status"], string> = {
  draft: "초안 (비공개)",
  open: "공개",
  closed: "마감",
};

export default function AdminRecruitPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [groups, setGroups] = useState<RefOption[]>([]);
  const [careers, setCareers] = useState<RefOption[]>([]);
  const [types, setTypes] = useState<RefOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const groupItems = Object.fromEntries(groups.map((o) => [o.id, o.name]));
  const careerItems = Object.fromEntries(careers.map((o) => [o.id, o.name]));
  const typeItems = Object.fromEntries(types.map((o) => [o.id, o.name]));

  const loadRefTables = async () => {
    const [g, c, t] = await Promise.all([
      supabase.from("job_groups").select("id, name").order("sort_order"),
      supabase.from("careers").select("id, name").order("sort_order"),
      supabase.from("employment_types").select("id, name").order("sort_order"),
    ]);
    if (g.data) setGroups(g.data);
    if (c.data) setCareers(c.data);
    if (t.data) setTypes(t.data);
  };

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, job_groups(name), careers(name), employment_types(name)")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      return;
    }
    setJobs(data as unknown as JobRow[]);
  };

  useEffect(() => {
    loadRefTables();
    loadJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.job_group_id || !form.career_id || !form.employment_type_id) {
      setError("직군·경력사항·고용형태를 모두 선택해 주세요.");
      return;
    }

    setSaving(true);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      job_group_id: form.job_group_id,
      career_id: form.career_id,
      employment_type_id: form.employment_type_id,
      location: form.location.trim() || null,
      apply_url: form.apply_url.trim() || null,
      description_html: form.description_html.trim() || null,
      display_date: form.display_date || null,
      status: form.status,
    };

    const result = form.id
      ? await supabase.from("jobs").update(payload).eq("id", form.id)
      : await supabase.from("jobs").insert(payload);

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setForm(emptyForm);
    setFormOpen(false);
    loadJobs();
  };

  const handleBack = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setError(null);
  };

  const handleEdit = (job: JobRow) => {
    setForm({
      id: job.id,
      slug: job.slug,
      title: job.title,
      job_group_id: job.job_group_id,
      career_id: job.career_id,
      employment_type_id: job.employment_type_id,
      location: job.location ?? "",
      apply_url: job.apply_url ?? "",
      description_html: job.description_html ?? "",
      display_date: job.display_date ?? "",
      status: job.status,
    });
    setFormOpen(true);
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setError(null);
    setFormOpen(true);
  };

  const setStatus = async (job: JobRow, status: JobRow["status"]) => {
    const { error } = await supabase.from("jobs").update({ status }).eq("id", job.id);
    if (error) {
      setError(error.message);
      return;
    }
    loadJobs();
  };

  const handleDelete = async (job: JobRow) => {
    if (!confirm(`"${job.title}" 공고를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const { error } = await supabase.from("jobs").delete().eq("id", job.id);
    if (error) {
      setError(error.message);
      return;
    }
    loadJobs();
  };

  if (formOpen) {
    return (
      <div className="flex flex-col gap-4">
        {error && <p className="rounded-md bg-red-50 px-4 py-2 text-base text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleBack}
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          전체 공고
        </button>

        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "공고 수정" : "새 공고 등록"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="공고 제목"
              />
              <Input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="URL 슬러그 (영문 소문자·숫자·하이픈만)"
                pattern="[a-z0-9\-]+"
              />
              <div className="flex gap-3">
                <Select
                  items={groupItems}
                  value={form.job_group_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, job_group_id: v ?? f.job_group_id }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={`직군 (${groups.length})`} />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  items={careerItems}
                  value={form.career_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, career_id: v ?? f.career_id }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={`경력사항 (${careers.length})`} />
                  </SelectTrigger>
                  <SelectContent>
                    {careers.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  items={typeItems}
                  value={form.employment_type_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, employment_type_id: v ?? f.employment_type_id }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={`고용형태 (${types.length})`} />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="근무지 (선택)"
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={form.display_date}
                  onChange={(e) => setForm((f) => ({ ...f, display_date: e.target.value }))}
                  className="w-[160px]"
                />
              </div>
              <Input
                type="url"
                value={form.apply_url}
                onChange={(e) => setForm((f) => ({ ...f, apply_url: e.target.value }))}
                placeholder="지원 링크 (외부 채용 플랫폼 URL, 선택)"
              />
              <Textarea
                value={form.description_html}
                onChange={(e) => setForm((f) => ({ ...f, description_html: e.target.value }))}
                placeholder="상세 설명 (HTML — 향후 리치텍스트 에디터로 교체 예정, 지금은 HTML 직접 입력)"
                rows={6}
                className="font-mono text-base"
              />
              <Select
                items={STATUS_ITEMS}
                value={form.status}
                onValueChange={(v) => v && setForm((f) => ({ ...f, status: v as JobRow["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">초안 (비공개)</SelectItem>
                  <SelectItem value="open">공개</SelectItem>
                  <SelectItem value="closed">마감</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "저장 중..." : form.id ? "수정 저장" : "등록"}
                </Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-base text-red-600">{error}</p>}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>전체 공고 ({jobs.length})</CardTitle>
          <Button type="button" onClick={handleCreate}>
            <Plus />
            새 공고 등록
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>공개 여부</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>직군 · 경력 · 고용형태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {job.title}
                    <p className="text-sm text-muted-foreground">/recruit/{job.slug}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm ${
                        IS_LIVE(job.status) ? "text-[#00ab7f]" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          IS_LIVE(job.status) ? "bg-[#00ab7f]" : "bg-muted-foreground/40"
                        }`}
                      />
                      {IS_LIVE(job.status) ? "공개중" : "비공개"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {!IS_LIVE(job.status) && (
                      <Badge variant={STATUS_VARIANT[job.status]}>{STATUS_LABEL[job.status]}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-base text-muted-foreground">
                    {job.job_groups?.name} · {job.careers?.name} · {job.employment_types?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3 text-base">
                      <div className="flex items-center gap-3">
                        {job.status !== "open" && (
                          <button type="button" onClick={() => setStatus(job, "open")} className="text-[#00ab7f] underline">
                            공개
                          </button>
                        )}
                        {job.status !== "closed" && (
                          <button type="button" onClick={() => setStatus(job, "closed")} className="underline">
                            마감
                          </button>
                        )}
                        {job.status !== "draft" && (
                          <button type="button" onClick={() => setStatus(job, "draft")} className="underline">
                            초안
                          </button>
                        )}
                      </div>
                      <span className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => handleEdit(job)} className="underline">
                          수정
                        </button>
                        <button type="button" onClick={() => handleDelete(job)} className="text-red-600 underline">
                          삭제
                        </button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-base text-muted-foreground">
                    등록된 공고가 없습니다.
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
