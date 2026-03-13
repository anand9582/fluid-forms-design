import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { alertsData } from "@/components/LiveView/Data";
import useGridStore from "@/Store/UseGridStore";

export function LiveAlertsBar() {
  const { layout, selectedGrid } = useGridStore();

  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [autoSequence, setAutoSequence] = useState(false);

  const [showAutoSequenceBar, setShowAutoSequenceBar] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const AUTO_HIDE_DELAY = 3000; // 3 seconds

  // Function to show bar and auto-hide after delay
  const triggerAutoSequenceBar = () => {
    setShowAutoSequenceBar(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowAutoSequenceBar(false), AUTO_HIDE_DELAY);
  };

  // Show initially on mount
  useEffect(() => {
    triggerAutoSequenceBar();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Re-show whenever selectedGrid changes
  useEffect(() => {
    if (selectedGrid !== null) {
      triggerAutoSequenceBar();
    }
  }, [selectedGrid]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">

      {/* AUTO-SEQUENCE BAR WITH FADE + SLIDE */}
      <div
        className={cn(
          "flex justify-center transition-all duration-500 ease-in-out",
          showAutoSequenceBar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 bg-white text-xs px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="font-roboto font-medium">Layout:</span>
          <span className="font-roboto font-medium text-primary">
            {layout.rows}x{layout.cols}
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-roboto font-medium">Auto-Sequence:</span>
          <button
            onClick={() => setAutoSequence(!autoSequence)}
            className={cn(
              "font-roboto font-medium",
              autoSequence ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {autoSequence ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* 🔻 LIVE ALERTS CONTAINER */}
      <div className="bg-card border-t border-border w-full mt-1">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-semibold">Live Alerts</span>
              <Badge className="h-5 px-1.5 text-xs rounded-full bg-primary text-white">
                {alertsData.length}
              </Badge>
            </div>

            <Button variant="ghost" size="sm" className="gap-2 h-8">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-xs">Filter by: Severity</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            size="icon"
            className="h-7 w-7 bg-primary"
            onClick={() => setAlertsExpanded(!alertsExpanded)}
          >
            <ChevronUp
              className={cn(
                "h-4 w-4 transition-transform",
                alertsExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* EXPANDABLE TABLE */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            alertsExpanded ? "max-h-[300px]" : "max-h-0"
          )}
        >
          <div className="border-t border-border">
            <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs font-medium bg-muted/30">
              <div>Alert Type</div>
              <div className="col-span-2">Description</div>
              <div>Camera</div>
              <div>Status</div>
              <div>Date & Time</div>
              <div>Actions</div>
            </div>

            <div className="max-h-[250px] overflow-y-auto divide-y">
              {alertsData.map((alert, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-7 gap-4 px-4 py-3 text-sm items-center hover:bg-muted/30"
                >
                  <div className="font-medium">{alert.type}</div>
                  <div className="col-span-2 flex gap-2 text-muted-foreground">
                    <span>{alert.icon}</span>
                    <span>{alert.description}</span>
                  </div>
                  <div className="text-xs">{alert.camera}</div>
                  <div className={cn("text-xs", alert.statusColor)}>
                    {alert.status}
                  </div>
                  <div className="text-xs">{alert.date}</div>
                  <div className="text-xs">{alert.actionBy.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}