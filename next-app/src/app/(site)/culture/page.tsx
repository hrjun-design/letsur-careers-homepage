import Hero from "@/components/sections/culture/Hero";
import Intro from "@/components/sections/culture/Intro";
import Values from "@/components/sections/culture/Values";
import Review from "@/components/sections/culture/Review";
import Teams from "@/components/sections/culture/Teams";
import Benefits from "@/components/sections/culture/Benefits";
import FooterBanner from "@/components/sections/culture/FooterBanner";

// "렛서의 조직"(Teams) 섹션 노출 여부 — 2026-10-14 수정 요청으로 숨김. 다시 보이려면 true로만 바꾸면 됨
// (컴포넌트·이미지·카피는 그대로 보존)
const SHOW_TEAMS = false;

export default function CulturePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Values />
      <Review />
      {SHOW_TEAMS && <Teams />}
      <Benefits />
      <FooterBanner />
    </>
  );
}
