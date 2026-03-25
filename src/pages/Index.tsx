import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import FeaturesSection from "@/components/FeaturesSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MonitoringDashboard />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturesSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
