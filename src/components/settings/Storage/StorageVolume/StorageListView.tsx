import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicFilterDrawer } from "@/components/ui/dynamic-filter-drawer";
import { AddNewStorage } from "@/components/settings/Storage/DialogStorage/AddNewStorage";
import { getStorageUnits } from "@/components/settings/Storage/StorageVolume/StorageService";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";
import { StorageOverviewCards } from "@/components/settings/Storage/StorageVolume/StorageOverviewCards";
import { StorageUnitCard, StorageUnitCardSkeleton } from "@/components/settings/Storage/StorageVolume/StorageUnitCard";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { API_MANISH_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";

export function StorageListView({
  onManage,
}: {
  onManage: (u: StorageUnit) => void;
}) {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [filter, setFilter] = useState<"primary" | "secondary">("primary");
  const [newStorageOpen, setNewStorageOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<StorageUnit | null>(null);

  // Delete states
  const [deletingUnit, setDeletingUnit] = useState<StorageUnit | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNotEmptyDialog, setShowNotEmptyDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getStorageUnits()
      .then(setUnits)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUnits = units.filter((u) => u.category === filter);

  const handleDeleteRequest = (unit: StorageUnit) => {
    setDeletingUnit(unit);
    if (unit.devices > 0) {
      setShowNotEmptyDialog(true);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const executeDelete = async () => {
    if (!deletingUnit) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_MANISH_URL}${API_URLS.delete_storage_by_id}/${deletingUnit.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success(`Storage unit deleted successfully`);
        setUnits(units.filter(u => u.id !== deletingUnit.id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete storage");
      }
    } catch (error) {
      console.error("Error deleting storage:", error);
      toast.error("An error occurred while deleting storage");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
      setDeletingUnit(null);
    }
  };

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
            onClick={() => {
              setEditingUnit(null);
              setNewStorageOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add storage unit</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* ===== Storage Cards ===== */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <StorageUnitCardSkeleton key={index} />
          ))
        ) : filteredUnits.length > 0 ? (
          filteredUnits.map((unit, index) => (
            <StorageUnitCard
              key={unit.id}
              unit={unit}
              index={index}
              onManage={onManage}
              onEdit={(u) => {
                setEditingUnit(u);
                setNewStorageOpen(true);
              }}
              onDelete={handleDeleteRequest}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-muted-foreground flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <p className="text-sm font-medium">No storage units found.</p>
          </div>
        )}
      </div>
      <DynamicFilterDrawer
        open={newStorageOpen}
        onOpenChange={(open) => {
          setNewStorageOpen(open);
          if (!open) setEditingUnit(null);
        }}
        title={editingUnit ? "Edit Storage" : "Add New Storage"}
        description="Configure storage endpoints for video retention."
        applyLabel="Save Storage"
        width="xl"
        onApply={() => {
          console.log("Save Storage clicked");
          setNewStorageOpen(false);
        }}
      >
        <AddNewStorage
          role={filter.toUpperCase()}
          editData={editingUnit?.rawData}
          onClose={() => {
            setNewStorageOpen(false);
            setEditingUnit(null);
            getStorageUnits().then(setUnits);
          }}
        />
      </DynamicFilterDrawer>

      {/* standard Confirm Delete Dialog */}
      <ConfirmDialog
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        title="Delete Storage Unit"
        description={<>Are you sure you want to delete the storage unit <strong>{deletingUnit?.name}</strong>? This action cannot be undone.</>}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        onConfirm={executeDelete}
      />

      {/* "Not Empty" Dialog */}
      <ConfirmDialog
        open={showNotEmptyDialog}
        onOpenChange={setShowNotEmptyDialog}
        title="Storage Unit Not Empty"
        description={
          <div className="flex flex-col items-center justify-center text-center pt-2">
            <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-sm font-medium text-foreground">Storage Unit Not Empty</p>
            <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed">
              This volume still hosts {deletingUnit?.devices} mapped devices. You must move them to another storage unit before removing this volume.
            </p>
          </div>
        }
        confirmLabel="Go to Manage"
        onConfirm={() => {
          setShowNotEmptyDialog(false);
          if (deletingUnit) {
            onManage(deletingUnit);
          }
        }}
      />
    </div>
  );
}
