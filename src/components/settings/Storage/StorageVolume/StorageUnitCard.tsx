import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StorageUnit } from "./StorageUnits";

interface Props {
  unit: StorageUnit;
  onManage: (unit: StorageUnit) => void;
}

export function StorageUnitCard({ unit, onManage }: Props) {
  const Icon = unit.icon;
  const usagePercent =
    unit.total > 0 ? Math.round((unit.used / unit.total) * 100) : 0;

  const barColor =
    usagePercent > 90
      ? "bg-destructive"
      : usagePercent > 70
      ? "bg-yellow-500"
      : "bg-primary";

  return (
    <div className="border border-border rounded-xl bg-card p-4 sm:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{unit.name}</span>
              {unit.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted">
                  {unit.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{unit.type}</p>
          </div>
        </div>
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="h-3.5 w-3.5" />
          Devices
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          Load
        </div>
        <span className="font-semibold">{unit.devices} Connected</span>
        <span className="font-semibold">{unit.load} Mbps</span>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Retention
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CircleDot className="h-3.5 w-3.5" />
          Discs
        </div>
        <span
          className={cn(
            "font-semibold",
            unit.retentionWarn ? "text-yellow-500" : ""
          )}
        >
          {unit.retention}
        </span>
        <span className="font-semibold">{unit.hardDiscs}</span>
      </div>

      {/* Usage */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Used {unit.used.toFixed(2)} TB</span>
          <span>Total {unit.total} TB</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", barColor)}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onManage(unit)}
        >
          Manage & Map
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
