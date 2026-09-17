"use client";

import { useEffect, useRef, useState } from "react";

/**
 * `JobList.tsx` 필터(직군/경력사항/고용형태)에서 처음 만든 커스텀 드롭다운을 공용 컴포넌트로
 * 분리(2026-09-15) — `TalentPoolApplyForm.tsx`의 "희망 포지션"에도 동일한 스타일이 필요해져서.
 * 네이티브 `<select>`는 브라우저마다 화살표 위치·포커스 링 색이 달라 앱 전체 스타일과 안 맞았음.
 */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-[#999999] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className = "w-full",
}: {
  /** 닫힌 상태·리셋 옵션에 그대로 노출되는 라벨(placeholder 겸용). */
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  /** 바깥 wrapper에 적용할 너비/레이아웃 클래스. 기본값은 `w-full`(폼 필드용),
   * 필터 바처럼 `flex-1 lg:min-w-[192px] lg:flex-none`가 필요하면 호출부에서 넘긴다. */
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[44px] w-full items-center justify-between rounded-[6px] border border-[#cccccc] bg-white px-[14px] text-base text-[#111111]"
      >
        <span className="text-[#111111]">{value || label}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-[4px] w-full overflow-hidden rounded-[6px] border border-[#cccccc] bg-white shadow-md">
          <button
            type="button"
            onClick={() => select("")}
            className="block w-full px-[14px] py-[10px] text-left text-base text-[#111111] hover:bg-[#f5f5f5]"
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              className="block w-full px-[14px] py-[10px] text-left text-base text-[#333333] hover:bg-[#f5f5f5]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
