// Camera Tree Sidebar Component
// Displays hierarchical camera list with search and expand/collapse functionality

import { useState } from "react";
import { Camera, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cameraTreeData } from "@/components/LiveView/Data";

interface CameraTreeSidebarProps {
  isVisible: boolean;
}

export function CameraTreeSidebar({ isVisible }: CameraTreeSidebarProps) {
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([
    "Building A (Guest)", 
    "Building B (Amenities)", 
    "Parking Garage"
  ]);
  const [expandedFloors, setExpandedFloors] = useState<string[]>([
    "Floor 1 (Lobby)", 
    "Rooftop Pool"
  ]);

  const toggleBuilding = (building: string) => {
    setExpandedBuildings(prev => 
      prev.includes(building) 
        ? prev.filter(b => b !== building)
        : [...prev, building]
    );
  };

  const toggleFloor = (floor: string) => {
    setExpandedFloors(prev => 
      prev.includes(floor) 
        ? prev.filter(f => f !== floor)
        : [...prev, floor]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-primary";
      case "alert": return "bg-destructive";
      case "warning": return "bg-warning";
      default: return "bg-muted-foreground";
    }
  };

  return (
    <div className={cn(
      "w-72 lg:w-80 border-r border-border bg-card flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden",
      isVisible ? "max-w-72 lg:max-w-80" : "max-w-0 border-0"
    )}>
      {/* Header with Search */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Cameras</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cameras..." 
            className="pl-9 h-9 bg-background"
          />
        </div>
      </div>

      {/* Camera Tree */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Property Header */}
        <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-md hover:bg-accent">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase">Property</span>
          <span className="font-medium text-foreground">{cameraTreeData.property}</span>
          <Badge variant="secondary" className="ml-auto text-xs">{cameraTreeData.totalCameras}</Badge>
          <Badge variant="destructive" className="text-xs">{cameraTreeData.alerts}</Badge>
        </div>

        {/* Buildings Tree */}
        <div className="space-y-1 ml-2">
          {cameraTreeData.buildings.map((building, idx) => (
            <div key={idx}>
              {/* Building Level */}
              <button
                onClick={() => toggleBuilding(building.name)}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent text-left"
              >
                {expandedBuildings.includes(building.name) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">{building.name}</span>
              </button>
              
              {expandedBuildings.includes(building.name) && (
                <div className="ml-4 space-y-1">
                  {/* Floor Level */}
                  {building.floors?.map((floor, fIdx) => (
                    <div key={fIdx}>
                      <button
                        onClick={() => toggleFloor(floor.name)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent text-left"
                      >
                        {expandedFloors.includes(floor.name) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">{floor.name}</span>
                      </button>
                      
                      {/* Camera Level */}
                      {expandedFloors.includes(floor.name) && (
                        <div className="ml-6 space-y-0.5">
                          {floor.cameras.map((camera, cIdx) => (
                            <div 
                              key={cIdx}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                            >
                              <Camera className="h-4 w-4 text-primary" />
                              <span className="text-sm text-foreground truncate flex-1">{camera.name}</span>
                              <span className={cn("h-2 w-2 rounded-full", getStatusColor(camera.status))} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Direct cameras under building (no floor) */}
                  {building.cameras?.map((camera, cIdx) => (
                    <div 
                      key={cIdx}
                      className="flex items-center gap-2 px-2 py-1.5 ml-4 rounded-md hover:bg-accent cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground truncate flex-1">{camera.name}</span>
                      <span className={cn("h-2 w-2 rounded-full", getStatusColor(camera.status))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
