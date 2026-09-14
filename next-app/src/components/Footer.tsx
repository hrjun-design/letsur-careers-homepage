/**
 * 이 사이트(letsur-careers) 전용 Footer.
 * 메인 렛서 홈페이지(letsur-homepage-3.0)의 Footer.tsx와 스타일·구조를 그대로 통일한다
 * (사용자 확정, 2026-09-09 — GNB와 동일한 방침). Figma 근거: "렛서 홈페이지 3.0 디자인 마스터"
 * (`X4mGxjTMeIBiy4sf8Z54If`) node `970:9941`.
 *
 * ⚠️ 링크 대상: 이 사이트는 메인 홈페이지와 별도 배포라 "고객 사례"/"회사 소개"는 내부 라우트가
 * 아니라 메인 홈페이지 도메인으로 나가는 외부 링크로 바꿨다. 메인 홈페이지의 최종 프로덕션
 * 도메인이 아직 확정 전이라(`letsur.ai` vs 임시 Vercel 링크) 우선 `letsur.ai` 기준으로 넣어두고,
 * 확정되면 재확인 필요.
 *
 * ⚠️ 고객문의 이메일: Figma 마스터 노드 원문은 "letsur@letsur.ai"인데, 메인 홈페이지 실제 코드는
 * "customer.service@letsur.ai"를 씀 — 둘이 다름. 여기서는 메인 홈페이지 실제 코드값을 따랐다
 * (실서비스에 실제 쓰이는 주소일 가능성이 높다고 판단). 확인 필요.
 */
function Divider() {
  return <span className="h-[12px] w-px bg-[#c6c6c6]" aria-hidden="true" />;
}

export default function Footer() {
  return (
    <footer className="bg-[#111] lg:bg-black">
      <div className="mx-auto flex max-w-[1216px] flex-col px-4 py-[40px] lg:px-0 lg:py-[64px]">
        <img
          src="/logo/logo-horizontal-white.svg"
          alt="letsur"
          className="mb-[24px] h-[18px] w-auto self-start lg:hidden"
        />
        <div className="mb-[40px] hidden items-center justify-between lg:flex">
          <img src="/logo/logo-horizontal-white.svg" alt="letsur" className="h-[24px] w-auto" />
          <nav className="flex items-center gap-[24px]">
            <a
              href="https://letsur.ai/cases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base leading-6 font-medium text-[#e1e1e1] hover:text-white"
            >
              고객 사례
            </a>
            <a
              href="https://letsur.ai/aboutus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base leading-6 font-medium text-[#e1e1e1] hover:text-white"
            >
              회사 소개
            </a>
            <a
              href="https://ai-gateway.kr/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base leading-6 font-medium text-[#e1e1e1] hover:text-white"
            >
              블로그
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-[32px] lg:gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <a
              href="https://letsur.notion.site/d8978a3a8ee049dc8b26dc26d2f76e36"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] leading-[22px] font-bold text-[#e1e1e1] hover:text-white lg:text-base lg:leading-6 lg:font-medium"
            >
              이용약관
            </a>
            <Divider />
            <a
              href="https://letsur.notion.site/68e837a8476142efb67a3cb5ab22b21f"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] leading-[22px] font-bold text-[#e1e1e1] hover:text-white lg:text-base lg:leading-6 lg:font-medium"
            >
              개인정보 처리방침
            </a>
          </div>

          <div className="flex flex-col gap-[12px]">
            <span className="text-sm leading-5 font-bold text-[#e1e1e1] lg:hidden">(주) 렛서</span>
            <div className="flex flex-col gap-[6px] lg:hidden">
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">
                주소: 서울특별시 강남구 테헤란로 38길 8, 오피스B 역삼2호점 13층
              </span>
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">사업자등록번호: 146-87-02023</span>
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">대표이사: 심규현</span>
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">고객문의: customer.service@letsur.ai</span>
            </div>

            <div className="hidden flex-wrap items-center gap-[10px] lg:flex">
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">(주)렛서</span>
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">
                주소: 서울특별시 강남구 테헤란로 38길 8, 오피스B 역삼2호점 13층
              </span>
              <Divider />
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">사업자등록번호: 146-87-02023</span>
              <Divider />
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">대표이사: 심규현</span>
              <Divider />
              <span className="text-sm leading-5 font-normal text-[#e1e1e1]">고객문의: customer.service@letsur.ai</span>
            </div>
          </div>

          <p className="text-sm leading-5 font-normal text-[#6e6e6e]">© Copyrights by Letsur. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
