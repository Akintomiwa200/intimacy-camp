import { Header } from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { TheArmySection } from "@/src/components/sections/TheArmySection";
import { WhoWeAreSection } from "@/src/components/sections/WhoWeAreSection";
import { VisionMissionSection } from "@/src/components/sections/VisionMissionSection";
import { InitiativesSection } from "@/src/components/sections/InitiativesSection";
import { FeaturesSection } from "@/src/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
// import { CTASection } from "@/src/components/sections/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TheArmySection />
      <WhoWeAreSection />
      <VisionMissionSection />
      <InitiativesSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/*<CTASection />*/}
      <Footer />
    </main>
  );
}
