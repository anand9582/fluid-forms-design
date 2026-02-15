import { useState } from "react";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";
import { StorageListView } from "@/components/settings/Storage/StorageVolume/StorageListView";
import { ManageStorageView } from "@/components/settings/Storage/StorageVolume/ManageStorageView";

export function StorageVolume() {
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      {selectedUnit ? (
        <ManageStorageView
          unit={selectedUnit}
          onBack={() => setSelectedUnit(null)}
          />
        ) : (
          <StorageListView onManage={setSelectedUnit} />
        )}
    </div>
  );
}
