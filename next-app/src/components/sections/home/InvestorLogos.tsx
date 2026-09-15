import Image from "next/image";

const LOGOS = [
  { name: "Stonebridge", src: "/images/logos/stonebridge.png" },
  { name: "Smilegate Investment", src: "/images/logos/smilegate.png" },
  { name: "Schmidt", src: "/images/logos/schmidt.png" },
  { name: "KB인베스트먼트", src: "/images/logos/kbinvestment.png" },
];

export default function InvestorLogos() {
  return (
    <section className="flex w-full items-center justify-center bg-white px-xl pt-[60px] pb-[80px] lg:pt-[60px] lg:pb-[210px]">
      <div className="flex w-full max-w-[1216px] flex-col items-start gap-[36px] lg:gap-[60px]">
        <h2 className="text-[26px] leading-[34px] font-semibold text-[#111111] lg:text-4xl lg:leading-[46px]">
          렛서와 함께하는 국내 주요 투자사
        </h2>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-[30px] gap-y-[24px] lg:flex-nowrap lg:justify-between lg:gap-0">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="relative h-[40px] w-[133px] shrink-0 lg:h-[60px] lg:w-[200px]">
              <Image src={logo.src} alt={logo.name} fill sizes="200px" className="object-contain lg:object-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
