import Image from "next/image";

/**
 * 실서버(careers.letsur.ai/recruit) HTML/CSS 대조(2026-09-11) — `culture/Hero.tsx`와 동일한
 * `.sub-hero` 구조(섹션 높이 512/300px, 이미지는 padding-top만큼 아래에서 시작, 타이틀도 같은
 * 범위 기준 중앙정렬 — 상세 이유는 `culture/Hero.tsx` 주석 참고). 이 페이지 전용 배경 이미지·카피만 교체.
 */
export default function Hero() {
  return (
    <section className="relative -mt-[56px] h-[300px] w-full overflow-hidden bg-[#111] lg:-mt-[86px] lg:h-[512px]">
      <div className="absolute inset-x-0 top-[56px] bottom-0 lg:top-[86px]">
        <Image
          src="/images/recruit/hero-mobile.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        <Image
          src="/images/recruit/hero-desktop.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover lg:block"
        />
      </div>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-[56px] lg:pt-[86px]">
        <div className="z-10 flex w-full max-w-[858px] flex-col items-center gap-[14px] px-xl text-center lg:gap-[20px]">
          <h1 className="text-[32px] leading-[42px] font-semibold text-white lg:text-[44px] lg:leading-[57px]">
            채용공고
          </h1>
          <p className="text-[18px] leading-[27px] font-normal text-white">
            함께 일하고 싶은 뛰어난 동료들이 있는 렛서에 합류하세요
          </p>
        </div>
      </div>
    </section>
  );
}
