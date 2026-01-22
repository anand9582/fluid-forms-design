// Live View Toolbar Component
// Top toolbar with camera list toggle, saved views, grid layouts, and save button

import { useState } from "react";
import { 
  Camera, 
  ChevronDown, 
  Search, 
  Grid2X2, 
  Grid3X3, 
  Plus, 
  Save,
  Trash2,
  LayoutGrid
} from "lucide-react";
  import { CustomGridBuilder } from "./CustomGridBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { gridLayouts, savedViewsData } from "./Data";
import type { SavedView } from "./types";

interface LiveViewToolbarProps {
  showCameraList: boolean;
  onToggleCameraList: () => void;
  selectedLayout: string;
  onLayoutChange: (layout: string) => void;
}

export function LiveViewToolbar({ 
  showCameraList, 
  onToggleCameraList, 
  selectedLayout, 
  onLayoutChange 
}: LiveViewToolbarProps) {
  const [savedViews, setSavedViews] = useState<SavedView[]>(savedViewsData);
  const [selectedView, setSelectedView] = useState("Main entrance surveillance");
  const [viewsDropdownOpen, setViewsDropdownOpen] = useState(false);
  const [showGridBuilder, setShowGridBuilder] = useState(false);

  const handleCustomGridConfirm = (layout: string) => {
    onLayoutChange(layout);
  };

  const deleteView = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedViews(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-border bg-muted/30">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Toggle Camera List Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleCameraList}
          className="gap-2 h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Camera className="h-4 w-4 text-primary" />
          <span className="text-sm">{showCameraList ? "Hide" : "Show"} Camera List</span>
        </Button>
        
        {/* Saved Views Dropdown */}
        <DropdownMenu open={viewsDropdownOpen} onOpenChange={setViewsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 px-3 text-foreground hover:bg-accent">
              <span className="text-sm">{selectedView}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px] p-0 bg-popover border border-border shadow-lg z-50">
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search Views..." 
                  className="pl-9 h-9 bg-background"
                />
              </div>
            </div>
            {/* Views List */}
            <div className="py-1 max-h-[240px] overflow-y-auto">
              {savedViews.map((view) => (
                <div 
                  key={view.id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-accent transition-colors",
                    selectedView === view.name && "bg-accent"
                  )}
                  onClick={() => {
                    setSelectedView(view.name);
                    setViewsDropdownOpen(false);
                  }}
                >
                  <span className="text-sm text-foreground">{view.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => deleteView(view.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section - Grid Layout Buttons + Save View */}
      <div className="flex items-center gap-2">
        {/* Grid Layout Buttons */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", selectedLayout === "2x2" && "bg-accent")}
            onClick={() => onLayoutChange("2x2")}
          >
            <Grid2X2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", selectedLayout === "3x3" && "bg-accent")}
            onClick={() => onLayoutChange("3x3")}
          >
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", selectedLayout === "4x4" && "bg-accent")}
            onClick={() => onLayoutChange("4x4")}
          >
            <div className="grid grid-cols-4 gap-px w-4 h-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-current rounded-[1px]" />
              ))}
            </div>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", selectedLayout === "1+5" && "bg-accent")}
            onClick={() => onLayoutChange("1+5")}
          >
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </Button>
          {/* Custom Grid Builder Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
              onClick={() => setShowGridBuilder(true)}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Save View Button */}
        <Button className="gap-2 h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" />
          <span className="text-sm">Save View</span>
        </Button>
      </div>

      {/* Custom Grid Builder Modal */}
      <CustomGridBuilder
        open={showGridBuilder}
        onClose={() => setShowGridBuilder(false)}
        onConfirm={handleCustomGridConfirm}
      />
    </div>
  );
}
