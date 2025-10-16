import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import SocialProof from "@/components/sections/social-proof";
import InteractiveDemo from "@/components/sections/interactive-demo";
import FeaturesGrid from "@/components/sections/features-grid";
import CreatorTabs from "@/components/sections/creator-tabs";
import WorkflowShowcase from "@/components/sections/workflow-showcase";
import TestimonialsSection from "@/components/sections/testimonials";
import FinalCta from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <SocialProof />
      <InteractiveDemo />
      <FeaturesGrid />
      <CreatorTabs />
      <WorkflowShowcase />
      <TestimonialsSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
