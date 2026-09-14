import Image from "next/image";

/**
 * 실서버(careers.letsur.ai/culture) HTML/CSS 대조 완료(2026-09-11).
 * - "Our Teams" eyebrow 라벨 없음 — 제거
 * - 그리드 **2열**(기존 3열이었음, 실서버 `.group-feat-grid`는 1fr 1fr)
 * - 카드: 흰 배경 + 1px 테두리(#d9dbde), 헤더 padding 30px, 타이틀 22px semibold
 * - 팀 사진: 실서버에서 실제 파일 다운로드해 교체 완료(기존엔 팀명 기반 추정 매핑이라 실제 사진과
 *   일치 여부 불확실하다고 표시해뒀었음 — 이제 실제 원본 파일이라 확실함)
 */
const TEAMS = [
  {
    key: "product",
    name: "제품",
    img: "/images/culture/team_product_real.png",
    desc: "AI 제품의 전반을 기획하고 설계하며, 사용자 중심의 경험을 구현합니다. 기술 R&D와 엔지니어링이 긴밀히 연결된 구조로, 빠르게 실험하고 실제 서비스로 연결합니다. Staix 등 주요 플랫폼의 전반을 책임지고 있으며, 실용성과 확장성을 동시에 고민합니다.",
  },
  {
    key: "aible-campus",
    name: "에이블 캠퍼스",
    img: "/images/culture/team_aible-campus_real.png",
    desc: "조직을 위한 AI 리터러시 교육을 기획하고 운영합니다. KAIST 출신의 믿을 수 있는 강사진과 함께, 실전 기반의 체계적인 고품질 AI 교육 커리큘럼을 제공합니다. AI 교육을 넘어, 기업의 AI 전환을 위한 첫걸음을 함께합니다.",
  },
  {
    key: "ai",
    name: "AI",
    img: "/images/culture/team_ai_real.png",
    desc: "AI 모델링 및 최적화 솔루션을 설계·개발하는 핵심 기술 조직입니다. 고객사의 문제를 가장 정교하게 이해하고, 문제 해결형 모델을 만듭니다. 연구와 실전의 경계를 허물며, 기술의 본질로 비즈니스 임팩트를 창출합니다.",
  },
  {
    key: "project",
    name: "프로젝트",
    img: "/images/culture/team_project_real.png",
    desc: "고객사 현장 중심으로 프로젝트를 실행하는 전략 실행팀입니다. 요구사항 정의부터 커스터마이징된 AI 시스템 개발, 운영까지 end-to-end로 책임집니다. 각 산업의 현장에서 직접 문제를 해결하며, 고객의 실질적 전환을 이끕니다.",
  },
  {
    key: "sales",
    name: "영업",
    img: "/images/culture/team_sales_real.png",
    desc: "렛서의 모든 제품과 서비스를 고객에게 연결하는 최전방 부서입니다. 기술 이해를 바탕으로 고객의 Pain Point를 정확히 진단하고, 최적의 솔루션을 제안합니다. AI 전환의 파트너로서 고객의 여정 초입부터 함께합니다.",
  },
  {
    key: "marketing",
    name: "마케팅",
    img: "/images/culture/team_marketing_real.png",
    desc: "렛서의 브랜드 전략을 수립하고, 시장과의 접점을 설계합니다. 콘텐츠, 미디어, 채널을 유기적으로 연결해 브랜드의 메시지를 전달합니다. 복잡한 기술을 고객의 언어로 풀어내어 신뢰를 만듭니다.",
  },
];

export default function Teams() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-white px-xl py-[60px] lg:gap-[45px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[8px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">렛서의 조직</h2>
        <p className="mt-[8px] text-base font-normal leading-[1.7] text-[#333333]">
          렛서의 조직은 미션과 비전 아래 유기적으로 맞물려 움직이도록 변화합니다.
          <br />
          각자의 전문성을 기반으로 긴밀한 협업을 통해 시너지를 내고 성과를 만들어냅니다.
        </p>
      </div>
      <div className="grid w-full max-w-[1216px] grid-cols-1 gap-[24px] lg:grid-cols-2">
        {TEAMS.map((team) => (
          <div key={team.key} className="flex flex-col border border-[#d9dbde] bg-white">
            <div className="relative aspect-[1.64] w-full overflow-hidden bg-[#f5f5f5]">
              <Image src={team.img} alt="" fill sizes="(min-width: 1024px) 590px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-[12px] p-[30px]">
              <h3 className="text-[22px] leading-[1.4] font-semibold text-[#111111]">{team.name}</h3>
              <p className="text-base font-normal leading-[1.5] text-[#333333]">{team.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
