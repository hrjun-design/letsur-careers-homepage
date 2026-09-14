import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative -mt-[56px] flex h-[560px] w-full items-center justify-center overflow-hidden bg-[#0c2a70] lg:-mt-[86px] lg:h-[720px]">
      <Image
        src="/images/why-letsur/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative z-10 flex w-full max-w-[858px] flex-col items-center gap-[38px] px-xl text-center">
        <h1 className="text-[32px] leading-[40px] font-semibold text-white lg:text-[48px] lg:leading-[58px]">
          한국에서 가장 탁월한 AI 전략을
          <br />
          실현하고 있는 팀 렛서에 합류하세요
        </h1>
        <Link
          href="/recruit"
          className="flex h-[56px] items-center justify-center gap-[15px] border border-[#d3d3d3] bg-[#111111] px-[40px] py-[14px] text-lg font-bold text-white"
        >
          채용 공고 바로가기
        </Link>
      </div>
    </section>
  );
}
