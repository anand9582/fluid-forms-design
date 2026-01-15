import { Tabs, TabsList, TabsTrigger, TabsContent as ShadcnTabsContent } from "@/components/ui/tabs";

export interface SettingsTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
interface SettingsTabsProps {
  tabs?: SettingsTab[];          
  activeTab?: string;            
  defaultValue?: string;       
  onTabChange?: (id: string) => void;
  children?: React.ReactNode;
}


export function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
  defaultValue,
  children,
}: SettingsTabsProps) {
  return (
    <Tabs
      value={activeTab}             // controlled if provided
      defaultValue={defaultValue}   // uncontrolled if activeTab not provided
      onValueChange={onTabChange}
      className="flex-1 flex flex-col overflow-hidden pl-4"
    >
      {tabs && tabs.length > 0 && (
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-none border-b-2 border-transparent
                data-[state=active]:border-primary
                data-[state=active]:text-primary
                text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              {tab.icon}
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {children}
    </Tabs>
  );
}


export { ShadcnTabsContent as TabsContent };
