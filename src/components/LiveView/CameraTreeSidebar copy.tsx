import { useState, useEffect } from "react";
import { Video, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { APISERVERURL, API_URLS } from "@/components/Config/api";

interface Stream {
  streamType: string;
  status: string;
  restreamUrls: string[];
  path: string;
  metadata?: any;
}

export interface Device {
  cameraId: number;
  cameraName: string;
  buildingName: string;
  floorName: string;
  streams?: Stream[];
  status?: string;
}

interface Props {
  isVisible: boolean;
onCameraClick?: (cameraId: string) => void;
}

/* -------------------------------------------------------------
   Sub-component: single camera item
--------------------------------------------------------------*/
function CameraTreeItem({
  camera,
  onCameraClick,
}: {
  camera: Device;
onCameraClick: (cameraId: string) => void;
}) {
  const [, dragRef] = useDrag({
    type: "SIDEBAR_CAMERA",
    item: { type: "SIDEBAR_CAMERA", camera },
  });

  return (
    <div
      ref={dragRef}
      onDoubleClick={() => onCameraClick(camera.cameraId.toString())}
      className="flex items-center gap-2 px-2 py-1.5 ml-6 rounded-md hover:bg-slate-100 cursor-pointer"
    >
      <Video className="w-4 h-4 text-primary" />
      <span className="text-sm truncate flex-1">{camera.cameraName}</span>
    </div>
  );
}

/* -------------------------------------------------------------
   Main CameraTreeSidebar component
--------------------------------------------------------------*/
export function CameraTreeSidebar({
  isVisible,
  onCameraClick = () => {},
}: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch devices from API
  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${APISERVERURL}${API_URLS.get_all_devices}`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setDevices(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Group devices by building -> floor
  const buildings = Array.from(
    devices.reduce((bAcc, device) => {
      const building = device.buildingName || "Unknown Building";
      const floor = device.floorName || "Unknown Floor";

      if (!bAcc.has(building)) bAcc.set(building, new Map());
      const floors = bAcc.get(building)!;

      if (!floors.has(floor)) floors.set(floor, []);
      floors.get(floor)!.push(device);

      return bAcc;
      }, new Map<string, Map<string, Device[]>>())
    ).map(([buildingName, floorsMap]) => ({
      name: buildingName,
      floors: Array.from(floorsMap.entries()).map(([floorName, cams]) => ({
        name: floorName,
        cameras: cams,
      })),
    }));

  return (
    <div
      className={cn(
        "w-64 lg:w-64 border-r border-border bg-card flex-shrink-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent transition-all duration-300",
        isVisible ? "max-w-72 lg:max-w-80" : "max-w-0 border-0"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-border">
        <span className="font-semibold text-foreground">Cameras</span>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cameras..." className="pl-9 h-9" />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-3 text-sm text-muted-foreground">Loading...</div>
      )}

      {/* Camera Tree */}
      <div className="flex-1 overflow-y-auto p-3 pt-0">
        {buildings.map((building, bIdx) => (
          <div key={bIdx}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md font-medium">
              <span className="text-sm">{building.name}</span>
            </div>

            {building.floors?.map((floor, fIdx) => (
              <div key={fIdx} className="ml-4">
                <div className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <span className="text-sm">{floor.name}</span>
                </div>

                {floor.cameras.map((camera) => (
                  <CameraTreeItem
                    key={camera.cameraId}
                    camera={camera}
                    onCameraClick={onCameraClick}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { Video, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useDrag } from "react-dnd";
// import { cn } from "@/lib/utils";

// // Stream & Device Types
// interface Stream {
//   streamType: string;
//   status: string;
//   restreamUrls: string[];
//   path: string;
//   metadata?: any;
// }

// export interface Device {
//   cameraId: number;
//   cameraName: string;
//   buildingName: string;
//   floorName: string;
//   streams?: Stream[];
//   status?: string;
// }

// // Props
// interface Props {
//   isVisible: boolean;
//   onCameraClick?: (cameraId: string) => void;
// }

// /* -------------------------------------------------------------
//    Sub-component: single camera item
// --------------------------------------------------------------*/
// function CameraTreeItem({
//   camera,
//   onCameraClick,
// }: {
//   camera: Device;
//   onCameraClick: (cameraId: string) => void;
// }) {
//   const [, dragRef] = useDrag({
//     type: "SIDEBAR_CAMERA",
//     item: { type: "SIDEBAR_CAMERA", camera },
//   });

//   return (
//     <div
//       ref={dragRef}
//       onDoubleClick={() => onCameraClick(camera.cameraId.toString())}
//       className="flex items-center gap-2 px-2 py-1.5 ml-6 rounded-md hover:bg-slate-100 cursor-pointer"
//     >
//       <Video className="w-4 h-4 text-primary" />
//       <span className="text-sm truncate flex-1">{camera.cameraName}</span>
//     </div>
//   );
// }

// /* -------------------------------------------------------------
//    Main CameraTreeSidebar component with dummy data
// --------------------------------------------------------------*/
// export function CameraTreeSidebar({
//   isVisible,
//   onCameraClick = () => {},
// }: Props) {
//   const [devices, setDevices] = useState<Device[]>([]);

//   // Dummy data for testing
//   useEffect(() => {
//     const dummyDevices: Device[] = [
//       { cameraId: 1, cameraName: "Lobby Cam", buildingName: "Building A", floorName: "Ground Floor" },
//       { cameraId: 2, cameraName: "Entrance Cam", buildingName: "Building A", floorName: "Ground Floor" },
//       { cameraId: 3, cameraName: "Parking Cam", buildingName: "Building A", floorName: "Basement" },
//       { cameraId: 4, cameraName: "Office Cam", buildingName: "Building B", floorName: "1st Floor" },
//       { cameraId: 5, cameraName: "Hallway Cam", buildingName: "Building B", floorName: "1st Floor" },
//       { cameraId: 6, cameraName: "Server Room Cam", buildingName: "Building B", floorName: "Basement" },
//     ];
//     setDevices(dummyDevices);
//   }, []);

//   // Group devices by building -> floor
//   const buildings = Array.from(
//     devices.reduce((bAcc, device) => {
//       const building = device.buildingName || "Unknown Building";
//       const floor = device.floorName || "Unknown Floor";

//       if (!bAcc.has(building)) bAcc.set(building, new Map());
//       const floors = bAcc.get(building)!;

//       if (!floors.has(floor)) floors.set(floor, []);
//       floors.get(floor)!.push(device);

//       return bAcc;
//     }, new Map<string, Map<string, Device[]>>())
//   ).map(([buildingName, floorsMap]) => ({
//     name: buildingName,
//     floors: Array.from(floorsMap.entries()).map(([floorName, cams]) => ({
//       name: floorName,
//       cameras: cams,
//     })),
//   }));

//   return (
//     <div
//       className={cn(
//         "w-64 lg:w-64 border-r border-border bg-card flex-shrink-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent transition-all duration-300",
//         isVisible ? "max-w-72 lg:max-w-80" : "max-w-0 border-0"
//       )}
//     >
//       {/* Header */}
//       <div className="p-3 border-b border-border">
//         <span className="font-semibold text-foreground">Cameras</span>
//         <div className="relative mt-2">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search cameras..." className="pl-9 h-9" />
//         </div>
//       </div>

//       {/* Camera Tree */}
//       <div className="flex-1 overflow-y-auto p-3 pt-0">
//         {buildings.map((building, bIdx) => (
//           <div key={bIdx}>
//             <div className="flex items-center gap-2 px-2 py-1.5 rounded-md font-medium">
//               <span className="text-sm">{building.name}</span>
//             </div>

//             {building.floors?.map((floor, fIdx) => (
//               <div key={fIdx} className="ml-4">
//                 <div className="flex items-center gap-2 px-2 py-1 rounded-md">
//                   <span className="text-sm">{floor.name}</span>
//                 </div>

//                 {floor.cameras.map((camera) => (
//                   <CameraTreeItem
//                     key={camera.cameraId}
//                     camera={camera}
//                     onCameraClick={onCameraClick}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
