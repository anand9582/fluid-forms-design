// AddStorageUnitContent.tsx
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  HardDrive,
  Cloud,
  Wifi,
  Eye,
  EyeOff,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const storageTypes = [
  { id: "local-nas", label: "Local NAS", icon: Server },
  { id: "fixed", label: "Fixed", icon: HardDrive },
  { id: "cloud", label: "Cloud", icon: Cloud },
];

export function AddStorageUnitContent() {
  const [selectedType, setSelectedType] = useState("local-nas");
  const [showPassword, setShowPassword] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState("drive-d");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
      {/* LEFT COLUMN */}
      <div className="space-y-5">
        {/* Storage Type */}
        <div className="space-y-2">
          <Label>Storage type</Label>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid grid-cols-3">
              {storageTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger key={t.id} value={t.id} className="flex flex-col gap-1">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{t.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Name + Default */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Storage name</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs">Set as Default</span>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>
          </div>
          <Input placeholder="Building A - Main Archive" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={4} />
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label>Max Capacity (GB)</Label>
          <Input type="number" defaultValue={10000} />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-5">
        {selectedType === "fixed" && (
          <div className="space-y-3">
            <Label>Available Drives</Label>
            {["drive-d", "drive-e", "drive-f"].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedDrive(id)}
                className={cn(
                  "w-full p-4 border rounded-xl text-left",
                  selectedDrive === id && "border-primary bg-primary/5"
                )}
              >
                <HardDrive className="h-4 w-4 inline mr-2" />
                {id.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {selectedType === "cloud" && (
          <div className="space-y-4">
            <Label>Bucket Name</Label>
            <Input />
            <Label>Access Key</Label>
            <Input />
            <Label>Secret Key</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        )}

        {selectedType === "local-nas" && (
          <>
            <Label>Network Path</Label>
            <Input />
            <Label>IP Address</Label>
            <Input />
          </>
        )}
      </div>
    </div>
  );
}
