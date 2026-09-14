import Hero from "@/components/sections/home/Hero";
import Mission from "@/components/sections/home/Mission";
import CoreValues from "@/components/sections/home/CoreValues";
import Roadmap from "@/components/sections/home/Roadmap";
import Services from "@/components/sections/home/Services";
import ClientLogos from "@/components/sections/home/ClientLogos";
import InvestorLogos from "@/components/sections/home/InvestorLogos";
import RecruitBanner from "@/components/sections/home/RecruitBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <CoreValues />
      <Roadmap />
      <Services />
      <ClientLogos />
      <InvestorLogos />
      <RecruitBanner />
    </>
  );
}
