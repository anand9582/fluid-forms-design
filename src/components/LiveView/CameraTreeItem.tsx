import { useEffect } from "react";
import { Video } from "lucide-react";
import { useDrag } from "react-dnd";
import { Device } from "@/components/LiveView/DeviceTypes";
import { getEmptyImage } from "react-dnd-html5-backend";
import { AppTooltip } from "@/components/ui/AppTooltip";
interface Props {
  camera: Device;
  onCameraClick: (cameraId: string) => void;
}

export function CameraTreeItem({ camera, onCameraClick }: Props) {
  const isOnline =
    camera.streams?.some((s) => s.status === "ONLINE") ?? false;

  const [{ isDragging }, dragRef, preview] = useDrag(() => ({
    type: "SIDEBAR_CAMERA",

    item: {
      cameraId: camera.cameraId,
      cameraName: camera.name,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

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
        <AppTooltip label={camera.name}>
          <span className="text-[12px] font-roboto font-medium truncate max-w-[160px]">
            {camera.name}
          </span>
        </AppTooltip>
      </div>

      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </div>
  );
}