import { Monitor, RefreshCw, Settings } from "lucide-react";
import type { ReactNode } from "react";
import {
  ScanIcon,
  DeviceIcon,
  NetworkIcon,
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
    icon: <ScanIcon className="h-4 w-4" />,
  },
  {
    id: "groups",
    label: "Groups",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
