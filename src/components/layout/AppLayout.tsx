import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const location = useLocation();

  const isPlayback = location.pathname.startsWith("/playback");

  const noPaddingRoutes = ["/settings", "/live", "/playback"];
  const noSidebarRoutes = ["/playback"];

  const isNoPaddingPage = noPaddingRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const showSidebar = !noSidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div
      className={cn(
        "bg-white flex flex-col",
        isPlayback
          ? "h-screen overflow-hidden"   // ✅ ONLY playback
          : "min-h-screen"               // ✅ all other pages
      )}
    >
      {/* HEADER */}
      <Header />

      {/* BODY */}
      <div
        className={cn(
          "flex flex-1",
          isPlayback && "min-h-0 overflow-hidden"
        )}
      >
        {showSidebar && <Sidebar />}

        <div
          className={cn(
            "flex-1",
            showSidebar && "ml-[80px]",
            isPlayback && "min-h-0 overflow-hidden"
          )}
        >
          <main
            className={cn(
              isPlayback
                ? "h-full min-h-0 overflow-hidden"
                : "",
              isNoPaddingPage ? "" : "p-2 sm:p-3 lg:p-4"
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
