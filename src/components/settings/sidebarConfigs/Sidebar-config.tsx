// sidebar-config.ts
import { HardDrive, BarChart3, Key } from "lucide-react";
import { ManageUsers, Devices, Apisdk } from "@/components/ui/icons";

export interface SidebarSubItem {
  id: string;
  label: string;
  route: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route?: string;
  subItems?: SidebarSubItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "manage-users",
    label: "Manage Users",
    icon: <ManageUsers size={18} />,
    route: "/settings/users",
  },
  {
    id: "manage-devices",
    label: "Manage Devices",
    icon: <Devices size={18} />,
    subItems: [
      {
        id: "add-devices",
        label: "Add Devices",
        route: "/settings/devices/add",
      },
      {
        id: "configure-devices",
        label: "Configure Devices",
        route: "/settings/devices/configure",
      },
    ],
  },
  {
    id: "storage",
    label: "Storage and Recording",
    icon: <HardDrive size={18} />,
    route: "/settings/storage",
  },
  // {
  //   id: "api-sdk",
  //   label: "API & SDK",
  //   icon: <Apisdk size={18} />,
  //   route: "/settings/api",
  // },
  // {
  //   id: "video-analytics",
  //   label: "Video Analytics",
  //   icon: <BarChart3 size={18} />,
  //   route: "/settings/analytics",
  // },
  // {
  //   id: "licensing",
  //   label: "Licensing",
  //   icon: <Key size={18} />,
  //   route: "/settings/licensing",
  // },
];
