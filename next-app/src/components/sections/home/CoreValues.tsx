import Image from "next/image";

const CORE_VALUES = [
  {
    title: "민첩한 실행력",
    desc: "렛서는 변화에 민첩하게 대응하고, 과감한 실행으로 기회를 실질적 성과로 실현합니다.",
    img: "/images/why-letsur/corevalue-1.png",
  },
  {
    title: "탁월한 가치 창출",
    desc: "렛서는 익숙한 방식에 머무르지 않고, 새로운 시각과 도전으로 남다른 성과와 가치를 창출합니다.",
    img: "/images/why-letsur/corevalue-2.png",
  },
  {
    title: "신뢰 기반 파트너십",
    desc: "렛서는 고객과의 신뢰를 최우선으로 삼고, 투명한 소통과 책임 있는 대처로 진정한 파트너십을 이어갑니다.",
    img: "/images/why-letsur/corevalue-3.png",
  },
];

export default function CoreValues() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-white px-xl pt-[80px] pb-[60px] lg:gap-[45px] lg:py-[110px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[14px] lg:gap-[22px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-sm font-semibold text-[#888888] lg:text-base">Core Value</span>
          <h2 className="text-[26px] leading-[34px] font-semibold text-[#111111] lg:text-4xl lg:leading-[46px]">
            렛서의 핵심 가치
          </h2>
        </div>
        <p className="text-base font-normal text-[#333333] lg:text-lg">
          렛서는 AI와 비즈니스 혁신을 통해 산업을 선도하며, 다음의 핵심 가치들을 바탕으로 성장과 혁신을 함께 만들어갑니다.
          <br />
          핵심 가치는 복잡한 비즈니스 문제 앞에서 올바른 판단을 내리도록 돕는 기준이며, 동시에 같은 방향을 바라보는 팀의 근간이 됩니다.
        </p>
      </div>
      <div className="grid w-full max-w-[1216px] grid-cols-1 gap-[60px] lg:grid-cols-3 lg:gap-[28px]">
        {CORE_VALUES.map((value) => (
          <div key={value.title} className="flex flex-col gap-[24px] lg:gap-[22px]">
            <div className="relative aspect-[1.64/1] w-full overflow-hidden bg-[#f5f5f5] lg:aspect-auto lg:h-[262px]">
              <Image src={value.img} alt="" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-xl font-semibold text-[#111111] lg:text-[22px]">{value.title}</h3>
              <p className="text-base font-normal text-[#333333]">{value.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
