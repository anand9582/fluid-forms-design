import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicFilterDrawer } from "@/components/ui/dynamic-filter-drawer";
import { AddNewStorage } from "@/components/settings/Storage/DialogStorage/AddNewStorage";
import { getStorageUnits } from "@/components/settings/Storage/StorageVolume/StorageService";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";
import { StorageOverviewCards } from "@/components/settings/Storage/StorageVolume/StorageOverviewCards";
import { StorageUnitCard } from "@/components/settings/Storage/StorageVolume/StorageUnitCard";

export function StorageListView({
  onManage,
}: {
  onManage: (u: StorageUnit) => void;
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
            <h3 className="text-base sm:text-lg font-semibold text-black">
              Connected Storage Units
            </h3>
            <span className="text-xs bg-gray-200 font-roboto font-medium text-neutral-700 px-3 py-1 rounded-full">
                {filteredUnits.length}
                 Devices Total
            </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex rounded-lg overflow-hidden bg-gray-100 p-1">
              <button
                onClick={() => setFilter("primary")}
                className={cn(
                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-roboto font-medium rounded-md transition-all",
                  filter === "primary"
                    ? "bg-white text-primary shadow-md"
                    : "bg-transparent  text-gray-500 hover:text-gray-700"
                )}
              >
              Primary
            </button>

            <button
                onClick={() => setFilter("secondary")}
                className={cn(
                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-roboto font-medium rounded-md transition-all",
                  filter === "secondary"
                    ? "bg-white text-primary shadow-md"
                    : "bg-transparent text-black hover:text-gray-700"
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
         {filteredUnits.map((unit, index) => (
            <StorageUnitCard
              key={unit.id}
              unit={unit}
              index={index}  
              onManage={onManage}
            />
          ))}
      </div>
        <DynamicFilterDrawer
            open={newStorageOpen}
            onOpenChange={setNewStorageOpen}
            title="Add New Storage"
            description="Configure storage endpoints for video retention."
            applyLabel="Save Storage"
            width="xl"
            onApply={() => {
              console.log("Save Storage clicked");
              setNewStorageOpen(false);
            }}
          >
           <AddNewStorage />
      </DynamicFilterDrawer>

     
    </div>
  );
}
