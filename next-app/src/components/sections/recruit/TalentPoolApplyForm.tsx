"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { submitTalentPool } from "@/lib/talentPool";

/**
 * `stories/06-talent-pool.md` 스펙 기준 구현(테레스 레퍼런스 채택분) — 계정 없는 1회성 폼.
 * ⚠️ 개인정보 수집·이용 동의 문구는 초안입니다 — 스펙 문서에도 명시된 대로 실제 배포 전
 * 렛서 법무/개인정보처리방침 기준으로 검수·수정이 필요합니다.
 */

function FileField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputId = `file-${label}`;
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-base font-medium text-[#111111]">{label}</span>
      <div className="flex items-center gap-[12px]">
        <label
          htmlFor={inputId}
          className="flex h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#cccccc] bg-white px-[16px] text-sm font-medium text-[#333333] hover:bg-[#f5f5f5]"
        >
          파일 올리기
        </label>
        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0] ?? null)}
        />
        <span className="truncate text-sm text-[#6e6e6e]">{file ? file.name : "선택된 파일 없음"}</span>
      </div>
    </div>
  );
}

export default function TalentPoolApplyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [desiredPosition, setDesiredPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = name.trim() && email.trim() && phone.trim() && agreed && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitTalentPool({ name, email, phone, desiredPosition, notes, resumeFile, portfolioFile });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex w-full max-w-[780px] flex-col items-start gap-[16px] py-[80px]">
        <h1 className="text-[28px] font-semibold text-[#111111]">등록이 완료되었습니다</h1>
        <p className="text-base text-[#333333]">
          인재풀에 등록해주셔서 감사합니다. 관련 포지션이 열리면 남겨주신 연락처로 안내드리겠습니다.
        </p>
        <Link href="/recruit" className="mt-[16px] text-base font-medium text-[#00ab7f] underline">
          ← 채용공고 목록으로
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[780px] flex-col gap-[48px] py-[60px] lg:py-[80px]">
      <div className="flex flex-col gap-[8px]">
        <p className="text-sm text-[#6e6e6e]">
          <Link href="/recruit/talent-pool" className="underline">
            ← 상시 인재풀 등록 안내로
          </Link>
        </p>
        <h1 className="text-[28px] font-semibold text-[#111111] lg:text-[32px]">인재풀 등록하기</h1>
      </div>

      {/* 기본정보 */}
      <div className="flex flex-col gap-[24px]">
        <h2 className="text-lg font-semibold text-[#111111]">기본정보</h2>
        <label className="flex flex-col gap-[8px]">
          <span className="text-base font-medium text-[#111111]">
            이름 <span className="text-[#e0433c]">•</span>
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
          />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-base font-medium text-[#111111]">
            이메일 <span className="text-[#e0433c]">•</span>
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
          />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-base font-medium text-[#111111]">
            전화번호 <span className="text-[#e0433c]">•</span>
          </span>
          <input
            required
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
          />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-base font-medium text-[#111111]">희망 포지션</span>
          <input
            value={desiredPosition}
            onChange={(e) => setDesiredPosition(e.target.value)}
            placeholder="예: 프론트엔드 엔지니어"
            className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
          />
        </label>
      </div>

      {/* 제출서류 */}
      <div className="flex flex-col gap-[24px]">
        <h2 className="text-lg font-semibold text-[#111111]">제출서류</h2>
        <FileField label="이력서" file={resumeFile} onChange={setResumeFile} />
        <FileField label="포트폴리오" file={portfolioFile} onChange={setPortfolioFile} />
      </div>

      {/* 추가질문 */}
      <div className="flex flex-col gap-[24px]">
        <h2 className="text-lg font-semibold text-[#111111]">추가질문</h2>
        <label className="flex flex-col gap-[8px]">
          <span className="text-base font-medium text-[#111111]">경력·경험 자유 기재</span>
          <span className="text-sm text-[#6e6e6e]">
            경력·경험이 담긴 추가 자료가 있으시다면 자유롭게 기재해주세요 (링크드인, 노션, SNS, Github 등)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full rounded-[6px] border border-[#cccccc] px-[14px] py-[10px] text-base text-[#111111]"
          />
        </label>
      </div>

      {/* 개인정보 수집 및 이용 동의 */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-lg font-semibold text-[#111111]">개인정보 수집 및 이용 동의</h2>
        <div className="h-[160px] overflow-y-auto rounded-[6px] border border-[#cccccc] bg-[#fafafa] p-[16px] text-sm leading-[1.6] text-[#555555]">
          <p className="mb-[8px] font-semibold text-[#333333]">
            ⚠️ 아래 문구는 초안입니다 — 실제 배포 전 렛서 개인정보처리방침 기준으로 검수가 필요합니다.
          </p>
          <p>렛서(이하 &ldquo;회사&rdquo;)는 인재풀 등록을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
          <p>· 수집 항목: 이름, 이메일, 전화번호, 희망 포지션, 이력서·포트폴리오(첨부 시), 기타 기재 내용</p>
          <p>· 수집 목적: 인재풀 관리 및 관련 포지션 발생 시 연락</p>
          <p>· 보유 기간: 등록일로부터 2년 또는 채용 절차 완료 시까지</p>
          <p>
            귀하는 개인정보 수집·이용에 동의하지 않으실 수 있으나, 동의하지 않으실 경우 인재풀 등록이
            제한됩니다.
          </p>
        </div>
        <label className="flex items-center gap-[8px]">
          <input
            required
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-[18px] w-[18px]"
          />
          <span className="text-base text-[#111111]">개인정보 수집 및 이용에 동의합니다. (필수)</span>
        </label>
      </div>

      {error && <p className="text-sm text-[#e0433c]">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex h-[52px] w-full items-center justify-center bg-[#00ab7f] text-lg font-bold text-white disabled:cursor-not-allowed disabled:bg-[#cccccc]"
      >
        {submitting ? "제출 중..." : "작성 완료"}
      </button>
    </form>
  );
}
