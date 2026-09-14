/**
 * 카드 안의 장식용 그래픽은 메인 렛서 홈페이지("렛서 홈페이지 홈화면", `letsur-homepage-3.0`)의
 * `components/sections/main/Roadmap.tsx`가 쓰는 실제 벡터 에셋을 그대로 복사해서 재사용한다
 * (`public/images/main/roadmap/step{1,2,3}.svg` → 이 프로젝트 `public/images/roadmap/`).
 * 이전에 손으로 근사 재현했던 SVG는 폐기 — 2026-09-09 사용자 확정.
 */
const STEPS = [
  {
    n: "1단계 발굴",
    title: "업무 중심의 실전형 AI 교육",
    desc: "다양한 AI 도구를 직접 체험하며, 실제 업무에 바로 적용할 수 있는 방법을 탐색합니다.",
    image: "/images/roadmap/step1.svg",
    cardBg: "#E9FDF4",
    labelBg: "#FFFFFF",
    labelColor: "#00AB7F",
    textColor: "#111111",
  },
  {
    n: "2단계 구현",
    title: "맞춤형 AI 솔루션 설계 및 구현",
    desc: "1단계에서 나온 아이디어를 바탕으로, 조직의 목표와 업무 방식에 맞는 AI 솔루션을 설계하고 개발합니다.",
    image: "/images/roadmap/step2.svg",
    cardBg: "#B2F8D8",
    labelBg: "#EFFFF8",
    labelColor: "#00AB7F",
    textColor: "#111111",
  },
  {
    n: "3단계 정착",
    title: "AI 활용 확산 및 운영 최적화 지원",
    desc: "운영 중인 AI 솔루션을 통해 직원들이 AI를 업무에 직접 적용하며 효과를 체감하도록 돕습니다.",
    image: "/images/roadmap/step3.svg",
    cardBg: "#014A41",
    labelBg: "#006958",
    labelColor: "#FFFFFF",
    textColor: "#FFFFFF",
  },
];

export default function Roadmap() {
  return (
    <section className="flex w-full flex-col items-center gap-[56px] bg-white px-xl py-[73px] lg:gap-[64px] lg:py-[110px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[22px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-base font-semibold text-[#888888]">AI Roadmap</span>
          <h2 className="text-[28px] leading-[38px] font-semibold text-[#111111] lg:text-4xl lg:leading-[46px]">
            렛서의 비즈니스 AI 로드맵
          </h2>
        </div>
        <p className="text-base font-normal text-[#333333] lg:text-lg">
          렛서는 발굴–구현–정착이라는 단계별 전환 과정을 통해 기업이 AI를 안전하고 효율적으로 내재화할 수 있도록 돕습니다.
          <br />
          단순히 AI를 제공하는 공급자가 아니라, 변화의 전 과정을 함께 걸어가는 파트너로서 기업이 지속 가능한 AI 혁신을
          이룰 수 있도록 지원합니다.
        </p>
      </div>
      <div className="flex w-full max-w-[1216px] flex-col items-stretch lg:flex-row">
        {STEPS.map((step) => (
          <div key={step.n} className="flex flex-1 flex-col" style={{ backgroundColor: step.cardBg }}>
            <div className="flex flex-col p-[20px] lg:p-[36px]">
              <span
                className="mb-[24px] w-fit rounded-[2px] px-[10px] py-[6px] text-[14px] leading-[20px] font-bold lg:mb-[35px] lg:px-[12px] lg:py-[4px] lg:text-base lg:leading-6 lg:font-semibold"
                style={{ backgroundColor: step.labelBg, color: step.labelColor }}
              >
                {step.n}
              </span>
              <p className="text-[22px] leading-[31px] font-semibold lg:text-2xl lg:leading-8" style={{ color: step.textColor }}>
                {step.title}
              </p>
              <p className="mt-[6px] text-base leading-6 lg:mt-[12px]" style={{ color: step.textColor }}>
                {step.desc}
              </p>
            </div>
            <img
              src={step.image}
              alt=""
              className="mt-auto h-[220px] w-full object-contain lg:h-auto lg:w-full lg:object-fill"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
