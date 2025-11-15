import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import InteractiveDemo from "@/components/sections/interactive-demo";
import FeaturesGrid from "@/components/sections/features-grid";
import CreatorTabs from "@/components/sections/creator-tabs";
import WorkflowShowcase from "@/components/sections/workflow-showcase";
import TestimonialsSection from "@/components/sections/testimonials";
import FinalCta from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";

export default function Page() {
  // Feature toggles allow us to hide sections without deleting their implementations
  const showPlatformSection = false;
  const showWorkflowSection = false;
  const showTestimonialsSection = false;

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      {/* <SocialProof /> */}
      <InteractiveDemo />
      <FeaturesGrid />
      {showPlatformSection && <CreatorTabs />}
      {showWorkflowSection && <WorkflowShowcase />}
      {showTestimonialsSection && <TestimonialsSection />}
      <FinalCta />
      <Footer />
    </main>
  );
}
