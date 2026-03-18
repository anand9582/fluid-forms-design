import { Server, HardDrive, Cloud } from "lucide-react";

export interface StorageUnit {
  id: string;
  name: string;
  type: string;
  icon: any;
  badge?: string;
  devices: number;
  load: number;
  retention: string;
  retentionWarn: boolean;
  hardDiscs: number;
  used: number;
  total: number;
  category: "primary" | "secondary";
  rawData?: any;
}

export const storageUnitsMock: StorageUnit[] = [
  // {
  //   id: "nas-1",
  //   name: "Primary NAS Cluster",
  //   type: "NAS Storage Unit",
  //   icon: Server,
  //   badge: "Default",  
  //   devices: 10,
  //   load: 58,
  //   retention: "8 Days remaining",
  //   retentionWarn: false,
  //   hardDiscs: 10,
  //   used: 14.5,
  //   total: 20,
  //   category: "primary",
  // },
  // {
  //   id: "hdd-1",
  //   name: "Local HDD Array 01",
  //   type: "HDD Storage Unit",
  //   icon: HardDrive,
  //   devices: 8,
  //   load: 46,
  //   retention: "1 Day remaining",
  //   retentionWarn: true,
  //   hardDiscs: 4,
  //   used: 12.7,
  //   total: 10,
  //   category: "primary",
  // },
  // {
  //   id: "cloud-1",
  //   name: "Cloud Archive Tier",
  //   type: "Cloud Storage Unit",
  //   icon: Cloud,
  //   devices: 0,
  //   load: 0,
  //   retention: "0 Days remaining",
  //   retentionWarn: false,
  //   hardDiscs: 0,
  //   used: 0,
  //   total: 20,
  //   category: "primary",
  // },
];
