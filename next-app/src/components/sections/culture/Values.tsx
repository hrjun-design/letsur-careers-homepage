/**
 * 실서버(careers.letsur.ai/culture) HTML/CSS 대조 완료(2026-09-11).
 * - "Our Values" eyebrow 라벨 없음 — 제거
 * - 섹션 배경 #fafafb(연회색) — 기존엔 흰색이었음
 * - 카드: 흰 배경 + 1px 테두리(#d9dbde), padding 34px/24px(mobile), 아이콘 60px(기존 48px)
 * - 타이틀 24px/20px(mobile) semibold, 그리드 gap 24px(desktop, 기존 40px)
 * 아이콘-값 1:1 대응은 원본 페이지 순서 그대로(icon1~6.svg 매칭은 추정치, 실제 아이콘 파일은 미대조).
 */
const VALUES = [
  { icon: "/images/culture/value_icon1.svg", title: "믿음", desc: "AI가 세상의 문제를 해결할 수 있다는 무한한 가능성을 믿습니다. 우리는 그 믿음을 바탕으로 새로운 해결책을 만들어갑니다." },
  { icon: "/images/culture/value_icon2.svg", title: "성장", desc: "팀과 개인 모두의 성장을 추구합니다. 새로운 것을 배우는 데에 적극적으로 행동하고 지지합니다." },
  { icon: "/images/culture/value_icon3.svg", title: "유연함", desc: "우리는 정답보다 더 나은 해결책을 고민합니다. 틀에서 벗어나 문제를 유연하게 바라보고 대처합니다." },
  { icon: "/images/culture/value_icon4.svg", title: "오너십", desc: "문제를 내 일처럼 받아들이고, 스스로 방향을 설정해 끝까지 책임집니다. 주도성과 책임감을 기반으로 일합니다." },
  { icon: "/images/culture/value_icon5.svg", title: "신뢰", desc: "타인의 전문성과 판단을 존중하며, 다양한 관점을 열린 마음으로 받아들이는 문화를 지향합니다." },
  { icon: "/images/culture/value_icon6.svg", title: "소통", desc: "소통은 더 나은 결과를 만듭니다. 생각을 논리적으로 전달하고, 유연한 태도로 의견을 주고받는 문화를 지향합니다." },
];

export default function Values() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-[#fafafb] px-xl py-[60px] lg:gap-[45px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[8px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">렛서가 일하는 방식</h2>
        <p className="mt-[8px] text-base font-normal leading-[1.5] text-[#333333]">
          렛서가 미션을 효과적으로 달성하기 위해 여섯가지의 가치를 추구합니다.
          <br />
          우리의 일하는 방식은 모두가 함께 만들어가고 있습니다.
        </p>
      </div>

      <div className="grid w-full max-w-[1216px] grid-cols-1 gap-[32px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[24px]">
        {VALUES.map((v) => (
          <div key={v.title} className="flex flex-col items-start gap-[12px] border border-[#d9dbde] bg-white p-[24px] lg:p-[34px_30px]">
            <img src={v.icon} alt="" className="h-[60px] w-[60px]" />
            <div className="flex flex-col gap-[8px] pt-[16px] lg:pt-[30px]">
              <h3 className="text-[20px] leading-[1.4] font-semibold text-[#222222] lg:text-[24px]">{v.title}</h3>
              <p className="text-base font-normal leading-[1.5] text-[#333333]">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
