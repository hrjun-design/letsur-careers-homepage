"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * 실서버(careers.letsur.ai/culture) HTML/CSS 대조 완료(2026-09-11).
 * - 섹션 자체가 밝은 배경(흰색)+어두운 텍스트였음 — 기존엔 검정 배경+흰 텍스트로 반대로 구현돼 있었음
 * - "Our Team" 같은 eyebrow 라벨은 실서버에 없음 — 제거
 * - 하단은 정적 3분할 그리드가 아니라 **슬라이더**(한 번에 1장, 좌우 화살표) — 첫 2장은 유튜브 썸네일
 *   + 재생 버튼(외부 링크), 3번째는 일반 이미지. 실제 이미지·영상 링크 그대로 반영
 * - 구조만 맞춘 1차 패스 — 자동재생·도트 인디케이터는 아직 미구현
 * - ⚠️ 좌우 화살표 버튼(2026-09-11 수정): 기존엔 사각형 테두리+텍스트 화살표로 임시 구현돼 있었으나,
 *   실서버 CSS(`.group-slider-arrow`)가 쓰는 SVG(`Property 1=Arrow_Left/Right_default_light.svg`)를
 *   까보니 48px 원형 버튼(bg `#F5F5F5`=neutral-gray-100, 화살표 `#AFAFAF`=neutral-gray-450)이었고,
 *   이건 `letsur-homepage-3.0`의 `aboutus/Testimonials.tsx` 등에서 이미 쓰던 공유 버튼 컴포넌트와
 *   완전히 동일한 스타일(같은 토큰, 같은 아이콘 path)이라 그 패턴을 그대로 가져옴.
 * - ⚠️ 위치 재수정(2026-09-11 2차) — 처음엔 실서버 실측 그대로(이미지 좌우 끝단에 48px 겹치는
 *   오버레이 방식)로 반영했으나, 사용자가 스크린샷 비교로 "이미지 영역 바깥"(Testimonials.tsx의
 *   `-62px` 바깥 배치 방식)을 원한다고 지정 — `left-[-62px]`/`right-[-62px]`로 변경
 * - 3.5초 자동 롤링 + 옆으로 미는 슬라이드 모션(2026-09-11, 아래 참고) — 수동 클릭 시 타이머 리셋
 * - ⚠️ 슬라이드 모션 구조: 매 순간 [이전, 현재, 다음] 3장을 트랙 하나(폭 300%)에 나란히 두고
 *   (각 슬라이드는 트랙의 1/3인 33.333%), 트랙을 `translateX(-33.333%×n)`만큼 옮겨 원하는 슬롯을
 *   컨테이너 안으로 가져옴 — 대기(현재 보이기) n=1, 다음으로 전환 n=2, 이전으로 전환 n=0.
 *   자동 롤링/다음 버튼은 우→좌(새 슬라이드가 오른쪽에서 진입), 이전 버튼은 좌→우 모션(표준 캐러셀
 *   방향, 2026-09-11 3차 — 아래 참고). 트랜지션 종료 시(`onTransitionEnd`) index를 갱신하면서
 *   동시에 transition을 꺼서(`transitioning:"none"`) 순간 이동처럼 안 보이게(스냅) 처리.
 * - ⚠️ 버그 수정 이력(2026-09-11): 처음엔 대기 위치를 `translateX(-100%)`로 계산했는데, 이 퍼센트는
 *   트랙 자신의 전체 폭(300%) 기준이라 실제로는 트랙 전체 폭만큼(슬라이드 3장 분량, 컨테이너 폭의
 *   3배) 밀려나 화면 밖으로 완전히 벗어나 버림(대기 상태에서 아무 이미지도 안 보이는 회색 박스만
 *   나타남 — 사용자가 다음 요청으로 방향을 물어보기 전까진 스크린샷을 항상 전환 도중에만 찍어서
 *   놓쳤던 회귀). 트랙 폭이 300%이므로 슬라이드 한 칸은 그 1/3(33.333%)이라는 걸 반영해 수정.
 * - ⚠️ 방향 정정(2026-09-11 3차) — 처음엔 "좌→우"로 반대로 구현했다가, 사용자가 참고 사이트
 *   (aible-campus.com "현장에서 발견했습니다" 슬라이더)를 지정해 실제로 다음 버튼을 클릭해보니
 *   그 사이트는 표준 방향(다음=우→좌, 새 슬라이드가 오른쪽에서 진입)이었음을 확인 → 슬롯 순서를
 *   [다음,현재,이전]에서 [이전,현재,다음]으로 뒤집어 표준 방향으로 수정.
 */
const SLIDES = [
  { img: "/images/culture/intro-slide1.png", videoUrl: "https://www.youtube.com/watch?si=NuTaVYQmgWHCdHgv&v=IHlTW27Yf14" },
  { img: "/images/culture/intro-slide2.png", videoUrl: "https://youtube.com/watch?si=qpdQzBHYL3GbybbA&v=M2DQxq_Cm8A" },
  { img: "/images/culture/intro-slide3.png", videoUrl: null },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  const d =
    direction === "left"
      ? "M8.4 15.6L1.2 8.4L8.4 1.2M21 8.4H1.8"
      : "M13.8 1.2L21 8.4L13.8 15.6M20.4 8.4H1.2";
  return (
    <svg width="22" height="17" viewBox="0 0 22.2 16.8" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Slide({ slide }: { slide: (typeof SLIDES)[number] }) {
  return (
    <div className="relative h-full w-1/3 shrink-0">
      <Image src={slide.img} alt="" fill sizes="(min-width: 1216px) 1216px, 100vw" className="object-cover" />
      {slide.videoUrl && (
        <a
          href={slide.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="영상 재생"
          className="absolute inset-0 flex items-center justify-center"
        >
          <img src="/images/culture/icon_play.svg" alt="" className="h-[80px] w-[80px]" />
        </a>
      )}
    </div>
  );
}

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 500;

export default function Intro() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState<"none" | "forward" | "backward">("none");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatingRef = useRef(false);

  const len = SLIDES.length;
  const nextIndex = (index + 1) % len;
  const prevIndex = (index - 1 + len) % len;

  const goForward = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setTransitioning("forward");
  };

  const goBackward = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setTransitioning("backward");
  };

  const handleTransitionEnd = () => {
    setTransitioning((current) => {
      if (current === "forward") setIndex(nextIndex);
      else if (current === "backward") setIndex(prevIndex);
      return "none";
    });
    animatingRef.current = false;
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goForward, AUTOPLAY_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevClick = () => {
    goBackward();
    resetTimer();
  };

  const handleNextClick = () => {
    goForward();
    resetTimer();
  };

  // 트랙 폭이 300%(3슬라이드분)라 한 칸은 100/3%. n=1(대기)/2(다음)/0(이전) 슬롯만큼 옮긴다.
  const SLOT_PERCENT = 100 / 3;
  const slotsShifted = transitioning === "forward" ? 2 : transitioning === "backward" ? 0 : 1;

  return (
    <section className="flex w-full flex-col items-center gap-[22px] bg-white px-xl py-[60px] lg:gap-[45px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[14px] text-center lg:gap-[22px]">
        <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">렛서의 구성원</h2>
        <p className="text-base leading-[1.7] font-normal text-[#333333]">
          렛서는 어려운 기술적 과제를 전략적 비즈니스 기회로 전환시키는 동료들로 이루어져 있습니다.
          <br />
          각자의 영역에서 전문성을 갖춘 우리는 치열하게 고민하여 더 단단한 전략을 만들고, 비즈니스에 실질적인 임팩트를 만들어냅니다.
        </p>
      </div>
      <div className="relative w-full max-w-[1216px]">
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#e5e5e5]">
          <div
            className="flex h-full w-[300%]"
            style={{
              transform: `translateX(-${slotsShifted * SLOT_PERCENT}%)`,
              transition: transitioning === "none" ? "none" : `transform ${TRANSITION_MS}ms ease`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <Slide slide={SLIDES[prevIndex]} />
            <Slide slide={SLIDES[index]} />
            <Slide slide={SLIDES[nextIndex]} />
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrevClick}
          aria-label="이전"
          className="absolute top-1/2 left-[-62px] z-10 hidden size-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-colors-neutral-gray-100)] text-[color:var(--color-colors-neutral-gray-450)] hover:bg-[color:var(--color-colors-neutral-gray-200)] hover:text-[color:var(--color-colors-neutral-gray-600)] lg:flex"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          aria-label="다음"
          className="absolute top-1/2 right-[-62px] z-10 hidden size-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-colors-neutral-gray-100)] text-[color:var(--color-colors-neutral-gray-450)] hover:bg-[color:var(--color-colors-neutral-gray-200)] hover:text-[color:var(--color-colors-neutral-gray-600)] lg:flex"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
  );
}
