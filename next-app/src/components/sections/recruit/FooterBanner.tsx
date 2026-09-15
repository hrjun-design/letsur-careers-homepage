import Link from "next/link";

/**
 * `culture/FooterBanner.tsx`·홈 `RecruitBanner.tsx`와 카피·스타일 완전히 통일(2026-09-11 두 배너
 * 통일 작업 기준) — 배경 이미지만 이 페이지 전용 에셋(`68df25813a3f8f2824f241b2_8 채용 공고 배너`)
 * 사용. 상세 스타일 근거는 `culture/FooterBanner.tsx` 주석 참고.
 */
export default function FooterBanner() {
  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#020201] bg-cover bg-center px-xl py-[80px] lg:py-[120px]"
      style={{ backgroundImage: "url(/images/recruit/footer-banner.png)" }}
    >
      <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-[24px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-white lg:text-[36px]">
          한국을 넘어 아시아의 AI의{" "}
          <br className="lg:hidden" />
          기준이 될 팀 렛서,
          <br />
          그 성장의 중심에 함께하세요
        </h2>
        <Link
          href="/recruit"
          className="flex items-center justify-center bg-[#111111] px-[24px] py-[12px] text-base font-semibold text-white transition-colors hover:bg-[#222222] lg:h-[56px] lg:px-[40px] lg:py-[14px] lg:text-lg"
        >
          채용 공고 보러가기
        </Link>
      </div>
    </section>
  );
}
