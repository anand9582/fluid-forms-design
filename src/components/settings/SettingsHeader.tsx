import { ArrowLeft, Settings, ChevronRight } from "lucide-react";
import { sidebarItems } from "@/components/settings/SidebarConfigs/Sidebar-config";
import { useNavigate, useLocation } from "react-router-dom";

export function SettingsHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumb: { label: string; route?: string }[] = [];

  // Root settings
  breadcrumb.push({ label: "Settings", route: "/settings" });

  // Detect current page from route
  sidebarItems.forEach((item) => {
    if (item.route === location.pathname) {
      breadcrumb.push({ label: item.label, route: item.route });
    }

    item.subItems?.forEach((sub) => {
      if (sub.route === location.pathname) {
        breadcrumb.push({ label: item.label, route: item.route });
        breadcrumb.push({ label: sub.label, route: sub.route });
      }
    });
  });

  // Find parent icon
  let icon: React.ReactNode = null;

  sidebarItems.forEach((item) => {
    if (
      item.route === location.pathname ||
      item.subItems?.some((sub) => sub.route === location.pathname)
    ) {
      icon = item.icon;
    }
  });

  return (
    <header className="bg-card border-b border-border px-4 py-2">
      
      {/* Top Row */}
      <div className="flex items-center gap-3 h-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <Settings size={18} className="text-muted-foreground" />
          <span className="font-semibold text-foreground">Settings</span>
        </div>

      </div>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground pl-12 space-x-2 mt-1">
        {breadcrumb.map((item, index) => (
          <span key={index} className="flex items-center gap-2">

            {/* Breadcrumb label */}
            <span
              onClick={() => item.route && navigate(item.route)}
              className={`cursor-pointer ${
                index === breadcrumb.length - 1
                  ? "text-foreground font-medium"
                  : "hover:underline"
              }`}
            >
              {item.label}
            </span>

            {/* Arrow */}
            {index < breadcrumb.length - 1 && (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}

          </span>
        ))}
      </div>

    </header>
  );
}