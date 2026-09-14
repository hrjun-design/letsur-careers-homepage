import Link from "next/link";

/**
 * 배경 이미지는 `asset/0 base/footer_banner.png` (여러 채용 서브페이지가 공유하는 공통 배너
 * 에셋) — 사전 export본이 있어서 그대로 사용. `public/images/base/footer-banner.png`로 복사됨.
 * 타이틀 크기/줄간격·버튼 폰트굵기·hover 효과(2026-09-11): `culture/FooterBanner.tsx` 기준으로 통일
 * (사용자 지정) — 타이틀 28px/`leading-[38px]`(mobile)·4xl/`leading-[46px]`(lg, 고정 px 줄간격)
 * 이었던 걸 26px/`leading-[1.4]`(mobile)·36px/`leading-[1.4]`(lg, 상대 줄간격)로, 버튼
 * `font-bold`→`font-semibold`로, hover 없음→`hover:bg-[#222222]`로 맞춤.
 */
export default function RecruitBanner() {
  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#020201] bg-cover bg-center px-xl py-[80px] lg:py-[120px]"
      style={{ backgroundImage: "url(/images/base/footer-banner.png)" }}
    >
      <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-[24px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-white lg:text-[36px]">
          한국을 넘어 아시아의 AI의 기준이 될 팀 렛서,
          <br />
          그 성장의 중심에 함께하세요
        </h2>
        <Link
          href="/recruit"
          className="flex h-[56px] items-center justify-center bg-[#111111] px-[40px] py-[14px] text-lg font-semibold text-white transition-colors hover:bg-[#222222]"
        >
          채용 공고 보러가기
        </Link>
      </div>
    </section>
  );
}
