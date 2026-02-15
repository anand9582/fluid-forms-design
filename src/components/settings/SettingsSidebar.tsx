import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sidebarItems } from "@/components/settings/SidebarConfigs/Sidebar-config";
import { useSettingsStore } from "@/Store/UseSettingsStore";

export function SettingsSidebar({ onNavigate }: { onNavigate: (route: string, id: string) => void }) {
  const { activeItem, setActiveItem, setActiveRoute } = useSettingsStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Expand parent items if their child is active
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.subItems?.some((sub) => sub.id === activeItem)) {
          setExpandedItems((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
        }
    });
  }, [activeItem]);

  const toggleExpand = (id: string) => {
      setExpandedItems((prev) =>
         prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
   };

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
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted">
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={cn("transition-transform", expandedItems.includes(item.id) && "rotate-180")}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-6 space-y-1 mt-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveItem(sub.id);    
                        setActiveRoute(sub.route); 
                        onNavigate(sub.route, sub.id);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg text-left hover:bg-muted",
                        activeItem === sub.id && "bg-[#E2E8F0] text-black"
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
                onClick={() => {
                  setActiveItem(item.id);
                  setActiveRoute(item.route);
                  onNavigate(item.route, item.id);
                }}
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
