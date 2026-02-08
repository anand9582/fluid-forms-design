import { ArrowLeft,Settings,ChevronRight } from "lucide-react";
import { useSettingsStore } from "@/Store/UseSettingsStore";
import { sidebarItems } from "@/components/settings/SidebarConfigs/Sidebar-config";
import { useNavigate } from "react-router-dom";

export function SettingsHeader() {
  const { activeItem,goBack  } = useSettingsStore();
  const navigate = useNavigate();

  // Breadcrumb ko build karna
  const breadcrumb: { label: string; route?: string }[] = [];

  // Root Settings always first
  breadcrumb.push({ label: "Settings", route: "/" });

  sidebarItems.forEach((item) => {
    if (item.id === activeItem) {
      breadcrumb.push({ label: item.label, route: item.route });
    }
    item.subItems?.forEach((sub) => {
      if (sub.id === activeItem) {
        breadcrumb.push({ label: item.label, route: item.route });
        breadcrumb.push({ label: sub.label, route: sub.route });
      }
    });
  });

  // Find parent icon
  let icon: React.ReactNode = null;
  sidebarItems.forEach((item) => {
    if (item.id === activeItem || item.subItems?.some((sub) => sub.id === activeItem)) {
      icon = item.icon;
    }
  });

  return (
    <header className="bg-card border-b border-border px-4 py-2">
      {/* Top row: Parent icon + parent label */}
      <div className="flex items-center gap-3 h-10">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2">
           <Settings size={18} className="text-muted-foreground" />
          <span className="font-semibold text-foreground">Settings</span>
        </div>
      </div>

      {/* Breadcrumb row */}
      <div className="flex items-center text-sm text-muted-foreground pl-12  space-x-2">
        {breadcrumb.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className={index === breadcrumb.length - 1 ? "text-foreground font-medium font-roboto" : ""}
            >
              {item.label}
            </span>
            {index < breadcrumb.length - 1 && <span> <ChevronRight size={16} className="text-muted-foreground" /></span>}
          </span>
        ))}
      </div>
    </header>
  );
}






