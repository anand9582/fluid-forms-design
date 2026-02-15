import { Button } from "@/components/ui/button";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";

export function ManageStorageView({
  unit,
  onBack,
}: {
  unit: StorageUnit;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button onClick={onBack}>← Back</Button>
      <h2 className="text-xl font-bold">{unit.name}</h2>
      <p>Manage configuration here (future API)</p>
    </div>
  );
}
