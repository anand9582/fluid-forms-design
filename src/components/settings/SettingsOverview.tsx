  
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
export default function SettingsOverview() {
  return (
 <div className="flex min-h-screen bg-muted/20">
      <SettingsSidebar  />
      <div className="flex-1 overflow-hidden pl-4" >
        <Outlet />
      </div>
    </div>
  );
}