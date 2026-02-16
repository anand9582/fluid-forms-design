import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Server,
  HardDrive,
  Cloud,
  Wifi,
  Eye,
  EyeOff,
  FolderOpen,
  Database,
  Globe 
} from "lucide-react";
import { cn } from "@/lib/utils";

const storageTypes = [
  { id: "local-nas", label: "Local NAS", icon: Server },
  { id: "fixed", label: "Fixed", icon: Database  },
  { id: "cloud", label: "Cloud", icon: Cloud },
];

export function AddNewStorage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState("drive-d");

  return (
    <Tabs defaultValue="local-nas" className="w-full">
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-x-6 gap-y-6">
          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-5 space-y-5">
              <div className="space-y-5">
            {/* Storage Type */}
            <div className="space-y-2">
              <Label className="font-roboto font-medium">Storage type</Label>
              <TabsList className="items-center justify-center rounded-md gap-3 text-muted-foreground grid grid-cols-3 w-full h-auto  bg-white">
                  {storageTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <TabsTrigger
                            key={type.id}
                            value={type.id}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-md border py-5 transition-all",
                              "text-black",
                              "data-[state=active]:border-primary",
                              "data-[state=active]:bg-white",
                              "data-[state=active]:text-primary"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 transition-colors",
                                "data-[state=active]:text-primary"
                              )}
                                strokeWidth={1.25}
                            />

                            <span className="text-xs font-roboto font-medium">
                              {type.label}
                            </span>
                          </TabsTrigger>
                    );
                  })}
              </TabsList>
            </div>

            {/* Storage Name */}
            <div className="space-y-2 mt-11">
              <div className="flex justify-between items-center">
                <Label className="font-roboto font-medium">Storage name</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-roboto font-medium">
                    Set as Default
                  </span>
                  <Switch checked={isDefault} onCheckedChange={setIsDefault} />
                </div>
              </div>
              <Input className="text-muted-foreground" placeholder="e.g. Building A - Main Archive" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="font-roboto font-medium">Description <span className="text-muted-foreground">(Optional)</span></Label>
              <Textarea className="bg-white" rows={4} />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label className="font-roboto font-medium">Max Capacity (GB)</Label>
              <Input  type="number" defaultValue="10000" />
              <p className="font-roboto font-medium text-xs text-muted-foreground">
                Approx 9.8 TB usable space
              </p>
            </div>
              </div>
          </div>
          {/* RIGHT COLUMN (Tabs Content) */}
         <div className="col-span-12 lg:col-span-7">
              <TabsContent value="local-nas" className="space-y-5 mt-0">
                <div className="space-y-2">
                  <Label className="font-roboto font-medium text-sm">Network Path</Label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" defaultValue="/" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <Label className="font-roboto font-medium text-sm">IP Address</Label>
                      <Input defaultValue="192.168.1.100" />
                  </div>
                  <div className="space-y-1">
                    <Label  className="font-roboto font-medium text-sm">Protocol</Label>
                    <Select defaultValue="smb">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smb">SMB(windows Share)</SelectItem>
                        <SelectItem value="nfs">NFS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="font-roboto text-sm font-medium text-foreground">Username</Label>
                    <Input defaultValue="Admin" />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-roboto text-sm font-medium text-foreground">Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
               </div>

               <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-roboto   font-medium text-foreground">
                    <Wifi className="h-4 w-4" />
                    Connectivity Test
                  </div>
                  <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                    Run Test
                  </Button>
                </div>
                <div className="rounded-md bg-slate-200 border h-[81px] flex items-center justify-center text-center">
                    <p className="text-sm text-slate-600">Configure settings and run a test to verify connection.</p>
                </div>
              </div>
              </TabsContent>

              {/* FIXED */}
              <TabsContent value="fixed" className="space-y-3">
                <Label>Available Drives</Label>

                {[
                  {
                    id: "drive-d",
                    name: "Drive D : Data Partition",
                    info: "1.8 TB available of 2.0 TB",
                  },
                  {
                    id: "drive-e",
                    name: "Drive E :  Archive Drive",
                    info: "3.9 TB available of 4.0 TB",
                  },
                   {
                    id: "drive-f",
                    name: "Drive F :  External SSD",
                    info: "240 GB available of 1.0 TB",
                  },
                ].map((drive) => (
                <button
                  key={drive.id}
                  onClick={() => setSelectedDrive(drive.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left",
                    selectedDrive === drive.id
                      ? "border-blue-400"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-sm shrink-0",
                      selectedDrive === drive.id
                        ? "bg-primary/5 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                     <HardDrive className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm  font-roboto font-medium text-foreground">
                      {drive.name}
                    </p>
                    <p className="text-xs font-roboto  font-normal  text-neutral-500">
                      {drive.info}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border shrink-0 flex items-center justify-center",
                      selectedDrive === drive.id
                        ? "border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedDrive === drive.id && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>

                ))}
              </TabsContent>

              <TabsContent value="cloud" className="space-y-5">
                  <div className="space-y-5">
                {/* Provider + Region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-roboto font-medium text-foreground">Provider</Label>
                    <Select defaultValue="aws">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">AWS</SelectItem>
                        <SelectItem value="azure">Azure</SelectItem>
                        <SelectItem value="gcs">GCS</SelectItem>
                        <SelectItem value="minio">MinIO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-roboto font-medium text-foreground">Region</Label>
                    <Input defaultValue="us-east-1" />
                  </div>
              </div>

              {/* Bucket Name */}
              <div className="space-y-2">
                <Label className="text-sm font-roboto font-medium text-foreground">Bucket Name</Label>
                <div className="relative">
                  <Globe  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" defaultValue="VMS-recordings-archive-01" />
                </div>
              </div>

              {/* Access Key ID */}
              <div className="space-y-2">
                <Label className="text-sm font-roboto ont-medium text-foreground">Access Key ID</Label>
                <Input defaultValue="Admin" />
              </div>

              {/* Secret Access Key */}
              <div className="space-y-2">
                <Label className="text-sm font-roboto font-medium text-foreground">Secret Access Key</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Connectivity Test */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-roboto font-medium text-foreground">
                    <Wifi className="h-4 w-4" />
                    Connectivity Test
                  </div>
                  <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                    Run Test
                  </Button>
                </div>
                 <div className="rounded-md bg-slate-200 border h-[81px] flex items-center justify-center text-center">
                    <p className="text-sm text-slate-600">Configure settings and run a test to verify connection.</p>
                </div>
              </div>
            </div>
              </TabsContent>
          </div>
      </div>
    </Tabs>
  );
}
