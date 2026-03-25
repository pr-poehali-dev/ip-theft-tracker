import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import FeaturesSection from "@/components/FeaturesSection";
import FooterSection from "@/components/FooterSection";
import StartMonitoringModal from "@/components/StartMonitoringModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState<{
    queries: string[];
    marketplace: string;
    type: string;
  } | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleSearch = (queries: string[], marketplace: string, type: string) => {
    setSearchTrigger({ queries, marketplace, type });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onStartMonitoring={handleOpenModal} />
      <HeroSection onStartMonitoring={handleOpenModal} />
      <MonitoringDashboard searchTrigger={searchTrigger} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturesSection />
      </div>
      <FooterSection />

      {isModalOpen && (
        <StartMonitoringModal
          onClose={() => setIsModalOpen(false)}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default Index;
