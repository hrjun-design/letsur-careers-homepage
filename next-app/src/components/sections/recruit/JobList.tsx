"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterDropdown } from "@/components/ui/filter-dropdown";

/**
 * 실서버(careers.letsur.ai/recruit) HTML/CSS 대조(2026-09-11) — "채용 중인 공고" 섹션.
 * 실서버는 Webflow CMS Collection + Finsweet CMS Filter/Select 라이브러리로 검색·드롭다운 필터를
 * 구현하고 있음(`fs-cmsfilter-field`, `fs-cmsselect-element` 속성) — 이 프로젝트엔 그 라이브러리가
 * 없으므로 동일한 결과가 나오도록 React state로 직접 필터링 로직을 재구현.
 * - 드롭다운 기본 라벨의 "(7)"/"(2)"/"(2)" 숫자는 실서버에도 고정 텍스트로 박혀있고 실제 옵션
 *   개수(4/3/4)와도 안 맞음(아마 실서버 자체의 오래된/미갱신 값) — 그대로 재현, 선택 후에도 숫자를
 *   동적으로 바꾸지 않음(실서버와 동일)
 * - 카드형 리스트: 데스크톱은 카드 사이 구분선 없음(gap 10px만), 타이틀 24px/600 + 메타 정보
 *   행(직군/경력/고용형태/소속을 `|` 구분선으로), padding 18px 상하.
 * - ⚠️ 데이터 소스(2026-09-11): 처음엔 하드코딩 배열이었으나, Supabase `jobs` 테이블(status='open'인
 *   공고만 RLS로 공개 노출)로 이전 — `src/app/recruit/page.tsx`에서 서버 사이드로 조회해 이 컴포넌트에
 *   `jobs` prop으로 내려줌(필터링 자체는 클라이언트 state로 그대로 유지). 관리자 CRUD는 별도 구축 예정.
 * - ⚠️ 필터 드롭다운(2026-09-11 수정): 처음엔 네이티브 `<select>`로 구현했으나, 실서버는 커스텀
 *   드롭다운 패널(`.filter-dropdown-list` — 토글 아래 흰 박스에 옵션이 세로로 나열, 첫 줄은 라벨
 *   자체가 "전체 보기" 역할)이라 브라우저 기본 select 화살표·팝업과 시각적으로 다름. 사용자가 실제
 *   열린 상태 스크린샷까지 제시해 동일한 커스텀 드롭다운(`FilterDropdown`)으로 교체 — 토글은
 *   `.dropdown-toggle-4`(padding 10px 14px, 화살표 우측 마진 19px) 기준, 패널은
 *   `.filter-dropdown-list`(border 1px #ccc, radius 6px, margin-top 4px) 기준.
 */
export type Job = {
  title: string;
  group: string;
  career: string;
  type: string;
  slug: string;
  isPinned: boolean;
};

const GROUP_OPTIONS = ["Business", "Sales", "AI", "Product"];
const CAREER_OPTIONS = ["경력 무관", "신입", "경력"];
const TYPE_OPTIONS = ["정규직", "계약직", "인턴", "병역특례"];


export default function JobList({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [career, setCareer] = useState("");
  const [type, setType] = useState("");

  const pinnedJob = jobs.find((job) => job.isPinned) ?? null;

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (job.isPinned) return false;
      if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (group && job.group !== group) return false;
      if (career && job.career !== career) return false;
      if (type && job.type !== type) return false;
      return true;
    });
  }, [jobs, search, group, career, type]);

  return (
    <section className="flex w-full flex-col items-center bg-white px-xl py-[60px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[14px]">
        <div>
          <p className="mb-[4px] text-base font-semibold text-[#00ab7f]">Job Opening</p>
          <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">채용 중인 공고</h2>
        </div>
      </div>

      {pinnedJob && (
        <Link
          href={`/recruit/${pinnedJob.slug}`}
          className="relative mt-[32px] flex w-full max-w-[1216px] flex-col items-center justify-center gap-[16px] overflow-hidden px-[24px] py-[36px] text-center no-underline lg:mt-[36px] lg:h-[234px] lg:gap-[14px] lg:px-[40px] lg:py-[48px]"
        >
          <Image src="/images/recruit/banner-bg.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="relative z-10 flex w-full flex-col items-center gap-[4px]">
            <p className="text-2xl font-semibold text-white lg:text-3xl">{pinnedJob.title}</p>
            <p className="text-base text-white lg:text-lg">
              렛서의 성장에 힘이 되어줄 여러분과의 만남을 기대합니다.
            </p>
          </div>
          <span className="relative z-10 flex h-[52px] w-[183px] shrink-0 items-center justify-center bg-black text-lg font-semibold text-white transition-colors hover:bg-[#222222]">
            지원하기
          </span>
        </Link>
      )}

      <div className="mt-[32px] flex w-full max-w-[1216px] flex-col gap-[10px] lg:mt-[36px] lg:flex-row lg:gap-[12px]">
        <div className="relative flex-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2"
          >
            <path
              d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
              stroke="#888888"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색"
            className="h-[44px] w-full rounded-[6px] border border-[#cccccc] bg-white pr-[15px] pl-[38px] text-base text-[#111111] placeholder:text-[#999999]"
          />
        </div>
        <FilterDropdown label="직군 (7)" options={GROUP_OPTIONS} value={group} onChange={setGroup} className="flex-1 lg:min-w-[192px] lg:flex-none" />
        <FilterDropdown label="경력사항 (2)" options={CAREER_OPTIONS} value={career} onChange={setCareer} className="flex-1 lg:min-w-[192px] lg:flex-none" />
        <FilterDropdown label="고용형태 (2)" options={TYPE_OPTIONS} value={type} onChange={setType} className="flex-1 lg:min-w-[192px] lg:flex-none" />
      </div>

      <div className="mt-[10px] flex w-full max-w-[1216px] flex-col lg:border-t-0 lg:pt-0">
        {filtered.length === 0 && (
          <p className="py-[30px] text-base text-[#6e6e6e]">조건에 맞는 공고가 없습니다.</p>
        )}
        {filtered.map((job) => (
          <Link
            key={job.slug}
            href={`/recruit/${job.slug}`}
            className="flex flex-col gap-[12px] border-b border-[#e1e1e1] py-[30px] no-underline lg:border-none lg:py-[18px]"
          >
            <p className="text-[20px] leading-[1.4] font-semibold text-[#111111] lg:text-[24px]">{job.title}</p>
            <div className="flex items-center gap-[12px]">
              <span className="text-sm text-[#888888] lg:text-base">{job.group}</span>
              <span className="h-[18px] w-px bg-[#e1e1e1]" />
              <span className="text-sm text-[#888888] lg:text-base">{job.career}</span>
              <span className="h-[18px] w-px bg-[#e1e1e1]" />
              <span className="text-sm text-[#888888] lg:text-base">{job.type}</span>
              <span className="h-[18px] w-px bg-[#e1e1e1]" />
              <span className="text-sm text-[#888888] lg:text-base">렛서</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
