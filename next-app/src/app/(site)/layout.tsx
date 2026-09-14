import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

/**
 * 공개 사이트(홈/팀문화/채용공고 목록·상세) 전용 레이아웃 — GNB·Footer는 여기서만 렌더링.
 * `/admin`은 이 그룹 밖에 있어서 이 레이아웃(따라서 공개 GNB)을 공유하지 않는다(2026-09-11,
 * 관리자 화면에 공개 내비게이션이 함께 뜨던 문제 수정).
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <GlobalNav />
      <main className="pt-[56px] lg:pt-[86px]">{children}</main>
      <Footer />
    </>
  );
}
