"use client";

import { useState } from "react";

/**
 * 실서버(careers.letsur.ai/recruit) HTML/CSS 대조(2026-09-11) — "자주 묻는 질문" 아코디언.
 * 4개 그룹(지원 4 / 채용 프로세스 2 / 서류 전형 2 / 인터뷰 전형 1) 총 9개 문항, 그룹 라벨은
 * point-green(실서버 원본값 #00c781=teal-500이나, 이 프로젝트 규칙상 흰/연회색 배경엔 teal-600
 * `#00ab7f`를 써야 해서 그대로 치환 — 2026-09-11 사용자 지적) 24px/600. 문항: "Q." 라벨(20px/500 #888, 폭 42px 고정) + 질문(20px/500
 * #111) + 화살표(열림 시 180도 회전) + 답변(16px #6e6e6e, 열릴 때만 표시). 문항 사이 구분선.
 * 섹션 배경(2026-09-11 추가): 실서버는 `section fafafb`(연회색 `#fafafb`) — 처음엔 흰 배경으로
 * 구현했다가 사용자 지적으로 수정.
 * ⚠️ "Q." 정렬·간격(2026-09-11 재수정): 처음엔 `items-start` + Q 라벨(`line-height:2.1em`=42px)과
 * 질문(`line-height:1.5em`=30px)의 줄높이가 서로 달라 텍스트가 줄박스 안에서 각각 다르게
 * 중앙정렬되며 눈에 띄게 어긋나 보였음 — `items-center`로 바꿔 Q.와 질문을 서로 정중앙 정렬.
 * 가로 간격도 원래 `gap-[16px]`를 추가로 줬었는데, 실서버 실측 결과 Q.와 질문 사이에 별도 gap
 * 없이 Q. 라벨의 고정폭(42px) 자체가 여백 역할을 하는 구조였음(Q. 텍스트가 42px 박스 안에서
 * 왼쪽 정렬, 남는 폭만큼 자연스럽게 공백) — gap 제거. 수정 후 실측(top 좌표·행간 103px) 실서버와
 * 정확히 일치 확인.
 * ⚠️ 화살표 크기·클릭 인터랙션(2026-09-11 추가): 실서버 `.accordian-arrow`는 데스크톱 40px(모바일
 * 24px)인데 24px 고정으로 구현해 작았음 — `lg:` 분기로 40/24px 반영. 클릭 시 답변 영역도 실서버는
 * `height:0→66px`처럼 부드럽게 펼쳐지는 애니메이션이었는데(Playwright로 실서버 클릭 실측,
 * transitionend 전 mid-frame에서 48.9/66px 확인) 기존엔 `{open && <div>}` 방식이라 즉시
 * 나타났다 사라짐 — `grid-template-rows: 0fr→1fr` 트릭(콘텐츠를 항상 렌더링해두고 grid row
 * 크기만 트랜지션, 내부에 `overflow-hidden` 래퍼)으로 높이를 몰라도 부드럽게 펼쳐지도록 교체.
 * 여백 실측(2026-09-11): 인트로 문단→첫 그룹 라벨 간격 34px(mobile)/60px(lg, 기존 40/45px였음),
 * 그룹↔그룹 간격 42px(mobile)/80px(lg, 기존 40/45px였음) — 둘 다 실서버보다 좁았어서 확대.
 * ⚠️ 답변 상단 여백 보정(2026-09-17, 모바일 한정): 열렸을 때 질문↔답변 간격이 답변↔구분선 간격보다
 * 넓어 보이는 문제 발견. 실서버 DOM을 직접 열어 실측한 결과(`.accordian-item-body` 안에
 * `<div class="spacing-18px">`(실제 렌더 16px) 스페이서 + 답변, `.accordian-item` 자체 padding 30/30),
 * 실서버는 질문↔답변 16px / 답변↔구분선 30px로 애초에 비대칭 구조 — "균등하게"가 아니라 이 비율이
 * 맞는 디자인이었음. 모바일(base)에서만 이 구조를 반영: 열렸을 때 버튼 자신의 하단 padding을 0으로
 * 비우고, 그만큼을 답변 wrapper의 `pt-[16px]`로 대체(닫힘 상태·lg는 기존 그대로 `pb-[30px]` 유지 —
 * 데스크톱은 이번 변경 대상 아님, 사용자 지정).
 */
const FAQ_GROUPS = [
  {
    group: "지원",
    items: [
      {
        q: "경력이 부족해도 지원 가능한가요?",
        a: "렛서는 직무 역량, 성장 가능성, 조직 적합성 등 다양한 측면을 종합적으로 고려하여 지원서를 검토하고 있습니다.\n경력 기간이나 요건이 다소 부합하지 않더라도 지원하실 수 있습니다.",
      },
      {
        q: "여러 포지션에 중복 지원이 가능한가요?",
        a: "중복 지원하실 수 있습니다. 다만, 서류 검토 후 제출해주신 이력과 경험을 바탕으로 더 적합한 직무를 제안드릴 수 있습니다.",
      },
      {
        q: "재지원이 가능한가요?",
        a: "과거 지원 이력이 있으시더라도 재지원 가능합니다. 단, 최종 합격 후 입사를 중도에 포기한 경우에는 재지원이 제한됩니다.",
      },
      {
        q: "모집 마감일이 정해져 있나요?",
        a: "별도 마감일 없이 채용 완료시까지 모집을 진행하고 있습니다. 관심 있는 포지션이 있으실 경우 빠르게 지원해주시길 권장드립니다.",
      },
    ],
  },
  {
    group: "채용 프로세스",
    items: [
      {
        q: "전형 결과는 언제 확인할 수 있나요?",
        a: "각 전형 결과는 영업일 기준 7일 이내 이메일을 통해 개별 안내드립니다. 부득이하게 지연되는 경우 미리 안내드리고 있습니다.",
      },
      {
        q: "지원 예정이던 포지션의 채용이 마감되었습니다. 추가 모집 일정이 있을까요?",
        a: "인재풀 등록을 통해 지원서를 제출해 주세요. 인재풀에 등록하시면 우선적으로 검토하며, 적합한 포지션이 있을 경우 제안을 드릴 수 있습니다.",
      },
    ],
  },
  {
    group: "서류 전형",
    items: [
      {
        q: "지원서의 양식이 정해져 있나요?",
        a: "입사 지원서는 자유 양식입니다. 자유 양식의 이력서를 제출해주시되, 기본적인 경력 사항이 포함되도록 작성해주시기 바랍니다.\n이력서만으로 설명하기 어려운 부분이 있다면 포트폴리오 등의 추가 자료를 함께 제출해주셔도 좋습니다.",
      },
      {
        q: "제출한 지원서 및 이력을 삭제할 수 있나요?",
        a: "recruit@letsur.ai로 삭제 요청주시면 확인 후 처리해드리며, 제출된 개인정보는 관련 법령에 따라 자동으로 파기됩니다.\n그 외 제출 내역의 수정 또는 파기를 원하실 경우, 해당 메일 또는 안내받은 메일로 연락해 주시기 바랍니다.",
      },
    ],
  },
  {
    group: "인터뷰 전형",
    items: [
      {
        q: "인터뷰 복장은 어떻게 될까요?",
        a: "면접 복장은 자율입니다. 편안하면서도 단정한 복장으로 참석 부탁드립니다.",
      },
    ],
  },
];

export default function Faq() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className="flex w-full flex-col items-center bg-[#fafafb] px-xl py-[60px] lg:py-[100px]">
      <div className="flex w-full max-w-[1216px] flex-col gap-[14px]">
        <div>
          <p className="mb-[4px] text-base font-semibold text-[#00ab7f]">FAQ</p>
          <h2 className="text-[26px] leading-[1.4] font-semibold text-[#111111] lg:text-[36px]">자주 묻는 질문</h2>
        </div>
        <p className="text-lg font-normal text-[#333333]">
          FAQ 외에도 추가로 궁금한 사항이 있으시면, 채용 대표 메일 recruit@letsur.ai로 편하게 문의해주세요.
        </p>
      </div>

      <div className="mt-[34px] flex w-full max-w-[1216px] flex-col gap-[42px] lg:mt-[60px] lg:gap-[80px]">
        {FAQ_GROUPS.map((group) => (
          <div key={group.group}>
            <p className="mb-[14px] text-[22px] leading-[1.4] font-semibold text-[#00ab7f] lg:mb-[30px] lg:text-[24px]">
              {group.group}
            </p>
            <div className="flex flex-col border-t border-[#d3d3d3]">
              {group.items.map((item) => {
                const key = `${group.group}-${item.q}`;
                const open = openKey === key;
                return (
                  <div key={key} className="border-b border-[#d3d3d3]">
                    <button
                      type="button"
                      onClick={() => setOpenKey(open ? null : key)}
                      className={`flex w-full items-center pt-[30px] text-left ${open ? "pb-0 lg:pb-[30px]" : "pb-[30px]"}`}
                    >
                      <span className="w-[42px] shrink-0 text-base leading-[1.6] font-medium text-[#888888] lg:text-[20px] lg:leading-[2.1]">
                        Q.
                      </span>
                      <span className="flex flex-1 items-center justify-between gap-[16px]">
                        <span className="text-base leading-[1.5] font-medium text-[#111111] lg:text-[20px]">{item.q}</span>
                        <svg
                          viewBox="0 0 40 41"
                          fill="none"
                          aria-hidden="true"
                          className={`h-[25px] w-[24px] shrink-0 transition-transform duration-300 ease-in-out lg:h-[41px] lg:w-[40px] ${open ? "rotate-180" : ""}`}
                        >
                          <path
                            d="M11.9961 16.2812L19.9961 24.2813L27.9961 16.2812"
                            stroke="#9E9E9E"
                            strokeWidth="1.92"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex pt-[16px] pb-[30px] lg:pt-0">
                          <span className="w-[42px] shrink-0" />
                          <p className="whitespace-pre-line text-base leading-[1.5] text-[#6e6e6e]">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
