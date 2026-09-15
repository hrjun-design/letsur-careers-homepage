import Link from "next/link";

/**
 * 배경 이미지는 `asset/0 base/footer_banner.png`(lg)/`footer_banner-mobile.png`(모바일 전용,
 * 여러 채용 서브페이지가 공유하는 공통 배너 에셋) — 사전 export본이 있어서 그대로 사용.
 * 타이틀 크기/줄간격·버튼 폰트굵기·hover 효과(2026-09-11): `culture/FooterBanner.tsx` 기준으로 통일
 * (사용자 지정) — 타이틀 28px/`leading-[38px]`(mobile)·4xl/`leading-[46px]`(lg, 고정 px 줄간격)
 * 이었던 걸 26px/`leading-[1.4]`(mobile)·36px/`leading-[1.4]`(lg, 상대 줄간격)로, 버튼
 * `font-bold`→`font-semibold`로, hover 없음→`hover:bg-[#222222]`로 맞춤.
 * **모바일 줄바꿈(2026-09-15)**: Figma 모바일 프레임(node `825:20125`)이 4줄 줄바꿈을 쓰길래
 * 반영 — 단, Figma는 28px를 쓰지만 위 26px 통일 결정이 우선이라 크기는 그대로 26px 유지.
 */
export default function RecruitBanner() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#020201] px-xl py-[60px] lg:py-[120px]">
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: "url(/images/base/footer-banner-mobile.png)" }}
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: "url(/images/base/footer-banner.png)" }}
      />
      <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-[24px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-white lg:text-[36px]">
          <span className="lg:hidden">
            한국을 넘어 아시아의
            <br />
            AI의 기준이 될 팀 렛서,
            <br />
            그 성장의 중심에
            <br />
            함께하세요
          </span>
          <span className="hidden lg:inline">
            한국을 넘어 아시아의 AI의 기준이 될 팀 렛서,
            <br />
            그 성장의 중심에 함께하세요
          </span>
        </h2>
        <Link
          href="/recruit"
          className="flex h-[48px] items-center justify-center bg-[#111111] px-[20px] py-[12px] text-base font-semibold text-white transition-colors hover:bg-[#222222] lg:h-[56px] lg:px-[40px] lg:py-[14px] lg:text-lg"
        >
          채용 공고 보러가기
        </Link>
      </div>
    </section>
  );
}
