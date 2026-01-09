import { Radar, PlusCircle, Upload } from "lucide-react";

export const AddDeviceTabs = [
  {
    id: "discover",
    label: "Discover Devices",
    icon: <Radar size={16} />,
  },
  {
    id: "manual",
    label: "Manual Add",
    icon: <PlusCircle size={16} />,
  },
  {
    id: "bulk",
    label: "Bulk Upload",
    icon: <Upload size={16} />,
  },
];
