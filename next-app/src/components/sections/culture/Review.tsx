"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 실서버(careers.letsur.ai/culture) HTML/CSS 대조 완료(2026-09-11).
 * - 섹션 배경 #eeeff0(연회색)
 * - 인용문 24px/20px(mobile) medium(500), 곡선 따옴표(" ")와 명시적 줄바꿈 포함 — 실제 원문 그대로
 * - 역할 텍스트는 인용문 "아래"(기존엔 역할이 위, 인용문이 아래였음 — 순서 반대로 잘못 구현돼 있었음),
 *   16px/14px(mobile) medium, 회색(#6e6e6e), margin-top 22px/15px
 * - ⚠️ 좌우 화살표·롤링 모션(2026-09-11 추가): 실서버가 이 슬라이더에도 Webflow 기본 슬라이더
 *   (`.quote-slider`, `data-autoplay="true" data-delay="3000" data-duration="500"`)를 그대로
 *   써서 자동 롤링 + 화살표 클릭 시 옆으로 미는 모션이 있었음 — 기존엔 버튼만 있고 순간 전환(모션 없음)
 *   이었던 걸 `Intro.tsx`와 동일한 3슬롯 트랙 방식(슬라이드 1장 = 트랙의 1/3)으로 구현.
 *   Playwright로 실서버 클릭 실측 결과 방향은 표준(다음=우→좌, 새 인용문이 오른쪽에서 진입) —
 *   `Intro.tsx` 최종 수정본과 동일한 방향.
 * - 버튼 스타일도 실서버 그대로 반영: `.slider-arrow`(이 슬라이더 전용 클래스, `Intro.tsx`가 쓰는
 *   `.group-slider-arrow`와는 다름)는 기본 배경이 **흰색**(연회색 섹션 위에서 도드라지도록, Intro의
 *   회색 `#F5F5F5` 배경과 다른 이유)이고 위치도 `margin:-76px`(Intro는 `-62px`) — Playwright로
 *   실서버 버튼·컨테이너 rect 실측(box 352~1568, 버튼 276~324/1596~1644, 즉 컨테이너 기준
 *   `-76px`)해서 그대로 `left-[-76px]`/`right-[-76px]`로 반영
 * - ⚠️ 버그 수정(2026-09-11): 처음엔 `overflow-hidden`을 버튼까지 포함한 바깥 wrapper에 걸어서,
 *   버튼이 `-76px`로 박스 바깥에 배치되자마자 그 wrapper 자신의 overflow-hidden에 의해 잘려
 *   안 보이는 상태였음(자동 롤링 자체는 트랙 내부 동작이라 문제 없이 보였음 — 그래서 "롤링은 되는데
 *   화살표만 안 보인다"는 증상). `Intro.tsx`처럼 overflow-hidden을 트랙만 감싸는 **한 단계 안쪽**
 *   래퍼로 옮기고, 버튼은 그 바깥(안 잘리는) 레벨에 둬서 해결.
 */
const VOICES = [
  {
    quote: (
      <>
        “고객이 겪은 비즈니스 상황 속에서 <br />
        최적의 솔루션을 제안하는 과정이 늘 도전적입니다. <br />
        AI 전환 파트너로서, 고객의 여정을 함께한다는 자부심을 갖고 있습니다.”
      </>
    ),
    role: "영업 - Sales Manager",
  },
  {
    quote: (
      <>
        “연구와 실전을 오가며 고객 문제를 정교하게 해결할 수 있는 <br />
        모델을 만드는 일은 큰 의미가 있습니다. <br />
        기술의 본질로 비즈니스 임팩트를 창출한다는 점에서 큰 성취감을 느껴요.”
      </>
    ),
    role: "AI - AI Engineer",
  },
  {
    quote: (
      <>
        “AI 제품을 기획하고 설계하며, 실제 서비스로 구현되는 전 과정을 책임집니다. <br />
        사용자 경험과 확장성을 함께 고려하며 Staix와 같은 주요 플랫폼을 <br />
        책임지고 있다는 점에서 큰 보람을 느낍니다.”
      </>
    ),
    role: "제품 - Product Manager",
  },
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

function Voice({ voice }: { voice: (typeof VOICES)[number] }) {
  return (
    <div className="flex w-1/3 shrink-0 flex-col items-center px-xl text-center">
      <p className="text-[20px] leading-[1.4] font-medium text-[#222222] lg:text-[24px]">{voice.quote}</p>
      <span className="mt-[15px] text-sm font-medium text-[#6e6e6e] lg:mt-[22px] lg:text-base">{voice.role}</span>
    </div>
  );
}

const AUTOPLAY_MS = 3000;
const TRANSITION_MS = 500;

export default function Review() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState<"none" | "forward" | "backward">("none");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatingRef = useRef(false);

  const len = VOICES.length;
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

  // 트랙 폭이 300%(3장분)라 한 칸은 100/3%. n=1(대기)/2(다음)/0(이전) 슬롯만큼 옮긴다.
  const SLOT_PERCENT = 100 / 3;
  const slotsShifted = transitioning === "forward" ? 2 : transitioning === "backward" ? 0 : 1;

  return (
    <>
    <section className="flex w-full items-center justify-center bg-[#eeeff0] py-[60px] lg:py-[100px]">
      <div className="relative w-full max-w-[1216px]">
        <div className="overflow-hidden">
          <div
            className="flex w-[300%]"
            style={{
              transform: `translateX(-${slotsShifted * SLOT_PERCENT}%)`,
              transition: transitioning === "none" ? "none" : `transform ${TRANSITION_MS}ms ease`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <Voice voice={VOICES[prevIndex]} />
            <Voice voice={VOICES[index]} />
            <Voice voice={VOICES[nextIndex]} />
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrevClick}
          aria-label="이전 인사말"
          className="absolute top-1/2 left-[-76px] z-10 hidden size-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[color:var(--color-colors-neutral-gray-450)] hover:bg-[#333333] hover:text-white lg:flex"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          aria-label="다음 인사말"
          className="absolute top-1/2 right-[-76px] z-10 hidden size-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[color:var(--color-colors-neutral-gray-450)] hover:bg-[#333333] hover:text-white lg:flex"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
    <div className="flex w-full items-center justify-center gap-[8px] bg-white py-[16px]">
      {VOICES.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}번째 인사말로 이동`}
          onClick={() => {
            if (i === index) return;
            if (i === nextIndex) handleNextClick();
            else if (i === prevIndex) handlePrevClick();
          }}
          className={`size-[8px] rounded-full transition-colors ${i === index ? "bg-[#00ab7f]" : "bg-[#d9d9d9]"}`}
        />
      ))}
    </div>
    </>
  );
}
