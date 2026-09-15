import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative -mt-[56px] flex h-[600px] w-full items-center justify-center overflow-hidden bg-[#0c2a70] lg:-mt-[86px] lg:h-[720px]">
      <Image
        src="/images/why-letsur/hero-bg-mobile.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover lg:hidden"
      />
      <Image
        src="/images/why-letsur/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover lg:block"
      />
      <div className="relative z-10 flex w-full max-w-[858px] flex-col items-center gap-[38px] px-xl text-center">
        <h1 className="text-[32px] leading-[40px] font-semibold text-white lg:text-[48px] lg:leading-[58px]">
          <span className="lg:hidden">
            한국에서 가장 탁월한
            <br />
            AI 전략을 실현하고 있는
            <br />
            팀 렛서에 합류하세요
          </span>
          <span className="hidden lg:inline">
            한국에서 가장 탁월한 AI 전략을
            <br />
            실현하고 있는 팀 렛서에 합류하세요
          </span>
        </h1>
        <Link
          href="/recruit"
          className="flex h-[48px] items-center justify-center border border-[#d3d3d3] bg-[#111111] px-[30px] py-[12px] text-base font-bold text-white lg:h-[56px] lg:gap-[15px] lg:px-[40px] lg:py-[14px] lg:text-lg"
        >
          채용 공고 바로가기
        </Link>
      </div>
    </section>
  );
}
