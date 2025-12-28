import { Users, Monitor, HardDrive, Code2, BarChart3, Key, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    hasSubmenu?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { id: "manage-users", label: "Manage Users", icon: <Users size={18} /> },
  { id: "manage-devices", label: "Manage Devices", icon: <Monitor size={18} />, hasSubmenu: true },
  { id: "storage", label: "Storage and Recording", icon: <HardDrive size={18} /> },
  { id: "api-sdk", label: "API & SDK", icon: <Code2 size={18} /> },
  { id: "video-analytics", label: "Video Analytics", icon: <BarChart3 size={18} /> },
  { id: "licensing", label: "Licensing", icon: <Key size={18} /> },
];

interface SettingsSidebarProps {
    activeItem: string;
    onItemClick: (id: string) => void;
}

export function SettingsSidebar({
  activeItem,
  onItemClick,
}: SettingsSidebarProps) {
  return (
    <aside className="w-[220px] border rounded bg-background">
      <ScrollArea className="h-full p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}

                <span className="flex-1 text-left">{item.label}</span>

                {item.hasSubmenu && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
