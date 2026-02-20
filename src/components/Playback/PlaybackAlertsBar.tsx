
import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { playbackAlertsData } from "./data";

export function PlaybackAlertsBar() {
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  return (
    <div className="bg-card border-t border-border flex-shrink-0">
      {/* Alert Bar Header */}
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Live Alerts</span>
            <Badge className="bg-primary text-primary-foreground text-[10px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
              {playbackAlertsData.length}
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground h-7 px-2">
            <Filter className="h-3 w-3" />
            <span className="text-xs">Filter by: Severity</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="default" size="icon"
          className="h-6 w-6 rounded bg-primary hover:bg-primary/90"
          onClick={() => setAlertsExpanded(!alertsExpanded)}
        >
          <ChevronUp className={cn("h-3.5 w-3.5 transition-transform duration-200", alertsExpanded && "rotate-180")} />
        </Button>
      </div>

      {/* Collapsible Alert Table */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        alertsExpanded ? "max-h-[280px]" : "max-h-0"
      )}>
        <div className="border-t border-border">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-4 py-1.5 bg-muted/30 text-[11px] font-medium text-muted-foreground">
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
          <div className="divide-y divide-border max-h-[230px] overflow-y-auto">
            {playbackAlertsData.map((alert, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-4 px-4 py-2.5 text-sm items-center hover:bg-muted/30 transition-colors">
                <div className="font-medium text-foreground text-xs">{alert.type}</div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground text-xs">
                  <span>{alert.icon}</span>
                  <span>{alert.description}</span>
                </div>
                <div className="text-muted-foreground text-[11px]">{alert.camera}</div>
                <div className={cn("font-medium text-[11px]", alert.statusColor)}>{alert.status}</div>
                <div className="text-muted-foreground text-[11px]">{alert.date}</div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-[11px]">{alert.aiMatch}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">
                      {alert.actionBy.initials}
                    </div>
                    <span className="text-foreground text-[11px]">{alert.actionBy.name}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
