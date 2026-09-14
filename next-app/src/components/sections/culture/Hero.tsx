import Image from "next/image";

/**
 * 실서버(careers.letsur.ai/culture) 코드 대조 완료(2026-09-11) — Figma보다 실제 배포 코드를
 * 우선 기준으로 최종 반영. 실서버 CSS 클래스 기준 값:
 * - `.sub-hero`: min/max-height 512px(lg) / 300px(base), padding-top 86px(lg)/56px(base)
 *   → 이 프로젝트 기존 GNB 오버레이 패턴(-mt 트릭)에 맞춰 섹션 높이만 512/300으로 반영
 * - `.heading-600`: 44px(lg)/32px(base), font-weight 600, line-height 1.3em
 * - `.p2`: 18px, font-weight 400(regular), line-height 1.5em — 반응형 구분 없이 고정
 * - `.hero-heading-wrap` margin-bottom: 20px(lg)/14px(base) — 타이틀-서브카피 간격
 * - 실서버엔 오버레이 디브·glow 효과 자체가 없음(순수 이미지 2장 반응형 전환뿐) — Figma 목업엔
 *   있었으나 배포 코드엔 없어서 제거, 텍스트 가독성용으로 아주 옅은 검정만 최소한으로 남김
 * - ⚠️ 실서버는 `.sub-hero`가 `display:flex; flex-flow:column; padding-top:86px(lg)/56px(base)`이고
 *   이미지(`flex:1`)는 그 아래 "남은 공간"만 채움 — 즉 이미지 실제 높이는 섹션 전체(512/300px)가
 *   아니라 `섹션 높이-padding-top`(426px/244px)뿐이고, 위쪽 86px/56px는 섹션 자체 배경색
 *   (`neutral-900`, 거의 검정)이 그대로 보이는 띠임(2026-09-11 Playwright 실측으로 확인,
 *   `imgRect: {top:86, height:426}` vs section height 512). 이 차이가 object-fit:cover의 크롭
 *   비율을 바꿔서 — 이미지가 섹션 전체를 채우면(구현 초안처럼) 가로로 더 많이 잘려나가 사진이
 *   실제보다 확대돼 보임. 아래처럼 이미지 박스 자체를 padding-top만큼 아래에서 시작하게 해야 함.
 * - ⚠️ 타이틀도 같은 이유로 위치 보정 필요: 실서버 `.hero-header`는 `position:absolute; inset:0`
 *   에 `padding-top:86px(lg)/56px(base)`를 얹은 채로 `justify-content:center`라, 텍스트가
 *   섹션 전체(0~512)가 아니라 이미지와 똑같은 범위(86~512)의 정중앙에 옴 — 섹션 전체 기준으로
 *   중앙정렬하면(구현 초안처럼) 사진 영역 기준으로는 약간 위로 치우쳐 보임(2026-09-11 사용자 지적).
 */
export default function Hero() {
  return (
    <section className="relative -mt-[56px] h-[300px] w-full overflow-hidden bg-[#111] lg:-mt-[86px] lg:h-[512px]">
      <div className="absolute inset-x-0 top-[56px] bottom-0 lg:top-[86px]">
        <Image
          src="/images/culture/2_culture-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-[56px] lg:pt-[86px]">
        <div className="z-10 flex w-full max-w-[858px] flex-col items-center gap-[14px] px-xl text-center lg:gap-[20px]">
          <h1 className="text-[32px] leading-[42px] font-semibold text-white lg:text-[44px] lg:leading-[57px]">
            팀 문화
          </h1>
          <p className="text-[18px] leading-[27px] font-normal text-white">
            렛서는 함께 성장하며, 비즈니스에서 실질적인 성과를 만드는 팀입니다
          </p>
        </div>
      </div>
    </section>
  );
}
