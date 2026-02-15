// SidebarCameraItem.tsx
import React from "react";

interface Camera {
  id: string;
  name: string;
  building: string;
  floor: string;
  // Add any other fields your API provides
}

interface SidebarCameraItemProps {
  camera: Camera;
  onSelect?: (camera: Camera) => void; // Optional callback if you want selection
}

const SidebarCameraItem: React.FC<SidebarCameraItemProps> = ({ camera, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(camera);
    }
  };

  return (
    <div
      className="sidebar-camera-item cursor-pointer p-2 hover:bg-gray-100 rounded"
      onClick={handleClick}
    >
      <div className="font-semibold">{camera.name}</div>
      <div className="text-sm text-gray-500">
          {camera.building} - {camera.floor}
      </div>
    </div>
  );
};

export default SidebarCameraItem;
