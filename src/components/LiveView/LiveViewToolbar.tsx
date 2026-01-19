// Live View Toolbar Component
// Top toolbar with camera list toggle, saved views, grid layouts, and save button

import { useState } from "react";
import { 
  Camera, 
  ChevronDown, 
  Search, 
  Grid2X2, 
  Grid3X3, 
  Square, 
  Plus, 
  Save,
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { gridLayouts, savedViewsData } from "@/components/LiveView/data";
import type { SavedView } from "@/components/LiveView/types";

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

  const deleteView = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedViews(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-card">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Toggle Camera List Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleCameraList}
          className="gap-2 border-border"
        >
          <Camera className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{showCameraList ? "Hide" : "Show"} Camera List</span>
        </Button>
        
        {/* Saved Views Dropdown */}
        <DropdownMenu open={viewsDropdownOpen} onOpenChange={setViewsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[200px] justify-between border-border">
              <span className="truncate">{selectedView}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px] p-0">
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
  {/* Grid Layout Buttons */}
        <div className="hidden sm:flex items-center gap-0.5 p-1 bg-muted rounded-lg border border-border">
          <Button 
            variant={selectedLayout === "2x1" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onLayoutChange("2x1")}
          >
            <div className="flex gap-0.5">
              <div className="w-2 h-4 rounded-sm bg-current" />
              <div className="w-2 h-4 rounded-sm bg-current" />
            </div>
          </Button>
          <Button 
            variant={selectedLayout === "2x2" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onLayoutChange("2x2")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedLayout === "3x3" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onLayoutChange("3x3")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedLayout === "1x1" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onLayoutChange("1x1")}
          >
            <Square className="h-4 w-4" />
          </Button>
          {/* More Layouts Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {gridLayouts.slice(4).map((layout) => (
                <DropdownMenuItem 
                  key={layout.value}
                  onClick={() => onLayoutChange(layout.value)}
                  className={cn(selectedLayout === layout.value && "bg-accent")}
                >
                  {layout.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      {/* Right Section */}
      <div className="flex items-center gap-2">
      
        
        {/* Save View Button */}
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save View</span>
        </Button>
      </div>
    </div>
  );
}
