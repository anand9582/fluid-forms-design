import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { sidebarItems } from "@/components/settings/SidebarConfigs/Sidebar-config";

export function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const activeRoute = location.pathname;

  // Auto expand parent when child route active
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.subItems?.some((sub) => activeRoute.startsWith(sub.route))) {
        setExpandedItems((prev) =>
          prev.includes(item.id) ? prev : [...prev, item.id]
        );
      }
    });
  }, [activeRoute]);

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
                      onClick={() => navigate(sub.route)}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg text-left hover:bg-muted",
                        activeRoute === sub.route &&
                          "bg-[#E2E8F0] text-black"
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
                onClick={() => navigate(item.route!)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted",
                  activeRoute === item.route &&
                    "bg-[#E2E8F0] text-[#404040]"
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