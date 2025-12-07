import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { LiveMonitor } from "@/components/dashboard/LiveMonitor";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIAlerts } from "@/components/dashboard/AIAlerts";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { FacilityMap } from "@/components/dashboard/FacilityMap";
import { StorageVolumes } from "@/components/dashboard/StorageVolumes";
import { NetworkThroughput } from "@/components/dashboard/NetworkThroughput";
import { ComprehensiveAlerts } from "@/components/dashboard/ComprehensiveAlerts";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Header - Full Width at Top */}
      <Header />

      {/* Content Area with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Main Content */}
        <div className="flex-1 ml-[72px] transition-all duration-300">
          {/* Dashboard Grid */}
          <main className="p-3 lg:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-3 lg:space-y-4">
                <SystemStatus />
                <SystemHealth />
                <StorageVolumes />
              </div>

              {/* Middle Column */}
              <div className="lg:col-span-6 space-y-3 lg:space-y-4">
                <LiveMonitor />
                <FacilityMap />
                <NetworkThroughput />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 space-y-3 lg:space-y-4">
                <QuickActions />
                <AIAlerts />
                <ComprehensiveAlerts />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
