import { notFound } from "next/navigation";
import Link from "next/link";
import FooterBanner from "@/components/sections/recruit/FooterBanner";
import { getJobBySlug } from "@/lib/jobs";

/**
 * 채용 공고 상세 — 실서버(careers.letsur.ai/recruit/[slug]) HTML/CSS 대조(2026-09-11).
 * - 실서버 구조: `.career-detail-gird`(2열 그리드, 좁은 열 356px)에 타이틀+정보카드(직군/경력/고용형태/
 *   근무지, `.career-detail-info`는 `position:sticky`)와 리치텍스트 본문(`.career-detail-contents`)이
 *   나란히 배치. 다만 각 요소의 정확한 grid-area 지정(Webflow가 노드 ID별로 CSS 생성)까진 크롤링으로
 *   못 가져와서, 통상적인 컨벤션(넓은 본문 왼쪽 + 좁은 sticky 정보카드 오른쪽)으로 대체 구현.
 * - 지도(구글맵·네이버맵)는 실서버도 구글맵은 `display:none`으로 숨겨두고 네이버맵만 쓰는데, 네이버맵은
 *   자체 API 키(ncpKeyId)가 필요해 이번엔 생략 — 주소 텍스트만 노출.
 * - "지원하기" 버튼(`.text-block-82`, point-green 배경 52px)은 기본적으로 외부 채용 플랫폼(원티드/
 *   그리팅/remember 등)으로 연결. apply_url이 "/"로 시작하면 내부 라우트로 판단해 자체 폼(예: 인재풀
 *   등록 `/recruit/[slug]/apply`)으로 연결(2026-09-15 추가) — apply_url이 없는 공고(초안 단계 등)는
 *   버튼 숨김.
 * - 본문 리치텍스트(`.career-post`)는 Webflow 원본 HTML을 그대로 렌더링, 태그별 스타일은 실서버
 *   CSS 값(h3 24px/600, h4 18px/600, p 16px/1.7, ul 16px/1.6 등) 그대로 재현.
 */
export const revalidate = 0;

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) notFound();

  return (
    <>
      <section className="flex w-full justify-center bg-white px-xl py-[60px] lg:py-[100px]">
        <div className="flex w-full max-w-[1216px] flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-[80px]">
          {/* 본문 */}
          <div className="order-2 min-w-0 flex-1 lg:order-1">
            <p className="mb-[16px] text-sm lg:hidden">
              <Link href="/recruit" className="text-[#6e6e6e] underline">
                ← 채용공고 목록으로
              </Link>
            </p>
            <div
              className="career-post [&_a]:text-[#111111] [&_a]:underline [&_h3]:mb-[6px] [&_h3]:text-[24px] [&_h3]:leading-[1.3] [&_h3]:font-semibold [&_h3]:text-[#111111] [&_h4]:mb-[6px] [&_h4]:text-[18px] [&_h4]:leading-[1.5] [&_h4]:font-semibold [&_h4]:text-[#111111] [&_iframe]:h-full [&_iframe]:w-full [&_li]:mb-[4px] [&_ol]:mb-[16px] [&_ol]:list-decimal [&_ol]:pl-[20px] [&_ol]:text-[16px] [&_ol]:leading-[1.6] [&_ol]:text-[#333333] [&_p]:mb-[16px] [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-[#333333] [&_strong]:font-bold [&_ul]:mb-[16px] [&_ul]:list-disc [&_ul]:pl-[20px] [&_ul]:text-[16px] [&_ul]:leading-[1.6] [&_ul]:text-[#333333] [&_ul_ul]:mt-[4px]"
            >
              <h1 className="mb-[16px] text-[26px] leading-[1.4] font-semibold text-[#111111] lg:mb-[24px] lg:text-[36px]">
                {job.title}
              </h1>
              {job.descriptionHtml ? (
                <div
                  className="[&_figure]:relative [&_figure]:mb-[16px] [&_figure]:aspect-video [&_figure]:overflow-hidden [&_figure]:rounded-[8px]"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />
              ) : (
                <p className="text-[16px] leading-[1.7] text-[#6e6e6e]">상세 내용이 아직 등록되지 않았습니다.</p>
              )}
            </div>
          </div>

          {/* 정보 카드 */}
          <div className="order-1 w-full shrink-0 lg:sticky lg:top-[120px] lg:order-2 lg:w-[356px]">
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-t border-[#e1e1e1] py-[24px] first:border-t-0">
                <span className="min-w-[104px] text-base font-semibold text-[#888888]">직군</span>
                <span className="text-base text-[#333333]">{job.group}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e1e1e1] py-[24px]">
                <span className="min-w-[104px] text-base font-semibold text-[#888888]">경력사항</span>
                <span className="text-base text-[#333333]">{job.career}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e1e1e1] py-[24px]">
                <span className="min-w-[104px] text-base font-semibold text-[#888888]">고용형태</span>
                <span className="text-base text-[#333333]">{job.type}</span>
              </div>
              {job.location && (
                <div className="flex items-center justify-between border-t border-b border-[#e1e1e1] py-[24px]">
                  <span className="min-w-[104px] text-base font-semibold text-[#888888]">근무지</span>
                  <span className="text-right text-base text-[#333333]">{job.location}</span>
                </div>
              )}
            </div>
            {job.applyUrl &&
              (job.applyUrl.startsWith("/") ? (
                <Link
                  href={job.applyUrl}
                  className="mt-[30px] flex h-[52px] w-full items-center justify-center bg-[#00ab7f] text-lg font-bold text-white"
                >
                  지원하기
                </Link>
              ) : (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-[30px] flex h-[52px] w-full items-center justify-center bg-[#00ab7f] text-lg font-bold text-white"
                >
                  지원하기
                </a>
              ))}
          </div>
        </div>
      </section>
      <FooterBanner />
    </>
  );
}
