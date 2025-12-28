import { Outlet } from "react-router-dom";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
export function SettingsLayout() {
  return (
    <div className="min-h-screen bg-white">
          <SettingsHeader />
      <div>
          <main className="p-2 sm:p-3 lg:p-4">
            <Outlet />
          </main>
      </div>
    </div>
  );
}
