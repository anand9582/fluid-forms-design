// src/components/ui/CameraTree.tsx

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Device } from "@/components/LiveView/DeviceTypes";
import { CameraTreeItem } from "@/components/LiveView/CameraTreeItem";

interface Props {
  devices: Device[];
  onCameraClick?: (cameraId: string) => void;
}

export function CameraTree({ devices, onCameraClick = () => {} }: Props) {
  const [openBuildings, setOpenBuildings] = useState<Record<string, boolean>>(
    {}
  );

  // Build tree by groupName
  const tree = useMemo(() => {
    const result: Record<
      string,
      { cameras: Device[]; total: number; offline: number }
    > = {};

    devices.forEach((d) => {
      const building = d.groupName || "Unknown";

      if (!result[building]) {
        result[building] = {
          cameras: [],
          total: 0,
          offline: 0,
        };
      }

      result[building].cameras.push(d);
      result[building].total++;

      const isOnline = d.streams?.some((s) => s.status === "ONLINE");

      if (!isOnline) {
        result[building].offline++;
      }
    });

    return result;
  }, [devices]);

  return (
    <div className="ml-1 mt-2 space-y-1">
      {Object.entries(tree).map(([building, data]) => {
        const isBuildingOpen = openBuildings[building] ?? true;

        return (
          <div key={building}>
            <button
              onClick={() =>
                setOpenBuildings((prev) => ({
                  ...prev,
                  [building]: !isBuildingOpen,
                }))
              }
              className={`flex items-center justify-between w-full px-2 py-1 rounded-md
              hover:bg-muted ${isBuildingOpen ? "bg-muted" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isBuildingOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}

                <span className="font-roboto capitalize font-semibold text-sm truncate max-w-[150px]">
                   {building}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                  {data.total}
                </span>

                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                  {data.offline}
                </span>
              </div>
            </button>

            {isBuildingOpen && (
              <div className="ml-4 mt-2 pl-3 border-l border-slate-200 space-y-1">
                {data.cameras.map((camera) => (
                  <CameraTreeItem
                    key={camera.cameraId}
                    camera={camera}
                    onCameraClick={onCameraClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}