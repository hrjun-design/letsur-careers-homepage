"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, FileUp } from "lucide-react";
import { submitTalentPool } from "@/lib/talentPool";
import type { DesiredPosition } from "@/lib/desiredPositions";
import { FilterDropdown } from "@/components/ui/filter-dropdown";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `stories/06-talent-pool.md` 스펙 기준 구현(테레스 레퍼런스 채택분) — 계정 없는 1회성 폼.
 * ⚠️ 개인정보 수집·이용 동의 문구는 초안입니다 — 스펙 문서에도 명시된 대로 실제 배포 전
 * 렛서 법무/개인정보처리방침 기준으로 검수·수정이 필요합니다.
 *
 * UI는 모두싸인 인재풀 등록 페이지(recruit.modusign.co.kr) 참고 — 우측에 섹션 이동 네비게이션(현재
 * 스크롤 위치를 IntersectionObserver로 추적해 활성 표시) + 항상 보이는 제출 버튼을 붙인 2단 레이아웃.
 * 데스크톱(`lg:`)에서만 사이드바를 보여주고, 모바일은 기존처럼 폼 하단에 제출 버튼 하나만 유지.
 */

const SECTIONS = [
  { id: "basic-info", label: "기본정보" },
  { id: "documents", label: "제출서류" },
  { id: "additional", label: "추가질문" },
  { id: "consent", label: "개인정보 수집 및 이용 동의" },
];

const FORM_ID = "talent-pool-form";

function UploadDropzone({ id, file, onChange }: { id: string; file: File | null; onChange: (file: File | null) => void }) {
  return (
    <>
      <label
        htmlFor={id}
        className="flex h-[48px] w-full cursor-pointer items-center gap-[8px] rounded-[6px] border border-dashed border-[#cccccc] bg-white px-[16px] text-sm font-medium text-[#6e6e6e] hover:bg-[#f5f5f5]"
      >
        <FileUp className="size-[16px] shrink-0" />
        <span className="truncate">{file ? file.name : "파일 업로드"}</span>
      </label>
      <input
        id={id}
        type="file"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0] ?? null)}
      />
    </>
  );
}

/**
 * 개인정보 동의 아코디언 항목 하나 — 모두싸인 참고(2026-09-15): 체크박스 + 라벨 + 우측 쉐브론으로
 * 펼쳐서 상세 문구를 볼 수 있는 구조. 체크와 펼침은 서로 독립(체크 안 해도 펼쳐볼 수 있음).
 */
function ConsentItem({
  checked,
  onCheckedChange,
  label,
  badge,
  badgeColor,
  expanded,
  onToggleExpand,
  children,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  badge: string;
  badgeColor: string;
  expanded: boolean;
  onToggleExpand: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-[8px]">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="h-[18px] w-[18px]"
          />
          <span className="text-base text-[#111111]">
            {label} <span className={badgeColor}>{badge}</span>
          </span>
        </label>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={expanded ? "상세 접기" : "상세 펼치기"}
          className="flex h-[24px] w-[24px] shrink-0 items-center justify-center text-[#999999]"
        >
          <ChevronDown className={`size-[16px] transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      {expanded && (
        <div className="rounded-[6px] border border-[#e1e1e1] bg-[#fafafa] p-[16px] text-sm leading-[1.6] text-[#555555]">
          {children}
        </div>
      )}
    </div>
  );
}

function FileField({
  label,
  hint,
  required,
  file,
  onChange,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputId = `file-${label}`;
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-col gap-[2px]">
        <span className="text-base font-medium text-[#111111]">
          {label} {required && <span className="text-[#e0433c]">•</span>}
        </span>
        {hint && <span className="text-sm text-[#6e6e6e]">{hint}</span>}
      </div>
      <UploadDropzone id={inputId} file={file} onChange={onChange} />
    </div>
  );
}

export default function TalentPoolApplyForm({ positions }: { positions: DesiredPosition[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCheckResult, setEmailCheckResult] = useState<"valid" | "invalid" | null>(null);
  const [phone, setPhone] = useState("");
  const [desiredPosition, setDesiredPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioMode, setPortfolioMode] = useState<"file" | "url">("file");
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentOptional, setConsentOptional] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);
  const [expandedConsent, setExpandedConsent] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const allConsented = consentRequired && consentOptional && consentThirdParty;
  const canSubmit = name.trim() && email.trim() && phone.trim() && consentRequired && !submitting;

  useEffect(() => {
    if (done) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    // 마지막 섹션은 문서 길이가 짧으면 화면 끝까지 스크롤해도 위 옵저버의 감지 영역에 안 걸릴 수 있어서
    // (실제로 겪음: 개인정보 섹션이 항상 활성화 안 되던 버그) 문서 최하단 근처면 강제로 마지막 섹션을 활성화.
    const handleScroll = () => {
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      if (nearBottom) setActiveSection(SECTIONS[SECTIONS.length - 1].id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [done]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitTalentPool({
        name,
        email,
        phone,
        desiredPosition,
        notes,
        resumeFile,
        portfolioFile: portfolioMode === "file" ? portfolioFile : null,
        portfolioUrl: portfolioMode === "url" ? portfolioUrl : "",
      });
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

  const submitButton = (
    <button
      type="submit"
      form={FORM_ID}
      disabled={submitting}
      className="flex h-[52px] w-full items-center justify-center bg-[#00ab7f] text-lg font-semibold text-white transition-colors hover:bg-[#00966d] disabled:cursor-not-allowed"
    >
      {submitting ? "제출 중..." : "제출하기"}
    </button>
  );

  return (
    <div className="grid w-full max-w-[1216px] grid-cols-1 gap-[48px] py-[60px] lg:grid-cols-[1fr_356px] lg:gap-[80px] lg:py-[80px]">
      <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-[72px]">
        <div className="flex flex-col gap-[16px]">
          <Link
            href="/recruit/talent-pool"
            aria-label="상시 인재풀 등록 안내로"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5]"
          >
            <ArrowLeft className="size-[20px]" />
          </Link>
          <h1 className="text-[26px] font-semibold text-[#111111] lg:text-[36px]">인재풀 등록하기</h1>
        </div>

        {/* 기본정보 */}
        <div id="basic-info" className="flex scroll-mt-[100px] flex-col gap-[24px]">
          <h2 className="text-xl font-semibold text-[#111111]">기본정보</h2>
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
              이메일주소 <span className="text-[#e0433c]">•</span>
            </span>
            <div className="flex items-center gap-[12px]">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailCheckResult(null);
                }}
                className="h-[44px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
              />
              <button
                type="button"
                onClick={() => setEmailCheckResult(EMAIL_PATTERN.test(email.trim()) ? "valid" : "invalid")}
                className="flex h-[44px] shrink-0 items-center justify-center rounded-[6px] border border-[#cccccc] bg-white px-[16px] text-sm font-medium text-[#333333] hover:bg-[#f5f5f5]"
              >
                이메일 확인
              </button>
            </div>
            {emailCheckResult && (
              <span className={`text-sm ${emailCheckResult === "valid" ? "text-[#00ab7f]" : "text-[#e0433c]"}`}>
                {emailCheckResult === "valid" ? "사용 가능한 이메일 형식입니다." : "이메일 형식을 확인해주세요."}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-[8px]">
            <span className="text-base font-medium text-[#111111]">
              연락처 <span className="text-[#e0433c]">•</span>
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
        </div>

        {/* 제출서류 */}
        <div id="documents" className="flex scroll-mt-[100px] flex-col gap-[24px]">
          <h2 className="text-xl font-semibold text-[#111111]">제출서류</h2>
          <FileField
            label="이력서"
            hint="PDF 형식으로 제출해주세요."
            required
            file={resumeFile}
            onChange={setResumeFile}
          />
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-base font-medium text-[#111111]">기타 제출 서류</span>
              <span className="text-sm text-[#6e6e6e]">PDF 형식으로 제출해주세요.</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[48px] shrink-0 overflow-hidden rounded-[6px] border border-[#cccccc]">
                <button
                  type="button"
                  onClick={() => setPortfolioMode("file")}
                  className={`flex h-full items-center px-[16px] text-sm font-medium ${
                    portfolioMode === "file" ? "bg-[#e6f7f2] text-[#00ab7f]" : "bg-white text-[#6e6e6e]"
                  }`}
                >
                  파일
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioMode("url")}
                  className={`flex h-full items-center border-l border-[#cccccc] px-[16px] text-sm font-medium ${
                    portfolioMode === "url" ? "bg-[#e6f7f2] text-[#00ab7f]" : "bg-white text-[#6e6e6e]"
                  }`}
                >
                  URL
                </button>
              </div>
              {portfolioMode === "file" ? (
                <UploadDropzone id="file-기타 제출 서류" file={portfolioFile} onChange={setPortfolioFile} />
              ) : (
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://"
                  className="h-[48px] w-full rounded-[6px] border border-[#cccccc] px-[14px] text-base text-[#111111]"
                />
              )}
            </div>
          </div>
        </div>

        {/* 추가질문 */}
        <div id="additional" className="flex scroll-mt-[100px] flex-col gap-[24px]">
          <h2 className="text-xl font-semibold text-[#111111]">추가질문</h2>
          <div className="flex flex-col gap-[8px]">
            <span className="text-base font-medium text-[#111111]">희망 포지션</span>
            <FilterDropdown
              label="선택"
              options={positions.map((p) => p.name)}
              value={desiredPosition}
              onChange={setDesiredPosition}
            />
          </div>
          <label className="flex flex-col gap-[8px]">
            <span className="text-base font-medium text-[#111111]">
              렛서 임직원 추천일 경우, 추천자의 성함을 적어주세요:)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              maxLength={1000}
              rows={5}
              className="w-full rounded-[6px] border border-[#cccccc] px-[14px] py-[10px] text-base text-[#111111]"
            />
            <span className="self-end text-sm text-[#999999]">{notes.length}/1000</span>
          </label>
        </div>

        {/* 개인정보 수집 및 이용 동의 */}
        <div id="consent" className="flex scroll-mt-[100px] flex-col gap-[20px]">
          <h2 className="text-xl font-semibold text-[#111111]">개인정보 수집 및 이용 동의</h2>
          <p className="text-sm font-semibold text-[#e0433c]">
            ⚠️ 아래 문구는 초안입니다 — 실제 배포 전 렛서 개인정보처리방침 기준으로 검수가 필요합니다.
          </p>

          <label className="flex items-center gap-[8px] border-b border-[#e1e1e1] pb-[20px]">
            <input
              type="checkbox"
              checked={allConsented}
              onChange={(e) => {
                const next = e.target.checked;
                setConsentRequired(next);
                setConsentOptional(next);
                setConsentThirdParty(next);
              }}
              className="h-[18px] w-[18px]"
            />
            <span className="text-base font-semibold text-[#111111]">전체 동의</span>
          </label>

          <ConsentItem
            checked={consentRequired}
            onCheckedChange={setConsentRequired}
            label="개인정보 필수항목 수집 및 이용 동의"
            badge="(필수)"
            badgeColor="text-[#e0433c]"
            expanded={expandedConsent === "required"}
            onToggleExpand={() => setExpandedConsent((cur) => (cur === "required" ? null : "required"))}
          >
            <p>렛서(이하 &ldquo;회사&rdquo;)는 인재풀 등록을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
            <p>· 수집 항목: 이름, 이메일, 전화번호, 희망 포지션, 이력서·기타 제출 서류(첨부 시)</p>
            <p>· 수집 목적: 인재풀 관리 및 관련 포지션 발생 시 연락</p>
            <p>· 보유 기간: 등록일로부터 2년 또는 채용 절차 완료 시까지</p>
            <p>
              귀하는 개인정보 수집·이용에 동의하지 않으실 수 있으나, 동의하지 않으실 경우 인재풀 등록이
              제한됩니다.
            </p>
          </ConsentItem>

          <ConsentItem
            checked={consentOptional}
            onCheckedChange={setConsentOptional}
            label="개인정보 선택항목 수집 및 이용 동의"
            badge="(선택)"
            badgeColor="text-[#999999]"
            expanded={expandedConsent === "optional"}
            onToggleExpand={() => setExpandedConsent((cur) => (cur === "optional" ? null : "optional"))}
          >
            <p>· 수집 항목: 추천인 정보(렛서 임직원 추천일 경우 추천자 성함)</p>
            <p>· 수집 목적: 내부 추천 경로 확인 및 추천 프로세스 운영</p>
            <p>선택 항목이므로 동의하지 않으셔도 인재풀 등록에는 제한이 없습니다.</p>
          </ConsentItem>

          <ConsentItem
            checked={consentThirdParty}
            onCheckedChange={setConsentThirdParty}
            label="개인정보 제3자 이용제공 동의"
            badge="(선택)"
            badgeColor="text-[#999999]"
            expanded={expandedConsent === "thirdParty"}
            onToggleExpand={() => setExpandedConsent((cur) => (cur === "thirdParty" ? null : "thirdParty"))}
          >
            <p>렛서는 인재풀 등록 시 수집한 개인정보를 현재 제3자에게 제공하고 있지 않습니다.</p>
            <p>향후 제공이 필요한 경우 별도로 안내드리고 다시 동의를 받겠습니다.</p>
          </ConsentItem>
        </div>

        {error && <p className="text-sm text-[#e0433c]">{error}</p>}

        {/* 모바일 전용 제출 버튼 — 데스크톱은 사이드바 버튼 사용 */}
        <div className="lg:hidden">{submitButton}</div>
      </form>

      {/* 우측 프로세스 바 — 데스크톱 전용 */}
      <aside className="hidden lg:block">
        <div className="sticky top-[100px] flex flex-col gap-[32px]">
          <nav className="flex flex-col gap-[18px] border-l border-[#e1e1e1]">
            {SECTIONS.map((s) => {
              const active = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(s.id);
                  }}
                  className={`-ml-px border-l-2 py-[2px] pl-[16px] text-base transition-colors ${
                    active ? "border-[#00ab7f] font-semibold text-[#111111]" : "border-transparent text-[#999999]"
                  }`}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>
          {submitButton}
        </div>
      </aside>
    </div>
  );
}
