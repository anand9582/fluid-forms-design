import { Video } from "lucide-react";
import { useDrag } from "react-dnd";
import { Device } from "@/components/LiveView/DeviceTypes";

interface Props {
  camera: Device;
  onCameraClick: (cameraId: string) => void;
}

export function CameraTreeItem({ camera, onCameraClick }: Props) {
  const isOnline =
    camera.streams?.some((s) => s.status === "ONLINE") ?? false;

  // DRAG
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "SIDEBAR_CAMERA",
    item: { cameraId: camera.cameraId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    onCameraClick(camera.cameraId);
  };

  return (
    <div
      ref={dragRef}
      onDoubleClick={handleClick}
      className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer
        hover:bg-muted ${isDragging ? "opacity-50" : ""}`}
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
