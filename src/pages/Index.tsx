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
import { cn } from "@/lib/utils";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        {/* Header */}
        <Header />

        {/* Dashboard Grid */}
        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-6">
              <SystemStatus />
              <SystemHealth />
              <StorageVolumes />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-6 space-y-4 lg:space-y-6">
              <LiveMonitor />
              <FacilityMap />
              <NetworkThroughput />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-6">
              <QuickActions />
              <AIAlerts />
              <ComprehensiveAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
