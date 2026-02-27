import { useEffect, useState, useCallback, ChangeEvent, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CameraTree } from "@/components/ui/CameraTree";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import {
  Devices,
} from "@/components/Icons/Svg/liveViewIcons";
interface Props {
  isVisible: boolean;
  onCameraClick?: (cameraId: string) => void;
}

export function CameraTreeSidebar({
  isVisible,
  onCameraClick = () => {},
}: Props) {
  const { cameras, fetchCameras } = SidebarCameraStore();
  const [search, setSearch] = useState("");
  const [openProperty, setOpenProperty] = useState(true);


useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

const filtered = useMemo(() => {
  return cameras.filter((d) =>
    (d?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );
}, [cameras, search]);

  const offlineCount = filtered.filter(
    (d) => !d.streams?.some((s) => s.status === "ONLINE")
  ).length;

  return (
    <aside
      className={cn(
        "w-72 bg-white border rounded-xl p-3 flex flex-col h-full",
        !isVisible && "hidden"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-lg mb-3">
        <Devices size={18} />
        Cameras
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cameras..."
          className="pl-9"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* PROPERTY */}
      <div>
        <button
          onClick={() => setOpenProperty(!openProperty)}
          className="flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-muted"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {openProperty ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400 font-roboto">
              Property
            </span>
            <span>Grand Hotel</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
              {filtered.length}
            </span>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
              {offlineCount}
            </span>
          </div>
        </button>

        {/* Tree */}
        {openProperty && (
          <CameraTree
            devices={filtered}
            onCameraClick={onCameraClick}
          />
        )}
      </div>
    </aside>
  );
}

// // dummy api use 
// import { useEffect, useState, useMemo, ChangeEvent } from "react";
// import { Search, ChevronDown, ChevronRight } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { CameraTree } from "@/components/ui/CameraTree";
// import { Devices } from "@/components/Icons/Svg/liveViewIcons";

// interface Camera {
//   cameraId: string;
//   name: string;
//   streams?: { id: string; status: "ONLINE" | "OFFLINE" }[];
// }

// interface Props {
//   isVisible: boolean;
//   onCameraClick?: (cameraId: string) => void;
// }

// // -----------------------
// // Dummy camera data
// // -----------------------
// const dummyCameras: Camera[] = [
//   { cameraId: "6", name: "Lobby Camera", streams: [{ id: "s1", status: "ONLINE" }] },
//   { cameraId: "6", name: "Entrance Camera", streams: [{ id: "s1", status: "OFFLINE" }] },
//   { cameraId: "6", name: "Parking Lot Camera", streams: [{ id: "s1", status: "ONLINE" }] },
//   { cameraId: "4", name: "Elevator Camera", streams: [{ id: "s1", status: "OFFLINE" }] },
//   { cameraId: "5", name: "Pool Area Camera", streams: [{ id: "s1", status: "ONLINE" }] },
// ];

// export function CameraTreeSidebar({
//   isVisible,
//   onCameraClick = () => {},
// }: Props) {
//   const [cameras, setCameras] = useState<Camera[]>([]);
//   const [search, setSearch] = useState("");
//   const [openProperty, setOpenProperty] = useState(true);

//   // -----------------------
//   // Load dummy cameras
//   // -----------------------
//   useEffect(() => {
//     // Simulate API fetch
//     setCameras(dummyCameras);
//   }, []);

//   // -----------------------
//   // Filtered cameras
//   // -----------------------
//   const filtered = useMemo(() => {
//     return cameras.filter((d) =>
//       d.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [cameras, search]);

//   // Count offline cameras
//   const offlineCount = filtered.filter(
//     (d) => !d.streams?.some((s) => s.status === "ONLINE")
//   ).length;

//   return (
//     <aside
//       className={cn(
//         "w-72 bg-white border rounded-xl p-3 flex flex-col h-full",
//         !isVisible && "hidden"
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center gap-2 font-semibold text-lg mb-3">
//         <Devices size={18} />
//         Cameras
//       </div>

//       {/* Search */}
//       <div className="relative mb-3">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search cameras..."
//           className="pl-9"
//           value={search}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setSearch(e.target.value)
//           }
//         />
//       </div>

//       {/* PROPERTY */}
//       <div>
//         <button
//           onClick={() => setOpenProperty(!openProperty)}
//           className="flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-muted"
//         >
//           <div className="flex items-center gap-2 text-sm font-medium">
//             {openProperty ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             <span className="text-xs font-medium uppercase tracking-wide text-slate-400 font-roboto">
//               Property
//             </span>
//             <span>Grand Hotel</span>
//           </div>

//           {/* Badges */}
//           <div className="flex gap-2">
//             <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
//               {filtered.length}
//             </span>
//             <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
//               {offlineCount}
//             </span>
//           </div>
//         </button>

//         {/* Camera Tree */}
//         {openProperty && (
//           <CameraTree
//             devices={filtered}
//             onCameraClick={(cameraId) => onCameraClick(cameraId)}
//           />
//         )}
//       </div>
//     </aside>
//   );
// }

