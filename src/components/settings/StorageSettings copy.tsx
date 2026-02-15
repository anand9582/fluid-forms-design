import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RetentionPoliciesTable } from "@/components/settings/storage/RetentionPoliciesTable";
import { AddStorageUnitPanel } from "@/components/settings/Storage/AddStorageUnitPanel";
import { ManageStorageView } from "@/components/settings/storage/ManageStorageView";
import { NewRetentionPolicyPanel } from "@/components/settings/storage/NewRetentionPolicyPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

export default function StorageSettings() {
  const [activeTab, setActiveTab] = useState("storage-volumes");
  const [unitFilter, setUnitFilter] = useState<"primary" | "secondary">("primary");
  const [addStorageOpen, setAddStorageOpen] = useState(false);
  const [managingUnit, setManagingUnit] = useState<StorageUnit | null>(null);
  const [newRetentionOpen, setNewRetentionOpen] = useState(false);

  const filteredUnits = storageUnits.filter((u) => u.category === unitFilter);

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in px-2 sm:px-0">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-0 sm:gap-2 px-0 h-auto pb-0 overflow-x-auto">
          <TabsTrigger value="storage-volumes" className={tabTriggerClass}>
            <Server className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
            Storage Volumes
          </TabsTrigger>
          <TabsTrigger value="retention-policies" className={tabTriggerClass}>
            <Key className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
            Retention Policies
          </TabsTrigger>
          <TabsTrigger value="failover" className={tabTriggerClass}>
            <Link2 className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
            Failover
          </TabsTrigger>
        </TabsList>

        {/* Storage Volumes Tab */}
        <TabsContent value="storage-volumes" className="mt-6 space-y-6">
          {managingUnit ? (
            <ManageStorageView
              unit={managingUnit}
              onBack={() => setManagingUnit(null)}
            />
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {overviewCards.map((card) => (
                  <div
                    key={card.label}
                    className="border border-border rounded-xl p-4 sm:p-5 bg-card flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <card.icon className="h-4 w-4" />
                      {card.label}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-foreground">{card.value}</span>
                      {card.sub && (
                        <span className="text-xs sm:text-sm text-muted-foreground">{card.sub}</span>
                      )}
                    </div>
                    {card.detail && (
                      <span className={cn("text-xs", card.detailColor)}>{card.detail}</span>
                    )}
                    {card.hasBar && (
                      <Progress value={card.barValue} className="h-2 mt-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Connected Storage Units Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Connected Storage Units</h3>
                  <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {storageUnits.length} Devices Total
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setUnitFilter("primary")}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                        unitFilter === "primary"
                          ? "bg-foreground text-background"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Primary
                    </button>
                    <button
                      onClick={() => setUnitFilter("secondary")}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                        unitFilter === "secondary"
                          ? "bg-foreground text-background"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Secondary
                    </button>
                  </div>
                  <Button size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm" onClick={() => setAddStorageOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add storage unit</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>

              {/* Storage Unit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUnits.map((unit) => {
                  const usagePercent = unit.total > 0 ? Math.round((unit.used / unit.total) * 100) : 0;
                  const Icon = unit.icon;
                  const barColor =
                    usagePercent > 90
                      ? "bg-destructive"
                      : usagePercent > 70
                      ? "bg-yellow-500"
                      : "bg-primary";

                  return (
                    <div
                      key={unit.id}
                      className="border border-border rounded-xl bg-card p-4 sm:p-5 flex flex-col gap-4"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-xs sm:text-sm">{unit.name}</span>
                              {unit.badge && (
                                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                  {unit.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{unit.type}</p>
                          </div>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground p-1">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Zap className="h-3.5 w-3.5" />
                          <span>Devices</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Activity className="h-3.5 w-3.5" />
                          <span>Load</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{unit.devices} Connected</span>
                        <span className="text-sm font-semibold text-foreground">{unit.load} Mbps</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Estimated Retention</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CircleDot className="h-3.5 w-3.5" />
                          <span>Hard Discs</span>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            unit.retentionWarn ? "text-yellow-500" : "text-foreground"
                          )}
                        >
                          {unit.retention}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{unit.hardDiscs} Connected</span>
                      </div>

                      {/* Usage Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>Used: {unit.used.toFixed(2)} TB</span>
                          <span>Total: {unit.total} TB</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", barColor)}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-2 pt-1 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-xs"
                          onClick={() => setManagingUnit(unit)}
                        >
                          Manage and Map Devices
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        {/* Retention Policies Tab */}
        <TabsContent value="retention-policies" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Data Retention Policies</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Configure how long video data is stored before deletion or archiving.</p>
            </div>
            <Button size="sm" className="gap-2 self-start sm:self-auto" onClick={() => setNewRetentionOpen(true)}>
              <Plus className="h-4 w-4" />
              New Retention Policy
            </Button>
          </div>
          <RetentionPoliciesTable />
        </TabsContent>

        {/* Failover Tab */}
        <TabsContent value="failover" className="mt-6 space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Failover & Redundancy Configuration</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Configure high-availability settings to prevent data loss during hardware failures.</p>
          </div>

          {/* Failover Recording Server Card */}
          <div className="border border-border rounded-xl bg-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Failover Recording Server</h3>
                  <p className="text-xs text-primary mt-1 max-w-lg">
                    Automatically redirects camera streams to a standby server if the primary server is unreachable for more than 30 seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-muted-foreground">Enabled</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Target Failover Server</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select defaultValue="fs-01">
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fs-01">FS-01(Standby - US West)</SelectItem>
                    <SelectItem value="fs-02">FS-02(Standby - US East)</SelectItem>
                    <SelectItem value="fs-03">FS-03(Standby - EU)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 border border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/30 px-3 py-1.5 rounded-lg">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Target online
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddStorageUnitPanel open={addStorageOpen} onOpenChange={setAddStorageOpen} />
      <NewRetentionPolicyPanel open={newRetentionOpen} onOpenChange={setNewRetentionOpen} />
    </div>
  );
}
