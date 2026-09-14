import Image from "next/image";

export default function Mission() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-[#111111] px-xl py-[80px] lg:gap-[50px] lg:py-[120px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-base font-semibold text-[#888888]">Who we are</span>
          <h2 className="text-[28px] leading-[38px] font-semibold text-white lg:text-4xl lg:leading-[46px]">
            우리는 고객사의 <span className="text-[#00c781]">비즈니스 AI 전환 파트너</span>입니다.
          </h2>
        </div>
        <div className="flex flex-col gap-[24px]">
          <p className="text-base font-normal text-[#e1e1e1] lg:text-lg">
            우리는 단순히 기술적인 문제뿐만 아니라 고객사의 실질적인 요구와 비즈니스 목표 달성에 필요한 AI 전략을 설계하고
            <br />
            이를 실행 가능한 AI 솔루션으로 구현하는 데 집중합니다. 현재 렛서는 다양한 산업 분야와 규모의 기업들에게
            <br />
            AI 도입부터 운영까지, 최적의 의사결정과 성공적인 결과물을 제공하는 최고의 AI 전환 파트너로 자리매김하고 있습니다.
          </p>
          <p className="text-base font-normal text-[#e1e1e1] lg:text-lg">
            이러한 경험을 바탕으로 우리는 앞으로 한국을 넘어 아시아 전역으로 사업을 넓혀가고자 합니다.
            <br />
            그 과정에서 더 많은 기업이 AI 기반의 비즈니스 성공을 이루도록 지원하며, 아시아 AI 시장의 AX 리더로 나아갈 것입니다.
          </p>
        </div>
      </div>
      <div className="relative h-[220px] w-full max-w-[1216px] overflow-hidden bg-[#efefef] lg:h-[440px]">
        <Image
          src="/images/why-letsur/mission-img.png"
          alt=""
          fill
          sizes="(min-width: 1216px) 1216px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
