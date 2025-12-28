import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
   const location = useLocation();
   const isSettingsPage = location.pathname.startsWith("/settings");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="ml-[80px] flex-1">
            <main className={isSettingsPage ? "" : "p-2 sm:p-3 lg:p-4"}>
              {children}
            </main>
        </div>
      </div>
    </div>
  );
}
