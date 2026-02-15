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
  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>({});

  // Build → Floor → Cameras
  const tree = useMemo(() => {
    const result: Record<string, Record<string, Device[]>> = {};

    devices.forEach((d) => {
      const building = d.groupName;
      const floor = "Floor 1 (Lobby)";

      if (!result[building]) result[building] = {};
      if (!result[building][floor]) result[building][floor] = [];

      result[building][floor].push(d);
    });

    return result;
  }, [devices]);

  return (
    <div className="ml-1 mt-2 space-y-1">
      {Object.entries(tree).map(([building, floors]) => {
        const isBuildingOpen = openBuildings[building] ?? true;

        return (
          <div key={building}>
            {/* Building */}
            <button
              onClick={() =>
                setOpenBuildings((p) => ({
                  ...p,
                  [building]: !isBuildingOpen,
                }))
              }
              className="flex items-center gap-2 px-2 py-1 w-full hover:bg-muted rounded-md"
            >
              {isBuildingOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="font-medium text-sm">
                {building}
              </span>
            </button>

            {isBuildingOpen &&
              Object.entries(floors).map(([floor, cameras]) => {
                const floorKey = `${building}-${floor}`;
                const isFloorOpen = openFloors[floorKey] ?? true;

                return (
                  <div key={floorKey} className="ml-4">
                    {/* Floor */}
                    <button
                      onClick={() =>
                        setOpenFloors((p) => ({
                          ...p,
                          [floorKey]: !isFloorOpen,
                        }))
                      }
                      className="flex items-center gap-2 px-2 py-1 w-full hover:bg-muted rounded-md"
                    >
                      {isFloorOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {floor}
                      </span>
                    </button>

                    {/* Cameras */}
                    {isFloorOpen && (
                      <div className="ml-5 space-y-1">
                        {cameras.map((camera) => (
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
      })}
    </div>
  );
}
