import TalentPoolApplyForm from "@/components/sections/recruit/TalentPoolApplyForm";

/**
 * 인재풀 등록 지원 폼 — 현재는 "상시 인재풀 등록"(`slug=talent-pool`) 공고의 "지원하기"에서만
 * 연결된다. `stories/06-talent-pool.md` 스펙 기준 구현, 라우트는 향후 다른 공고에도 재사용할 수
 * 있도록 `[slug]/apply`로 잡아뒀지만 지금은 폼 내용이 인재풀 전용으로 고정돼 있다.
 */
export default function TalentPoolApplyPage() {
  return (
    <section className="flex w-full justify-center bg-white px-xl">
      <TalentPoolApplyForm />
    </section>
  );
}
