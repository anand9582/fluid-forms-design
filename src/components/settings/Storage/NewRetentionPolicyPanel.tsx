import { useState } from "react";
import { DynamicSlidePanel } from "@/components/ui/dynamic-slide-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewRetentionPolicyPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRetentionPolicyPanel({ open, onOpenChange }: NewRetentionPolicyPanelProps) {
  const [policyName, setPolicyName] = useState("");
  const [duration, setDuration] = useState("30");
  const [action, setAction] = useState("Remove");
  const [locations, setLocations] = useState("");
  const [freeSpace, setFreeSpace] = useState([40]);
  const [dualRecording, setDualRecording] = useState(false);

  const handleSave = () => {
    onOpenChange(false);
  };

  return (
    <DynamicSlidePanel
      open={open}
      onOpenChange={onOpenChange}
      title="New Retention Policy"
      description="Define storage duration and lifecycle rules."
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Policy</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Policy Name */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Policy Name</Label>
          <Input
            placeholder="e.g. Standard 30 days"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
          />
        </div>

        {/* Duration & Action */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Duration (Days)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Action after expiry</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remove">Remove</SelectItem>
                <SelectItem value="Archive">Archive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assigned Locations */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Assigned Locations</Label>
          <Input
            placeholder="Add..."
            value={locations}
            onChange={(e) => setLocations(e.target.value)}
          />
        </div>

        {/* Minimum Free Space Buffer */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Minimum Free Space Buffer (%)</Label>
          <Slider
            value={freeSpace}
            onValueChange={setFreeSpace}
            max={50}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0% (High Risk)</span>
            <span className="text-primary font-semibold">{freeSpace[0]}%</span>
            <span>50% (Conservative)</span>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3.5">
          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Reducing retention duration will cause older data to be permanently Removed during the next cleanup cycle (scheduled 03:00 AM).
          </p>
        </div>

        {/* Dual Recording */}
        <div className="flex items-start gap-4 rounded-xl border border-border p-4">
          <div className="p-2.5 rounded-lg bg-muted shrink-0">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Dual recording</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {dualRecording ? "Enabled" : "Disabled"}
                </span>
                <Switch checked={dualRecording} onCheckedChange={setDualRecording} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Writes video streams to both a primary volume and a designated secondary volume simultaneously. This ensures zero data loss if the primary storage fails.
            </p>
          </div>
        </div>
      </div>
    </DynamicSlidePanel>
  );
}
