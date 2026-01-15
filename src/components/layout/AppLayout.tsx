import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useLocation, Outlet } from "react-router-dom";

export function AppLayout() {
  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith("/settings");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="ml-[80px] flex-1">
          <main className={isSettingsPage ? "" : "p-2 sm:p-3 lg:p-4"}>
            <Outlet />  
          </main>
        </div>
      </div>
    </div>
  );
}
