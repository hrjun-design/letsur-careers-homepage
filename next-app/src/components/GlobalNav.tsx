"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 이 사이트(letsur-careers) 전용 GNB.
 * 메인 렛서 홈페이지(letsur-homepage-3.0)의 GlobalNav.tsx와 시각 스타일(높이·배경·로고·타이포·
 * 폭 고정 트릭·모바일 메뉴 구조)을 그대로 통일한다(사용자 확정, 2026-09-09) — 항목 목록만 다르다.
 * 드롭다운(AI Gateway류)이 없어 그 부분만 뺐다.
 */
const NAV_ITEMS = [
  { label: "Why letsur", href: "/", type: "internal" as const },
  { label: "팀 문화", href: "/culture", type: "internal" as const },
  { label: "채용 공고", href: "/recruit", type: "internal" as const },
  { label: "회사소개", href: "https://letsur.ai/kr/aboutus", type: "outlink" as const },
];

function OutlinkIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={`shrink-0${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <path
        d="M5.28569 12.3567L12.6239 5.5528M6.91217 5.55287L12.6239 5.5528L12.6239 10.9111"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 굵기가 font-normal→semibold로 바뀔 때 옆 항목이 밀리지 않도록, 보이지 않는 semibold
 * 텍스트로 폭을 미리 확보해두고 실제 텍스트는 absolute로 그 위에 얹는다(메인 GNB와 동일 트릭).
 */
function NavLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span className="relative inline-block whitespace-nowrap text-base leading-6">
      <span aria-hidden="true" className="invisible block whitespace-nowrap font-semibold">
        {label}
      </span>
      <span
        className={`absolute inset-0 whitespace-nowrap ${active ? "font-semibold text-white" : "font-normal text-[#9e9e9e] group-hover:font-semibold group-hover:text-white"}`}
      >
        {label}
      </span>
    </span>
  );
}

export default function GlobalNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuVisible(true);
      return;
    }
    const id = setTimeout(() => setMobileMenuVisible(false), 500);
    return () => clearTimeout(id);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[56px] bg-black lg:h-[86px]">
      <div className="relative z-50 flex h-full items-center justify-between bg-black px-[16px] lg:mx-auto lg:max-w-[1216px] lg:px-0">
        <Link href="/" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo/logo-horizontal-white.svg" alt="letsur" className="h-[18px] w-auto lg:h-[22px]" />
        </Link>

        <div className="flex items-center gap-[12px] lg:hidden">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex size-[24px] items-center justify-center"
          >
            <img src="/icons/ic-menu.svg" alt="" aria-hidden="true" className="h-[13.5px] w-[19.5px]" />
          </button>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-[60px]">
            {NAV_ITEMS.map((item) => {
              const isActive = item.type === "internal" && pathname === item.href;
              return (
                <li key={item.href}>
                  {item.type === "outlink" ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-[2px] text-[#9e9e9e] hover:text-white"
                    >
                      <NavLabel label={item.label} active={false} />
                      <OutlinkIcon />
                    </a>
                  ) : (
                    <Link href={item.href} className="group">
                      <NavLabel label={item.label} active={isActive} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 모바일 드롭다운 메뉴 — 메인 GNB와 동일 구조(항상 마운트, translate-y로 표시/숨김 전환) */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[56px] z-40 bg-black/50 lg:hidden ${
          mobileMenuVisible ? "" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={`flex max-h-full flex-col overflow-y-auto bg-white transition-transform duration-500 ease ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          {...(!mobileMenuOpen ? { inert: true } : {})}
        >
          {NAV_ITEMS.map((item) => {
            const rowClass =
              "flex items-center justify-between gap-[10px] border-b border-[#e5e5e5] px-[24px] py-[20px] text-base leading-6 font-normal text-[#111111]";
            return item.type === "outlink" ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
                <OutlinkIcon size={24} className="text-[#333333]" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={rowClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
