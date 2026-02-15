// src/components/ui/CameraTreeItem.tsx

import { Video } from "lucide-react";
import { Device } from "@/components/LiveView/DeviceTypes";

interface Props {
  camera: Device;
  onCameraClick?: (cameraId: string) => void;
}

export function CameraTreeItem({
  camera,
  onCameraClick = () => {},
}: Props) {
  const isOnline =
    camera.streams?.some((s) => s.status === "ONLINE") ?? false;

  return (
    <div
      onClick={() => onCameraClick(camera.cameraId)}
      className="flex items-center justify-between px-2 py-1 rounded-md cursor-pointer hover:bg-muted"
    >
      <div className="flex items-center gap-2">
        <Video size={16} className="text-blue-600" />
        <span className="text-sm">{camera.name}</span>
      </div>

      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </div>
  );
}
