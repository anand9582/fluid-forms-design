// Live Alerts Bar Component
// Bottom bar showing live alerts with expandable table view

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { alertsData } from "@/components/LiveView/data";

export function LiveAlertsBar() {
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      {/* Alert Bar Header - Always visible */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Alert Indicator */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-semibold text-foreground">Live Alerts</span>
            <Badge className="bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full">
              {alertsData.length}
            </Badge>
          </div>
          
          {/* Filter Button */}
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground h-8">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-xs">Filter by: Severity</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        {/* Expand/Collapse Toggle */}
        <Button 
          variant="default"
          size="icon" 
          className="h-7 w-7 rounded-md bg-primary hover:bg-primary/90"
          onClick={() => setAlertsExpanded(!alertsExpanded)}
        >
          <ChevronUp className={cn(
            "h-4 w-4 transition-transform duration-200",
            alertsExpanded && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Collapsible Alert Table */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          alertsExpanded ? "max-h-[300px]" : "max-h-0"
        )}
      >
        <div className="border-t border-border">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
            <div>Alert Type</div>
            <div className="col-span-2">Description</div>
            <div>Camera / Location</div>
            <div>Status</div>
            <div>Date & Time</div>
            <div className="flex items-center gap-8">
              <span>AI Match</span>
              <span>Actions By</span>
            </div>
          </div>
          
          {/* Alert Rows */}
          <div className="divide-y divide-border max-h-[250px] overflow-y-auto">
            {alertsData.map((alert, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-4 px-4 py-3 text-sm items-center hover:bg-muted/30 transition-colors">
                <div className="font-medium text-foreground">{alert.type}</div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <span>{alert.icon}</span>
                  <span>{alert.description}</span>
                </div>
                <div className="text-muted-foreground text-xs">{alert.camera}</div>
                <div className={cn("font-medium text-xs", alert.statusColor)}>{alert.status}</div>
                <div className="text-muted-foreground text-xs">{alert.date}</div>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground text-xs">{alert.aiMatch}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                      {alert.actionBy.initials}
                    </div>
                    <span className="text-foreground text-xs">{alert.actionBy.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
