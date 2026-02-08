import { Camera, ChevronDown, ChevronRight, Video,Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CameraTreeData, CameraStatus } from "./CameraTreeTypes";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";

interface Props {
  isVisible: boolean;
  data: CameraTreeData;
  hook: ReturnType<typeof import("@/hooks/TreeSidebar").useCameraTree>;
  onCameraClick?: (camera: CameraStatus) => void;
}

export function CameraTreeSidebar({ isVisible, data, hook, onCameraClick = () => {} }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-primary";
      case "alert": return "bg-destructive";
      case "warning": return "bg-warning";
      default: return "bg-muted-foreground";
    }
  };

  const { expandedBuildings, expandedFloors, toggleBuilding, toggleFloor, searchTerm, setSearchTerm, filteredData } = hook;

  return (
   <div className={cn(
      "w-64 lg:w-64 border-r border-border bg-card flex-shrink-0 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent   mb-0 border rounded-sm",
      isVisible ? "max-w-72 lg:max-w-80" : "max-w-0 border-0"
    )}>
      
    {/* Header with Search */}
      <div className="p-3  border-border">
        <div className="flex items-center gap-2 mb-3">
          <Devices className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-foreground">Cameras</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cameras..." 
            className="pl-9 h-9"
          />
        </div>
      </div>

   


      {/* Camera Tree */}
    <div className="flex-1 overflow-y-auto p-3 pt-0">
       <div className="flex items-center gap-2 mb-2 py-1.5 px-2 rounded-md hover:bg-slate-100">
            <ChevronDown className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400 font-roboto">
              Property
            </span>

            <span className="text-sm font-medium text-slate-700">
             {filteredData.property}
            </span>

            {/* BLUE COUNT */}
            <span className="ml-auto inline-flex items-center justify-center rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
               {filteredData.totalCameras}
            </span>

            {/* RED ALERT */}
            <span className="inline-flex items-center justify-center rounded bg-red-100 px-1 py-0.5 text-xs font-semibold text-red-500 border border-red-200">
              {filteredData.alerts}
            </span>
          </div>
          
        {filteredData.buildings.map((building, idx) => (
          <div key={idx}>
            {/* Building */}
            <button
              onClick={() => toggleBuilding(building.name)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-slate-100 text-left"
            >
              {expandedBuildings.includes(building.name) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground"/>
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground"/>
              )}
              <span className="text-sm font-medium text-foreground font-roboto">{building.name}</span>
            </button>

            {expandedBuildings.includes(building.name) && (
              <div className="ml-4 space-y-1">
                {/* Floors */}
                {building.floors?.map((floor, fIdx) => (
                  <div key={fIdx}>
                    <button
                      onClick={() => toggleFloor(floor.name)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent text-left"
                    >
                      {expandedFloors.includes(floor.name) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground"/>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                      )}
                      <span className="text-sm font-medium text-foreground font-roboto">{floor.name}</span>
                    </button>

                    {/* Cameras */}
                    {expandedFloors.includes(floor.name) && (
                      <div className="ml-6 space-y-0.5">
                        {floor.cameras.map((camera, cIdx) => (
                          <div
                            key={cIdx}
                            onClick={() => onCameraClick(camera)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                          >
                            <Video className="h-4 w-4 text-primary"/>
                            <span className="text-sm  truncate flex-1 font-roboto font-medium text-gray-500">{camera.name}</span>
                            <span className={cn("h-2 w-2 rounded-full", getStatusColor(camera.status))}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Direct cameras */}
                {building.cameras?.map((camera, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => onCameraClick(camera)}
                    className="flex items-center gap-2 px-2 py-1.5 ml-4 rounded-md hover:bg-slate-100 cursor-pointer"
                  >
                    <Video className="h-4 w-4 text-primary"/>
                    <span className="text-sm  truncate flex-1 font-roboto  font-medium text-gray-500">{camera.name}</span>
                    <span className={cn("h-2 w-2 rounded-full", getStatusColor(camera.status))}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
