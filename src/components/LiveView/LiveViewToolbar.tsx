// Live View Toolbar Component
// Top toolbar with camera list toggle, saved views, grid layouts, and save button

import { useState } from "react";
import {
  ChevronDown,
  Search,
  Grid2X2,
  Grid3X3,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { CustomGridBuilder } from "./CustomGridBuilder";
import { SaveViewDialog } from "./SaveViewDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useGridStore from "@/Store/UseGridStore";
import { API_VAISHALI_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { Devices, Squaredot, Tablecells } from "@/components/Icons/Svg/liveViewIcons";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";

interface GridStore {
  layout: { rows: number; cols: number };
  setLayout: (rows: number, cols: number) => void;
  assignCameraToSlot: (slotIndex: number, cameraId: string) => void;
}

interface LiveViewToolbarProps {
  gridStore: GridStore;
  showCameraList: boolean;
  onToggleCameraList: () => void;
  selectedLayout?: string;
  onLayoutChange?: (layout: string) => void;
  showCustomGridBuilder?: boolean;
  enableSaveView?: boolean;
  mode?: "live" | "playback";
}

export function LiveViewToolbar({
  gridStore,
  showCameraList,
  onToggleCameraList,
  showCustomGridBuilder = true,
  enableSaveView = false,
  mode = "live",
}: LiveViewToolbarProps) {
  const { layout, setLayout } = gridStore;

  const currentGridLabel = `${layout.rows}×${layout.cols}`;
  const [savedViews, setSavedViews] = useState<{ id: number, name: string }[]>([]);
  const [selectedView, setSelectedView] = useState(currentGridLabel);
  const [activeViewId, setActiveViewId] = useState<number | null>(null);
  const [viewsDropdownOpen, setViewsDropdownOpen] = useState(false);
  const [showGridBuilder, setShowGridBuilder] = useState(false);
  const [showSaveViewDialog, setShowSaveViewDialog] = useState(false);

  useEffect(() => {
    if (/^\d+×\d+$/.test(selectedView) || selectedView === "") {
      setSelectedView(currentGridLabel);
    }
  }, [layout.rows, layout.cols, currentGridLabel, selectedView]);

  const fetchViews = useCallback(async () => {
    try {
      const response = await fetch(`${API_VAISHALI_URL}${API_URLS.get_all_views}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        const views = json?.data?.map((v: any) => ({
          id: v.id,
          name: v.viewName,
          cellMapping: v.cellMapping,
          // Extract layout from cellMapping or use a default if not present
          // Based on the user provided data, layout isn't explicit but we can infer from cellMapping keys
        })) || [];
        setSavedViews(views);
      }
    } catch (error) {
      console.error("Error fetching views:", error);
    }
  }, []);

  // Fetch saved views from API
  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  const handleCustomGridConfirm = (layoutStr: string) => {
    const [rows, cols] = layoutStr.split("x").map(Number);
    setLayout(rows, cols);
    setShowGridBuilder(false);
  };


  const deleteView = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_VAISHALI_URL}${API_URLS.delete_view_by_id}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        toast.success("View deleted successfully");
        fetchViews();
      } else {
        toast.error("Failed to delete view");
      }
    } catch (error) {
      console.error("Error deleting view:", error);
      toast.error("Error deleting view");
    }
  };

  const handleApplyView = (view: any) => {
    setSelectedView(view.name);
    setActiveViewId(view.id);
    setViewsDropdownOpen(false);

    // If view has cellMapping, apply it
    if (view.cellMapping) {
      // Determine layout based on cellMapping indices
      const indices = Object.keys(view.cellMapping).map(Number);
      const maxIndex = Math.max(...indices, -1);

      let rows = 2, cols = 2;
      if (maxIndex >= 16) { rows = 5; cols = 5; }
      else if (maxIndex >= 9) { rows = 4; cols = 4; }
      else if (maxIndex >= 4) { rows = 3; cols = 3; }
      else if (maxIndex >= 1) { rows = 2; cols = 2; }
      else { rows = 1; cols = 1; }

      setLayout(rows, cols);

      // Apply camera assignments
      Object.entries(view.cellMapping).forEach(([slotIdx, cameraId]) => {
        const idx = Number(slotIdx);
        if (!isNaN(idx) && cameraId !== null) {
          setLayout(rows, cols); // Ensure slots are available
          gridStore.assignCameraToSlot(idx, String(cameraId));
        }
      });
    }
  };

  return (
    <div className="flex items-center px-4 py-2 border-b border-border bg-[#E2E8F0]">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCameraList}
          className="gap-2 h-[36px] px-3 text-black hover:text-foreground hover:bg-accent bg-[#F5F5F5]"
        >
          <Devices />
          <span className="text-sm font-roboto font-medium">
            {showCameraList ? "Hide" : "Show"} Camera List
          </span>
        </Button>

        {mode === "live" && (
          <DropdownMenu open={viewsDropdownOpen} onOpenChange={setViewsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-[36px] px-3 bg-white text-black"
              >
                <span className="text-sm">{selectedView}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[280px] p-0">
              {/* Search */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search Views..." className="pl-9 h-9" />
                </div>
              </div>

              {/* Views List */}
              <div className="py-1 max-h-[240px] overflow-y-auto">
                {savedViews.map((view) => (
                  <div
                    key={view.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-accent transition-colors bg-white",
                      selectedView === view.name && "bg-accent"
                    )}
                    onClick={() => handleApplyView(view)}
                  >
                    <span className="text-sm">{view.name}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={(e) => deleteView(view.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2">

          <div className="flex items-center justify-between w-[160px] h-[38px] bg-[#F5F5F5] rounded-md border px-1 py-2 shadow-sm">

            <Button
              variant="ghost"
              className={cn(
                "h-7 w-7",
                layout.rows === 2 ? "bg-white shadow" : "hover:bg-slate-200"
              )}
              onClick={() => setLayout(2, 2)}
            >
              <Grid2X2 className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "h-7 w-7",
                layout.rows === 3 ? "bg-white shadow" : "hover:bg-slate-200"
              )}
              onClick={() => setLayout(3, 3)}
            >
              <Grid3X3 className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "h-7 w-7",
                layout.rows === 5 ? "bg-white shadow" : "hover:bg-slate-200"
              )}
              onClick={() => setLayout(5, 5)}
            >
              <Tablecells className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "h-7 w-7",
                layout.rows === 1 ? "bg-white shadow" : "hover:bg-slate-200"
              )}
              onClick={() => setLayout(1, 1)}
            >
              <Squaredot className="h-4 w-4 text-gray-600" />
            </Button>

          </div>

          {showCustomGridBuilder && (
            <Button
              variant="ghost"
              size="icon"
              className="h-[24px] w-[24px] bg-white border rounded shadow-sm"
              onClick={() => setShowGridBuilder(true)}
            >
              <Plus className="h-4 w-4 text-black" />
            </Button>
          )}

        </div>
      </div>

      <div className="flex items-center gap-2">
        {mode === "live" && (
          <Button
            className="gap-2 h-[36px] px-4 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setShowSaveViewDialog(true)}
          >
            <Save className="h-4 w-4" />
            <span className="text-sm">Save View</span>
          </Button>
        )}
      </div>

      <SaveViewDialog
        open={showSaveViewDialog}
        onOpenChange={setShowSaveViewDialog}
        onSuccess={fetchViews}
        activeViewId={activeViewId}
        currentName={selectedView}
      />

      {/* Custom Grid Builder modal */}
      {showCustomGridBuilder && (
        <CustomGridBuilder
          open={showGridBuilder}
          onClose={() => setShowGridBuilder(false)}
        />
      )}
    </div>
       {
    mode === "live" && (
      <CustomGridBuilder
        open={showGridBuilder}
        onClose={() => setShowGridBuilder(false)}
        onConfirm={handleCustomGridConfirm}
      />
    )
  }
</div >
  );
}
