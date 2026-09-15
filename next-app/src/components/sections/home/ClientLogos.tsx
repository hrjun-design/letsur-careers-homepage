import Image from "next/image";

const LOGOS = [
  { name: "국립중앙도서관", src: "/images/logos/library.png" },
  { name: "삼성", src: "/images/logos/samsung.png" },
  { name: "SK이노베이션", src: "/images/logos/sk-innovation.png" },
  { name: "TEL", src: "/images/logos/tel.png" },
  { name: "CJ ENM", src: "/images/logos/cj-enm.png" },
  { name: "신한투자증권", src: "/images/logos/shinhan-securities.png" },
  { name: "에스원", src: "/images/logos/s1.png" },
  { name: "광동제약", src: "/images/logos/kwangdong.png" },
  { name: "삼성화재", src: "/images/logos/samsung-fire.png" },
  { name: "구구스", src: "/images/logos/gugus.png" },
  { name: "롯데건설", src: "/images/logos/lotte-const.png" },
  { name: "K0DATA", src: "/images/logos/k0data.png" },
];

export default function ClientLogos() {
  return (
    <section className="flex w-full items-center justify-center bg-white px-xl pt-[80px] pb-[60px] lg:pt-[160px] lg:pb-[80px]">
      <div className="flex w-full max-w-[1216px] flex-col items-start gap-[20px] lg:gap-[60px]">
        <h2 className="text-[26px] leading-[34px] font-semibold text-[#111111] lg:text-4xl lg:leading-[46px]">
          고객사의 이유있는 선택
        </h2>
        <div className="grid w-full grid-cols-2 justify-items-center gap-x-[20px] gap-y-[30px] lg:grid-cols-6 lg:gap-x-[49px] lg:gap-y-[26px]">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="relative h-[47px] w-full max-w-[160px] shrink-0 lg:h-[56px]">
              <Image src={logo.src} alt={logo.name} fill sizes="160px" className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
