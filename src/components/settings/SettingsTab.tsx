import { Users, ClipboardList } from "lucide-react";
import { Tabs, TabsList, TabsTrigger,TabsContent } from "@/components/ui/tabs";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "roles", label: "Roles & Permissions", icon: <Users size={16} /> },
  { id: "users", label: "User Management", icon: <Users size={16} /> },
  { id: "audit", label: "Audit Logs", icon: <ClipboardList size={16} /> },
];

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  children?: React.ReactNode;
}

export function SettingsTabs({ activeTab, onTabChange, children }: SettingsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className=" overflow-hidden">
      <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none overflow-x-auto flex-shrink-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            {tab.icon}
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent };
