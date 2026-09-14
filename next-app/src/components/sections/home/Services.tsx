import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  {
    key: "stayx",
    img: "/images/why-letsur/service-stayx.png",
    logo: "/images/why-letsur/logo-stayx.svg",
    titleHighlight: "렛서 플랫폼",
    titleRest: "은 AI 도입, 활용, 운영까지,",
    titleLine2: "하나의 시스템으로 통합 관리하는 플랫폼입니다.",
    desc: "AI 도입 이후 지속되기 위해서는 운영 안정성과 체계적인 유지관리 시스템이 뒷받침되어야 합니다. 렛서 플랫폼은 AI 도입 이후의 '운영 안정성'을 책임지는 렛서의 AI 운영관리 플랫폼입니다. 복잡한 대규모 AI 모델을 안전하게 배포하고, 지속적으로 최적의 성능을 유지합니다.",
    href: "https://letsur.ai/kr/ai-gateway",
    external: true,
  },
  {
    key: "aible",
    img: "/images/why-letsur/service-aible.png",
    logo: "/images/why-letsur/logo-aible.svg",
    titleHighlight: "에이블 캠퍼스",
    titleRest: "는 실무 중심의 AI 교육으로",
    titleLine2: "AI 역량을 조직 내부로부터 키워내는 교육 서비스입니다.",
    desc: "에이블 캠퍼스는 조직의 AI 실무 역량을 높이는 렛서의 AI 교육 전문 브랜드입니다. AI에 대한 막연한 어려움이 있는 조직과 임직원을 위해, 에이블 캠퍼스는 AX 전문 기업의 노하우를 바탕으로 실무에서 바로 활용할 수 있는 맞춤형 교육 콘텐츠를 제공합니다.",
    href: "https://www.aible-campus.com/",
    external: true,
  },
];

export default function Services() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-[#111111] px-xl py-[80px] lg:gap-[45px] lg:py-[120px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[22px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-base font-semibold text-[#888888]">Service</span>
          <h2 className="text-[28px] leading-[38px] font-semibold text-white lg:text-4xl lg:leading-[46px]">
            제품과 서비스
          </h2>
        </div>
        <p className="text-base font-normal text-white lg:text-lg">
          렛서가 제공하는 AI 제품과 서비스의 가치는 고객의 비즈니스 성공으로 이어질 때 비로소 완성됩니다.
          <br />
          우리는 기업의 AI 전환 전 과정을 지원하기 위해, 전문 컨설팅부터 AI 교육과 실제적인 개발 및 유지보수까지 전방위적인 서비스를 제공하고 있습니다.
        </p>
      </div>
      <div className="flex w-full max-w-[1216px] flex-col gap-[40px] lg:gap-[20px]">
        {SERVICES.map((service) => (
          <div key={service.key} className="flex flex-col items-stretch bg-white lg:flex-row">
            <div className="relative h-[240px] w-full lg:h-[388px] lg:w-1/2">
              <Image src={service.img} alt="" fill sizes="(min-width: 1024px) 608px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={service.logo} alt="" className="h-[32px] w-auto" />
              </div>
            </div>
            <div className="flex w-full flex-col justify-center gap-[20px] px-[20px] py-[30px] lg:w-1/2 lg:gap-[30px] lg:px-[40px] lg:py-[60px]">
              <div className="flex flex-col gap-[15px]">
                <h3 className="text-xl font-semibold text-[#111111] lg:text-2xl">
                  <span className="text-[#00ab7f]">{service.titleHighlight}</span>
                  {service.titleRest}
                  <br />
                  {service.titleLine2}
                </h3>
                <p className="text-base font-normal text-[#333333]">{service.desc}</p>
              </div>
              {service.external ? (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center justify-center gap-[8px] bg-black px-[24px] py-[12px] text-[16px] leading-[24px] font-medium text-white transition-opacity hover:opacity-80"
                >
                  더 알아보기 →
                </a>
              ) : (
                <Link
                  href={service.href}
                  className="inline-flex w-fit items-center justify-center gap-[8px] bg-black px-[24px] py-[12px] text-[16px] leading-[24px] font-medium text-white transition-opacity hover:opacity-80"
                >
                  더 알아보기 →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
