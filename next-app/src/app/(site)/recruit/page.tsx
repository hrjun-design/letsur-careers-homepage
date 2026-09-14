import Hero from "@/components/sections/recruit/Hero";
import Process from "@/components/sections/recruit/Process";
import JobList from "@/components/sections/recruit/JobList";
import Faq from "@/components/sections/recruit/Faq";
import FooterBanner from "@/components/sections/recruit/FooterBanner";
import { getOpenJobs } from "@/lib/jobs";

export const revalidate = 0; // 공고는 관리자가 아무 때나 등록/마감할 수 있으므로 캐시하지 않고 매 요청 조회

export default async function RecruitPage() {
  const jobs = await getOpenJobs();

  return (
    <>
      <Hero />
      <Process />
      <JobList jobs={jobs} />
      <Faq />
      <FooterBanner />
    </>
  );
}
