import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  ArrowRight,
  Loader,
  Activity,
  HardDrive,
  Clock,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StorageUnit } from "./StorageUnits";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {

  unit: StorageUnit;
  index: number; // 👈 index pass karenge
  onManage: (unit: StorageUnit) => void;
  onEdit?: (unit: StorageUnit) => void;
  onDelete?: (unit: StorageUnit) => void;
}

export function StorageUnitCard({ unit, index, onManage, onEdit, onDelete }: Props) {
  const Icon = unit.icon;

  // 👇 FIRST CARD GREEN, REST BLUE
  const isPrimaryCard = index === 0;

  const usagePercent =
    unit.total > 0 ? Math.round((unit.used / unit.total) * 100) : 0;

  const barColor =
    usagePercent > 90
      ? "bg-red-500"
      : usagePercent > 70
        ? "bg-yellow-400"
        : "bg-emerald-500";

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {/* ICON */}
          <div
            className={cn(
              "h-11 w-11 rounded-sm flex items-center justify-center",
              isPrimaryCard ? "bg-cyan-50" : "bg-primary/10"
            )}
          >
            <Icon
              strokeWidth={1.5}
              className={cn(
                "h-4.2 w-4.2",
                isPrimaryCard ? "text-cyan-600" : "text-primary"
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm  font-roboto font-medium text-black">
                {unit.name}
              </h3>
              {unit.badge && (
                <span className="text-xs px-3 py-1 rounded-full bg-muted font-roboto font-medium text-black">
                  {unit.badge}
                </span>
              )}
            </div>
            <p className="text-sm font-roboto font-medium text-neutral-500">{unit.type}</p>
          </div>
        </div>

        <Pencil
          className="h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={() => onEdit?.(unit)}
        />
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
        <div className="flex items-center gap-2 font-roboto font-medium text-neutral-500">
          <Activity className="h-4 w-4 text-neutral-500" />
          Devices
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="h-3.5 w-3.5" />
          Load
        </div>

        <span className="font-semibold">{unit.devices} Connected</span>
        <span className="font-semibold">{unit.load} Mbps</span>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Estimated Retention
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <HardDrive className="h-3.5 w-3.5" />
          Hard Discs
        </div>

        <span
          className={cn(
            "font-semibold",
            unit.retentionWarn ? "text-yellow-500" : ""
          )}
        >
          {unit.retention}
        </span>
        <span className="font-semibold">{unit.hardDiscs} Connected</span>
      </div>

      {/* ================= USAGE ================= */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Used: {unit.used.toFixed(2)} TB</span>
          <span>Total: {unit.total} TB</span>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all", barColor)}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-2 pt-3 border-t">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-2 justify-center"
          onClick={() => onManage(unit)}
        >
          Manage and Map Devices
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>

        <Button size="icon" variant="outline" onClick={() => onDelete?.(unit)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function StorageUnitCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {/* ICON */}
          <Skeleton className="h-11 w-11 rounded-sm" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <Skeleton className="h-4 w-4" />
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* ================= USAGE ================= */}
      <div>
        <div className="flex justify-between mb-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="h-2 rounded-full overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-2 pt-3 border-t">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}
