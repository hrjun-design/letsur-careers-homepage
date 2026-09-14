import Image from "next/image";

/**
 * 실서버(careers.letsur.ai/culture) HTML/CSS 대조 완료(2026-09-11).
 * - "Benefits" eyebrow 라벨 없음 — 제거, 섹션 배경도 흰색(기존 #f7f7f7 아니었음)
 * - 슬라이드 이미지: 실서버에서 실제 파일 다운로드해 반영(기존엔 자산 없어 회색 박스만 있었음)
 * - 그리드: 3열 gap 0(기존 24/32px 간격 있었음 — 실제로는 카드가 서로 붙어있음), margin-top 80px로
 *   위 이미지와 분리. 카드 자체엔 테두리/구분선 없음(흰 배경 위 흰 배경이라 사실상 카드 경계 없음)
 * - 아이콘·타이틀 크기(2026-09-11 재수정): 처음 반영한 "40px/20px"는 사실 실서버의 **991px 이하
 *   모바일 전용** 값이었음(`.environmnet-icon{width:40px}`, `.team-env-item-heading{font-size:20px}`는
 *   둘 다 미디어쿼리 안에 있는 값) — 데스크톱 기본값은 아이콘이 SVG 원본 그대로 48px(별도 width
 *   지정 없어 intrinsic 크기 그대로 렌더), 타이틀은 22px. 사용자가 "작아 보인다"고 지적해 재확인 후
 *   `lg:` 접두사로 데스크톱 48px/22px, 모바일은 기존 40px/20px 유지하도록 분리. 아이콘-타이틀 간격도
 *   `.environmnet-icon{margin-bottom:24px}`(데스크톱)/`16px`(모바일) 기준으로 `gap-[16px] lg:gap-[24px]`
 * - ⚠️ 상단 대표 이미지 크기(2026-09-11 수정): 실서버 `.group-slide-item`은 데스크톱에서
 *   `width:90%`(1216px 컨테이너 기준) + `aspect-ratio:2`(2:1, 가로로 넓고 낮음)인데, 기존 구현은
 *   `w-full`(100%) + `aspect-[1.64]`(실서버 모바일 전용 비율)를 데스크톱에도 그대로 써서 실제보다
 *   훨씬 크고 세로로 김 — 사용자가 실서버 대비 "커 보인다"고 지적. Playwright로 실서버 rect 실측
 *   (컨테이너 1216 중 이미지 1094.4=90%, 높이 547.2=1094.4/2) 후 `lg:w-[90%] lg:aspect-[2/1]`로
 *   수정, 모바일은 기존 `w-full aspect-[1.64]` 유지(실서버 991px 이하 breakpoint 값 그대로)
 * icon1~9.svg 매칭 순서는 원본 페이지 순서 그대로(추정치, 아이콘 파일 자체는 미대조).
 */
const BENEFITS = [
  { icon: "/images/culture/culture_icon1.svg", title: "재택근무", desc: "장소에 제약 없이 업무에 몰입할 수 있도록, 주 2회 재택근무를 지원합니다." },
  { icon: "/images/culture/culture_icon2.svg", title: "유연근무", desc: "출퇴근 시간을 유연하게 조정해 개인의 선호에 맞게 업무를 할 수 있습니다." },
  { icon: "/images/culture/culture_icon3.svg", title: "수평적인 조직문화", desc: "직급보다 역할 중심으로 소통합니다. '님' 문화로 상호 존중을 바탕으로 일합니다." },
  { icon: "/images/culture/culture_icon4.svg", title: "장비 지원", desc: "업무 효율을 높이기 위해 개인에게 최적화된 장비를 아낌없이 지원합니다." },
  { icon: "/images/culture/culture_icon5.svg", title: "개인 법인카드", desc: "업무에 필요한 비용을 편하게 처리할 수 있도록 개인 법인카드를 제공합니다." },
  { icon: "/images/culture/culture_icon6.svg", title: "접근성 좋은 사무실", desc: "강남 역삼역 인근에 오피스가 위치하고 있어 편하게 출퇴근할 수 있습니다." },
  { icon: "/images/culture/culture_icon7.svg", title: "커피 스낵바 운영", desc: "업무 중 언제든지 자유롭게 커피와 간식으로 재충전할 수 있도록 상시 운영하고 있습니다." },
  { icon: "/images/culture/culture_icon8.svg", title: "분기 별 워크샵", desc: "전 구성원이 함께 모여 리프레시하고 팀워크를 다지는 워크샵을 진행합니다." },
  { icon: "/images/culture/culture_icon9.svg", title: "교육 프로그램 지원", desc: "업무 역량 성장을 적극적으로 지원하며, 직무 관련 교육 및 사내외 프로그램 참여 기회를 제공합니다." },
];

export default function Benefits() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-white px-xl py-[60px] lg:gap-[45px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[8px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">렛서의 업무환경</h2>
        <p className="mt-[8px] text-base font-normal leading-[1.7] text-[#333333]">
          우리는 조직과 업무에 깊게 몰입할 수 있는 업무환경과 복지를 추구합니다.
          <br />
          우리의 업무 환경은 지속 가능한 몰입과 성과를 만들고, 성장할 수 있도록 돕습니다.
        </p>
      </div>
      <div className="flex w-full max-w-[1216px] justify-center">
        <div className="relative aspect-[1.64] w-full overflow-hidden bg-[#e5e5e5] lg:aspect-[2/1] lg:w-[90%]">
          <Image
            src="/images/culture/benefits-slide.png"
            alt=""
            fill
            sizes="(min-width: 1216px) 1094px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="mt-[40px] grid w-full max-w-[1216px] grid-cols-2 lg:mt-[80px] lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex flex-col items-start gap-[16px] bg-white p-[16px] lg:gap-[24px] lg:p-[34px_30px]">
            <img src={b.icon} alt="" className="h-[40px] w-[40px] lg:h-[48px] lg:w-[48px]" />
            <div className="flex flex-col gap-[6px]">
              <p className="text-[20px] leading-[1.4] font-semibold text-[#111111] lg:text-[22px]">{b.title}</p>
              <p className="text-base font-normal leading-[1.5] text-[#333333]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
