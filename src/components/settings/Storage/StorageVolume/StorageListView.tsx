import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicFilterDrawer } from "@/components/ui/dynamic-filter-drawer";
import { AddStorageUnitContent } from "@/components/settings/Storage/ManageStorageView";
import { getStorageUnits } from "@/components/settings/Storage/StorageVolume/StorageService";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";
import { StorageOverviewCards } from "@/components/settings/Storage/StorageVolume/StorageOverviewCards";
import { StorageUnitCard } from "@/components/settings/Storage/StorageVolume/StorageUnitCard";

export function StorageListView({
  onManage,
  onAddStorage,
}: {
  onManage: (u: StorageUnit) => void;
  onAddStorage: () => void;
}) {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [filter, setFilter] = useState<"primary" | "secondary">("primary");
const [newStorageOpen, setNewStorageOpen] = useState(false);

  useEffect(() => {
    getStorageUnits().then(setUnits);
  }, []);

  const filteredUnits = units.filter((u) => u.category === filter);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <StorageOverviewCards />

      {/* ===== Header + Filters + Add Button ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Connected Storage Units
          </h3>
          <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
            {filteredUnits.length} Devices
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Primary / Secondary Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter("primary")}
              className={cn(
                "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                filter === "primary"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              Primary
            </button>
            <button
              onClick={() => setFilter("secondary")}
              className={cn(
                "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                filter === "secondary"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              Secondary
            </button>
          </div>

          {/* Add Storage Button */}
          <Button
            size="sm"
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
           onClick={() => setNewStorageOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add storage unit</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* ===== Storage Cards ===== */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUnits.map((unit) => (
          <StorageUnitCard
            key={unit.id}
            unit={unit}
            onManage={onManage}
          />
        ))}
      </div>
      <DynamicFilterDrawer
        open={newStorageOpen}
        onOpenChange={setNewStorageOpen}
        title="Add New Storage"
        applyLabel="Save Storage"
         width="xl"
        onApply={() => {
          // yaha save logic aayega
          console.log("Save Storage clicked");
          setNewStorageOpen(false);
        }}
      >
        <AddStorageUnitContent />
      </DynamicFilterDrawer>

     
    </div>
  );
}
