/**
 * 실서버(careers.letsur.ai/recruit) HTML/CSS 대조(2026-09-11) — "합류 여정" 4단계 그리드.
 * 데스크톱 4열 gap 16px, 카드 배경 #f5f6f7 padding 40px 30px 50px, 헤더 하단 구분선(neutral-500
 * 30% 정도, `#9e9e9e4d`) + margin/padding 20/30px. 모바일 2열 gap 24px, 카드 padding 24px,
 * 헤더 margin/padding 14px. 번호는 point-green(실서버 원본 #00c781=teal-500 → 이 프로젝트는 흰/연회색
 * 배경에 teal-600 `#00ab7f` 규칙이라 치환, 2026-09-11) 22px(18px mobile), 타이틀 24px(22px mobile).
 * 리스트 항목 가운데점(2026-09-11 추가): 실서버는 `<ul><li>`만 쓰고 별도 마커 마크업이 없어 브라우저
 * 기본 disc marker인 줄 알았으나, 이 프로젝트는 Tailwind preflight가 `list-style:none`으로 리셋해
 * 마커가 아예 안 보였음 — 작은 점(4px)을 `<span>`으로 직접 그려서 대신 구현. 색은 각 텍스트 색과
 * 동일하게 `bg-current`로 상속(사용자 지정, 2026-09-11) — 회색 고정값 대신 문단 색을 그대로 따라감.
 * 하단 여백(2026-09-11): 실서버 이 섹션의 `.section-wrap`은 `bottom-padding-0`(하단 패딩 0)이고,
 * 다음 섹션(JobList)의 상단 패딩(100px)만으로 간격을 만듦 — 기존엔 이 섹션도 상하 100px씩 줘서
 * 총 200px(실측 110px의 거의 2배)로 벌어져 있었음. `py-*` → `pt-*`로 바꿔 하단 패딩 제거.
 */
const STEPS = [
  {
    num: "01",
    title: "서류 검토",
    items: [
      "제출하신 이력서 및 포트폴리오를 기반으로 심사를 진행합니다.",
      "전형 결과는 영업일 기준 7일 이내 이메일로 안내드립니다.",
    ],
  },
  {
    num: "02",
    title: "직무 인터뷰",
    items: [
      "지원하신 직무와 관련된 역량과 경험을 확인하는 단계입니다.",
      "대면으로 이루어지며, 실무 면접관이 참여하여 약 1시간에서 1시간 30분간 진행됩니다.",
    ],
  },
  {
    num: "03",
    title: "컬처핏 인터뷰",
    items: [
      "조직 문화와 가치관을 공유하는 단계입니다.",
      "대면으로 이루어지며, 경영진이 참여하며 약 1시간 진행됩니다.",
    ],
  },
  {
    num: "04",
    title: "입사 제안",
    items: [
      "최종 합격 시, 처우 및 조건 협의 후 입사가 확정됩니다.",
      "연봉 협상 자료 수령 후 7일 이내 처우 제안 자료를 전달드립니다.",
    ],
  },
];

export default function Process() {
  return (
    <section className="flex w-full flex-col items-center bg-white px-xl pt-[60px] lg:pt-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[14px]">
        <div>
          <p className="mb-[4px] text-base font-semibold text-[#00ab7f]">Process</p>
          <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">합류 여정</h2>
        </div>
        <p className="text-lg font-normal text-[#333333]">
          렛서가 만드는 AI 서비스가 곧 미래가 되는 그 과정을 함께해 주세요.
        </p>
      </div>

      <div className="mt-[40px] grid w-full max-w-[1216px] grid-cols-1 gap-[24px] md:grid-cols-2 lg:mt-[45px] lg:grid-cols-4 lg:gap-[16px]">
        {STEPS.map((s) => (
          <div key={s.num} className="flex flex-col bg-[#f5f6f7] p-[24px_24px_32px] lg:p-[40px_30px_50px]">
            <div className="mb-[14px] border-b border-[#9e9e9e4d] pb-[14px] lg:mb-[20px] lg:pb-[30px]">
              <p className="text-[18px] leading-[1.4] font-semibold text-[#00ab7f] lg:text-[22px]">{s.num}</p>
              <p className="mt-[4px] text-[22px] leading-[1.5] font-semibold text-[#111111] lg:text-[24px]">{s.title}</p>
            </div>
            <ul className="flex flex-col gap-[4px]">
              {s.items.map((item) => (
                <li key={item} className="flex gap-[8px] text-base leading-[1.5] text-[#333333]">
                  <span className="mt-[9px] h-[4px] w-[4px] shrink-0 rounded-full bg-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-[24px] flex w-full max-w-[1216px] gap-[8px] text-sm leading-[1.5] text-[#6e6e6e]">
        <span className="mt-[8px] h-[4px] w-[4px] shrink-0 rounded-full bg-current" />
        <p>직무에 따라 사전 과제 또는 On-Call 인터뷰 등의 전형이 추가될 수 있으며, 이와 관련해서는 지원자에게 별도로 안내드립니다.</p>
      </div>
    </section>
  );
}
