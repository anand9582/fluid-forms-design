import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { ManageDevicesPage } from "@/components/settings/ManageDevicesPage";
// import { StoragePage } from "@/components/settings/pages/StoragePage";
// import { ApiSdkPage } from "@/components/settings/pages/ApiSdkPage";
// import { VideoAnalyticsPage } from "@/components/settings/pages/VideoAnalyticsPage";
// import { LicensingPage } from "@/components/settings/pages/LicensingPage";

const SettingsOverview = () => {
  const [activePage, setActivePage] = useState("manage-users");

  const renderRightPage = () => {
    switch (activePage) {
      case "manage-users":
        return <SettingsContent activeSidebarItem={activePage} />;

      case "manage-devices":
        return <ManageDevicesPage />;

      // case "storage":
      //   return <StoragePage />;

      // case "api-sdk":
      //   return <ApiSdkPage />;

      // case "video-analytics":
      //   return <VideoAnalyticsPage />;

      // case "licensing":
      //   return <LicensingPage />;

      // default:
      //   return <ManageUsersPage />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <SettingsSidebar
        activeItem={activePage}
        onItemClick={setActivePage}
      />

      {/* 🔥 RIGHT SIDE PAGE */}
      <div className="flex-1 p-6 overflow-auto">
        {renderRightPage()}
      </div>
    </div>
  );
};

export default SettingsOverview;
