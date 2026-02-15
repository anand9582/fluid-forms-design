import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
// import { RetentionPoliciesTable } from "@/components/settings/storage/RetentionPoliciesTable";
// import { AddStorageUnitPanel } from "@/components/settings/Storage/AddStorageUnitPanel";
// import { ManageStorageView } from "@/components/settings/storage/ManageStorageView";
// import { NewRetentionPolicyPanel } from "@/components/settings/storage/NewRetentionPolicyPanel";
import { StorageVolume } from "@/components/settings/Storage/StorageVolumes";
import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import { StorageTabs } from "@/components/settings/SidebarConfigs/StorageTabs"; 

import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HardDrive,
  Cloud,
  Trash2,
  Server,
  Camera,
  ShieldCheck,
  Activity,
  Plus,
  Pencil,
  ArrowRight,
  Zap,
  Clock,
  CircleDot,
  Key,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const overviewCards = [
  {
    icon: Server,
    label: "Total Storage",
    value: "78 TB",
    sub: "Capacity",
    detail: "43.3% used",
    detailColor: "text-primary",
  },
  {
    icon: Camera,
    label: "Active Cameras",
    value: "20",
    sub: "/ 24 Total",
    detail: "Recording live",
    detailColor: "text-muted-foreground",
  },
  {
    icon: ShieldCheck,
    label: "System Status",
    value: "Healthy",
    sub: "",
    detail: "All systems normal",
    detailColor: "text-muted-foreground",
  },
  {
    icon: Activity,
    label: "Storage Health",
    value: "94%",
    sub: "Score",
    detail: null,
    detailColor: "",
    hasBar: true,
    barValue: 94,
  },
];

interface StorageUnit {
  id: string;
  name: string;
  badge?: string;
  type: string;
  icon: typeof Server;
  devices: number;
  load: number;
  retention: string;
  retentionWarn: boolean;
  hardDiscs: number;
  used: number;
  total: number;
  category: "primary" | "secondary";
}

const storageUnits: StorageUnit[] = [
  {
    id: "nas-1",
    name: "Primary NAS Cluster",
    badge: "Default",
    type: "NAS Storage Unit",
    icon: Server,
    devices: 10,
    load: 58,
    retention: "8 Days remaining",
    retentionWarn: false,
    hardDiscs: 10,
    used: 14.5,
    total: 20,
    category: "primary",
  },
  {
    id: "hdd-1",
    name: "Local HDD Array 01",
    type: "HDD Storage Unit",
    icon: HardDrive,
    devices: 8,
    load: 46,
    retention: "1 Days remaining",
    retentionWarn: true,
    hardDiscs: 4,
    used: 12.7,
    total: 10,
    category: "primary",
  },
  {
    id: "cloud-1",
    name: "Cloud Archive Tier",
    type: "CLOUD Storage Unit",
    icon: Cloud,
    devices: 0,
    load: 0,
    retention: "0 Days remaining",
    retentionWarn: false,
    hardDiscs: 0,
    used: 0,
    total: 20,
    category: "primary",
  },
];

const tabTriggerClass = cn(
  "rounded-none border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-transparent",
  "data-[state=active]:border-primary data-[state=active]:text-primary",
  "data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
);

export default function StorageIndex() {
  const [activeTab, setActiveTab] = useState("storage-volumes");
  const [unitFilter, setUnitFilter] = useState<"primary" | "secondary">("primary");
  const [addStorageOpen, setAddStorageOpen] = useState(false);
  const [managingUnit, setManagingUnit] = useState<StorageUnit | null>(null);
  const [newRetentionOpen, setNewRetentionOpen] = useState(false);

  const filteredUnits = storageUnits.filter((u) => u.category === unitFilter);

  return (
      <SettingsTabs  onTabChange={setActiveTab}  defaultValue="Storagevloume" tabs={StorageTabs}>
                        <TabsContent value="Storagevloume" >
                            <StorageVolume />
                        </TabsContent>
                        <TabsContent value="RetentionPolicies" >
                            {/* <Recording /> */}
                        </TabsContent>
                        <TabsContent value="FailoverRedundancy" >
                          {/* <LiveViewTabs /> */}
                      </TabsContent>
          </SettingsTabs>
  );
}
