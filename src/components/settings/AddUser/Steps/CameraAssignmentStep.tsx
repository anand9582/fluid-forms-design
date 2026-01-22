import { DeviceTreeSelect, DeviceNode } from "@/components/ui/device-tree-select";
import { useState, useMemo } from "react";


const mockDeviceData: DeviceNode[] = [
  {
    id: "hq",
    name: "Headquarters HQ",
    type: "group",
    deviceCount: 8,
    children: [
      {
        id: "hq-sub",
        name: "Headquarters HQ",
        type: "group",
        children: [
          { id: "cam-1", name: "Main entrance cam 1", type: "device", status: "online" },
          { id: "cam-2", name: "Reception Desk Cam 2", type: "device", status: "online" },
          { id: "cam-3", name: "Main entrance cam 3", type: "device", status: "offline" },
          { id: "cam-4", name: "Main entrance cam 4", type: "device", status: "online" },
        ],
      },
      {
        id: "hq2",
        name: "Headquarters HQ 2",
        type: "group",
        children: [
          { id: "cam-5", name: "Main entrance cam 5", type: "device", status: "offline" },
          { id: "cam-6", name: "Reception Desk Cam 6", type: "device", status: "online" },
        ],
      },
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse 1",
    type: "group",
    deviceCount: 12,
    children: [
      { id: "wh-cam-1", name: "Warehouse Cam 1", type: "device", status: "online" },
      { id: "wh-cam-2", name: "Warehouse Cam 2", type: "device", status: "online" },
    ],
  },
];

export function CameraAssignmentStep() {
 const initialFormData = {
  name: "",
  ipAddress: "",
  port: "",
  make: "",
  model: "",
  type: "",
  username: "",
  password: "",
  group: "",
  rtspPort: "",
  httpPort: "",
  protocol: "",

  selectedCameras: [] as string[], 
};

type FormErrors = Partial<Record<keyof typeof initialFormData, string>>;

    const [formData, setFormData] = useState(initialFormData);
const handleInputChange = <K extends keyof typeof initialFormData>(
  key: K,
  value: (typeof initialFormData)[K]
) => {
  setFormData((prev) => ({
    ...prev,
    [key]: value,
  }));
};

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Network ss</h2>
       <DeviceTreeSelect
            data={mockDeviceData}
            selectedIds={formData.selectedCameras}
            onSelectionChange={(ids) => handleInputChange("selectedCameras", ids)}
            searchPlaceholder="Search cameras, buildings or areas..."
            selectionLabel="Cameras Assigned"
          />  

    </div>
  );
}
