import { useState } from "react";
import {
  Users,
  Monitor,
  HardDrive,
  Code2,
  BarChart3,
  Key,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ManageUsers,
  Devices,
  Apisdk
} from "@/components/ui/icons";

interface SubItem {
  id: string;
  label: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
}

const sidebarItems: SidebarItem[] = [
  { id: "manage-users", label: "Manage Users", icon: <ManageUsers size={18} /> },
  {
    id: "manage-devices",
    label: "Manage Devices",
    icon: <Devices size={18} />,
    subItems: [
      { id: "add-devices", label: "Add Devices" },
      { id: "configure-devices", label: "Configure Devices" },
    ],
  },
  { id: "storage", label: "Storage and Recording", icon: <HardDrive size={18} /> },
  { id: "api-sdk", label: "API & SDK", icon: <Apisdk size={18} /> },
  { id: "video-analytics", label: "Video Analytics", icon: <BarChart3 size={18} /> },
  { id: "licensing", label: "Licensing", icon: <Key size={18} /> },
];

interface SettingsSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function SettingsSidebar({ activeItem, onItemClick }: SettingsSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["manage-devices"]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSubItemActive = (item: SidebarItem) =>
    item.subItems?.some((sub) => sub.id === activeItem);

  return (
    <aside className="w-56 shrink-0 border rounded-md bg-white">
      <ScrollArea className="h-full p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) =>
            item.subItems ? (
                <Collapsible
                  key={item.id}
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => toggleExpand(item.id)}
                >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted",
                      (activeItem === item.id || isSubItemActive(item)) &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform",
                        expandedItems.includes(item.id) && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-6 space-y-1 mt-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onItemClick(sub.id)}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg text-left hover:bg-muted",
                        activeItem === sub.id && "bg-primary/10 text-primary"
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted",
                  activeItem === item.id && "bg-[#E2E8F0] text-[#404040]"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            )
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
