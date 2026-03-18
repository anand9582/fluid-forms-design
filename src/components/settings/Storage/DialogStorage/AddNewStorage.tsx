import { useState, useEffect, useCallback } from "react";
import { API_MANISH_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { toast } from "sonner";
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
  { id: "fixed", label: "Fixed", icon: Database },
  { id: "local-nas", label: "NAS", icon: Server },
  // { id: "cloud", label: "Cloud", icon: Cloud },
];

export function AddNewStorage({ onClose, role = "PRIMARY", editData }: { onClose?: () => void, role?: string, editData?: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [drives, setDrives] = useState<any[]>([]);
  const [isLoadingDrives, setIsLoadingDrives] = useState(false);
  const [storageName, setStorageName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("10000");
  const [isSaving, setIsSaving] = useState(false);
  const [storageType, setStorageType] = useState("fixed");

  // NAS State
  const [nasShareName, setNasShareName] = useState("");
  const [nasIpAddress, setNasIpAddress] = useState("");
  const [nasDriveLetter, setNasDriveLetter] = useState("A");
  const [nasUsername, setNasUsername] = useState("");
  const [nasPassword, setNasPassword] = useState("");

  const fetchDrives = useCallback(async () => {
    setIsLoadingDrives(true);
    try {
      const response = await fetch(`${API_MANISH_URL}${API_URLS.get_storage_drives}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        // Assuming the response structure has a data field based on previous API patterns
        const driveData = json?.data || json || [];
        setDrives(driveData);
        if (driveData.length > 0 && !selectedDrive) {
          setSelectedDrive(driveData[0].path);
        }
      }
    } catch (error) {
      console.error("Error fetching drives:", error);
    } finally {
      setIsLoadingDrives(false);
    }
  }, [selectedDrive]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  useEffect(() => {
    if (editData) {
      setStorageName(editData.name || "");
      setIsDefault(!!editData.isDefault);
      setMaxCapacity(editData.maxCapacityGb ? String(editData.maxCapacityGb) : "10000");

      const typeStr = editData.type === "FIXED" ? "fixed" : "local-nas";
      setStorageType(typeStr);

      if (typeStr === "fixed") {
        setSelectedDrive(editData.basePath || "");
      } else if (typeStr === "local-nas") {
        setNasIpAddress(editData.ip || "");
        setNasShareName(editData.shareName || "");
        setNasDriveLetter(editData.driveLetter ? editData.driveLetter.replace(":", "") : "A");
        setNasUsername(editData.username || "");
        setNasPassword(editData.password || "");
      }
    }
  }, [editData]);

  const handleSave = async () => {
    if (storageType === "fixed") {
      if (!storageName.trim()) {
        toast.error("Please enter a storage name");
        return;
      }
      if (!selectedDrive) {
        toast.error("Please select a drive");
        return;
      }

      setIsSaving(true);
      try {
        const payload = {
          name: storageName,
          role: role,
          basePath: selectedDrive,
          maxCapacityGb: parseInt(maxCapacity),
          isDefault: isDefault
        };

        const url = editData
          ? `${API_MANISH_URL}${role === "PRIMARY" ? API_URLS.update_primary_storage_by_id : API_URLS.update_secondary_storage_by_id}/${editData.id}`
          : `${API_MANISH_URL}${API_URLS.create_fixed_storage}`;

        const method = editData ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success(editData ? "Storage updated successfully" : "Storage created successfully");
          if (onClose) onClose();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to create storage");
        }
      } catch (error) {
        console.error("Error creating storage:", error);
        toast.error("An error occurred while creating storage");
      } finally {
        setIsSaving(false);
      }
    } else if (storageType === "local-nas") {
      if (!storageName.trim()) {
        toast.error("Please enter a storage name");
        return;
      }
      if (!nasIpAddress.trim() || !nasShareName.trim() || !nasUsername.trim() || !nasPassword.trim()) {
        toast.error("Please fill all required NAS fields");
        return;
      }

      setIsSaving(true);
      try {
        const payload = {
          name: storageName,
          ip: nasIpAddress,
          role: role,
          shareName: nasShareName,
          driveLetter: `${nasDriveLetter}:`,
          username: nasUsername,
          password: nasPassword,
          maxCapacityGb: parseInt(maxCapacity) || 0,
          isDefault: isDefault
        };

        const url = editData
          ? `${API_MANISH_URL}${role === "PRIMARY" ? API_URLS.update_primary_storage_by_id : API_URLS.update_secondary_storage_by_id}/${editData.id}`
          : `${API_MANISH_URL}${API_URLS.create_nas_storage}`;

        const method = editData ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success(editData ? "NAS Storage updated successfully" : "NAS Storage created successfully");
          if (onClose) onClose();
        } else {
          let errorMessage = "Failed to create NAS storage";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error(e);
          }
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error creating NAS storage:", error);
        toast.error("An error occurred while creating NAS storage");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Tabs defaultValue="local-nas" value={storageType} onValueChange={setStorageType} className="w-full">
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
              <Input
                className=""
                placeholder="e.g. Building A - Main Archive"
                value={storageName}
                onChange={(e) => setStorageName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="font-roboto font-medium">Description <span className="text-muted-foreground">(Optional)</span></Label>
              <Textarea className="bg-white" rows={4} />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label className="font-roboto font-medium">Max Capacity (GB)</Label>
              <Input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
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
              <Label className="font-roboto font-medium text-sm">Share Name</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={nasShareName} onChange={(e) => setNasShareName(e.target.value)} placeholder="e.g. TestNAS" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-roboto font-medium text-sm">IP Address</Label>
                <Input value={nasIpAddress} onChange={(e) => setNasIpAddress(e.target.value)} placeholder="192.168.1.100" />
              </div>
              <div className="space-y-1">
                <Label className="font-roboto font-medium text-sm">Drive</Label>
                <Select value={nasDriveLetter} onValueChange={setNasDriveLetter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="K">K</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="Q">Q</SelectItem>
                    <SelectItem value="R">R</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="T">T</SelectItem>
                    <SelectItem value="U">U</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="W">W</SelectItem>
                    <SelectItem value="X">X</SelectItem>
                    <SelectItem value="Y">Y</SelectItem>
                    <SelectItem value="Z">Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-roboto text-sm font-medium text-foreground">Username</Label>
                <Input value={nasUsername} onChange={(e) => setNasUsername(e.target.value)} placeholder="Admin" />
              </div>
              <div className="space-y-1">
                <Label className="font-roboto text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={nasPassword} onChange={(e) => setNasPassword(e.target.value)} />
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

            {/* <div className="space-y-3">
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
            </div> */}
          </TabsContent>

          <TabsContent value="fixed" className="space-y-3">
            <Label>Available Drives</Label>

            {isLoadingDrives ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading drives...</div>
            ) : drives.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">No drives found.</div>
            ) : (
              drives.map((drive) => (
                <button
                  key={drive.path}
                  onClick={() => setSelectedDrive(drive.path)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left",
                    selectedDrive === drive.path
                      ? "border-blue-400"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-sm shrink-0",
                      selectedDrive === drive.path
                        ? "bg-primary/5 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <HardDrive className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm  font-roboto font-medium text-foreground">
                      Drive {drive.path}
                    </p>
                    <p className="text-xs font-roboto  font-normal  text-neutral-500">
                      {drive.freeSpace} available of {drive.totalSpace}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border shrink-0 flex items-center justify-center",
                      selectedDrive === drive.path
                        ? "border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedDrive === drive.path && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))
            )}
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
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Storage"}
        </Button>
      </div>
    </Tabs>
  );
}
