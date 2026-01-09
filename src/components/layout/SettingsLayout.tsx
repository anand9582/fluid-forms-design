import { Outlet } from "react-router-dom";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
export function SettingsLayout() {
  return (
    <div className="min-h-screen bg-white">
          <SettingsHeader />
      <div>
          <main className="p-2 sm:p-3 lg:p-3 bg-[#F9FAFB]">
              <Outlet />
          </main>
      </div>
    </div>
  );
}
