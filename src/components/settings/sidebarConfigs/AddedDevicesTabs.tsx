import { Monitor, RefreshCw, Settings } from "lucide-react";
import type { ReactNode } from "react";
import {
  AutoIcons,
  AddSingleIcon,
  BatchIcon,
  ImportcsvIcon,
  ManagegroupIcon
} from "@/components/Icons/Svg/AutoDiscoveryIcons";

export interface AddedDevicesTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export const AddedDevicesTabs: AddedDevicesTab[] = [
  {
    id: "auto-discovery",
    label: "Auto Discovery",
    icon: <AutoIcons className="h-4 w-4" />,
  },
  {
    id: "add-single",
    label: "Add Single",
    icon: <AddSingleIcon className="h-4 w-4" />,
  },
  {
    id: "batch-add",
    label: "Batch Add",
    icon: <BatchIcon  className="h-4 w-4" />,
  },
   {
    id: "import-csv",
    label: "Import CSV",
    icon: <ImportcsvIcon  className="h-4 w-4" />,
  },
   {
    id: "manage-groups",
    label: "Manage Groups",
    icon: <ManagegroupIcon  className="h-4 w-4" />,
  },
];
