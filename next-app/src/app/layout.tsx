import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LETSUR Careers",
  description: "렛서 채용 페이지",
};

/**
 * `(site)`(공개 사이트)와 `admin`(백오피스)이 GNB·Footer를 공유하지 않도록 각자 자기 그룹의
 * layout.tsx에서 렌더링 — 여기(루트)는 순수 셸만 담당(2026-09-11).
 * `shadcn init`이 자동으로 추가했던 Geist 폰트 로딩은 제거 — 이 프로젝트는 Pretendard를
 * `globals.css`에서 이미 로드해 `body`에 직접 적용 중이라(font-family: var(--font-family-base)),
 * Geist는 실제로 아무 데도 쓰이지 않는 채 폰트만 추가로 받아오는 낭비였음.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
