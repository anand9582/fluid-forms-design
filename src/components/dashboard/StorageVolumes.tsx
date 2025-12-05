import { ChevronRight, ChevronDown, HardDrive, Cloud, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StorageItem {
  name: string;
  percentage: number;
  used?: string;
  total?: string;
  color: string;
  children?: StorageItem[];
}

const storageData: StorageItem[] = [
  { name: "CAMPulse Cloud", percentage: 54, color: "bg-primary" },
  { name: "NAS-01 (Pri)", percentage: 90, color: "bg-destructive" },
  {
    name: "NAS-02 (Pri)",
    percentage: 54,
    color: "bg-primary",
    children: [
      { name: "Bay 1 (HDD)", percentage: 53, used: "32/60TB", total: "32/60TB", color: "bg-primary" },
      { name: "Bay 2 (HDD)", percentage: 53, used: "32/60TB", total: "32/60TB", color: "bg-primary" },
    ],
  },
  { name: "Local HDD Array", percentage: 95, color: "bg-destructive" },
];

function StorageRow({ item, level = 0 }: { item: StorageItem; level?: number }) {
  const [expanded, setExpanded] = useState(item.name === "NAS-02 (Pri)");

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-2 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors",
          level > 0 && "ml-4"
        )}
        onClick={() => item.children && setExpanded(!expanded)}
      >
        {item.children ? (
          expanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}

        {level > 0 ? (
          <HardDrive className="w-4 h-4 text-muted-foreground" />
        ) : item.name.includes("Cloud") ? (
          <Cloud className="w-4 h-4 text-primary" />
        ) : (
          <HardDrive className="w-4 h-4 text-muted-foreground" />
        )}

        <span className="flex-1 text-sm text-foreground">{item.name}</span>

        {item.total && (
          <span className="text-xs text-muted-foreground mr-2">{item.total}</span>
        )}

        <span
          className={cn(
            "text-sm font-medium",
            item.percentage >= 90 ? "text-destructive" : "text-foreground"
          )}
        >
          {item.percentage}%
        </span>
      </div>

      {/* Progress bar for main items */}
      {!item.children && level === 0 && (
        <div className="ml-10 mr-2 mb-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", item.color)}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Children */}
      {item.children && expanded && (
        <div className="border-l border-border ml-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide px-4 py-1">
            Mounted disks
          </p>
          {item.children.map((child) => (
            <StorageRow key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StorageVolumes() {
  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
      {/* Header */}
      <h3 className="font-semibold text-foreground mb-4">STORAGE VOLUMES</h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Space</p>
          <p className="text-xl font-bold text-foreground">
            780<span className="text-sm font-normal text-muted-foreground">TB</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">USED</p>
          <p className="text-xl font-bold text-primary">
            331<span className="text-sm font-normal text-muted-foreground">TB</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">FREE</p>
          <p className="text-xl font-bold text-success">
            58<span className="text-sm font-normal text-muted-foreground">%</span>
          </p>
        </div>
      </div>

      {/* Storage List */}
      <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-thin">
        {storageData.map((item) => (
          <StorageRow key={item.name} item={item} />
        ))}
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
      >
        Manage Volumes
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
