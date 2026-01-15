// tabConfigs/configureDeviceTabs.tsx
import { Monitor, RefreshCw } from "lucide-react";

export const configureDeviceTabs = [
  {
    id: "network",
    label: "Network Settings",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: "recording",
    label: "Recording",
    icon: <RefreshCw className="h-4 w-4" />,
  },
];
