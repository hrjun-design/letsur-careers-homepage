import Link from "next/link";

/**
 * 배경 이미지는 `asset/2 culture/footer_culture_banner.png` — 사전 export본 그대로 사용.
 * 카피는 Webflow 실서버 크롤링 결과 홈 화면 배너와 완전히 동일한 문구였음(2026-09-09 확인).
 * 실서버 CSS 대조(2026-09-11): 타이틀 26px(mobile)/36px(lg) — 기존 28px이었음, 버튼은
 * font-weight 600(기존 bold였음), padding 14px 40px(실서버 `.primary-button` 기준 유지).
 * 버튼 hover 효과(2026-09-11): 처음엔 `letsur-homepage-3.0` ax-consulting "더 알아보기" 버튼의
 * `hover:opacity-*`를 그대로 가져왔으나, 그 버튼은 흰 배경 카드 위라 opacity를 낮춰도 균일하게만
 * 밝아지는 반면, 이 배너는 바쁜 그라디언트 사진 배경 위라 opacity를 낮추면 배경이 얼룩덜룩 비치고
 * 텍스트까지 같이 옅어져 가독성이 떨어짐 — 사용자가 "텍스트는 그대로 두고 버튼 색만 한 단계 밝게"로
 * 정정. 텍스트에 영향 없는 `hover:bg-[#222222]`(토큰 `neutral-gray-850`, 기존 배경 `#111111`=
 * `neutral-gray-900`에서 한 단계 밝은 값)로 교체.
 */
export default function FooterBanner() {
  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#020201] bg-cover bg-center px-xl py-[80px] lg:py-[120px]"
      style={{ backgroundImage: "url(/images/culture/footer_culture_banner.png)" }}
    >
      <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-[24px] text-center">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-white lg:text-[36px]">
          한국을 넘어 아시아의 AI의{" "}
          <br className="lg:hidden" />
          기준이 될 팀 렛서,
          <br />
          그 성장의 중심에 함께하세요
        </h2>
        <Link
          href="/recruit"
          className="flex items-center justify-center bg-[#111111] px-[24px] py-[12px] text-base font-semibold text-white transition-colors hover:bg-[#222222] lg:h-[56px] lg:px-[40px] lg:py-[14px] lg:text-lg"
        >
          채용 공고 보러가기
        </Link>
      </div>
    </section>
  );
}
