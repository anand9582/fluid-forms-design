import { useState } from "react";
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
import { AlertTriangle, Database,Clock  } from "lucide-react";

export function NewRetentionPolicyPanel() {
  const [policyName, setPolicyName] = useState("");
  const [duration, setDuration] = useState("30");
  const [action, setAction] = useState("Remove");
  const [locations, setLocations] = useState("");
  const [freeSpace, setFreeSpace] = useState([40]);
  const [dualRecording, setDualRecording] = useState(false);

  return (
    <div className="space-y-6">
      {/* Policy Name */}
      <div className="space-y-2">
        <Label>Policy Name</Label>
        <Input
          placeholder="e.g. Standard 30 days"
          value={policyName}
          onChange={(e) => setPolicyName(e.target.value)}
        />
      </div>

      {/* Duration & Action */}
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label>Duration (Days)</Label>
                <div className="relative">
                    <Input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="pr-10"
                    />
                    <Clock
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                </div>
        </div>

        <div className="space-y-2">
          <Label>Action after expiry</Label>
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
        <Label>Assigned Locations</Label>
        <Input
          placeholder="Add..."
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
        />
      </div>

      {/* Minimum Free Space */}
      <div className="space-y-3">
        <Label>Minimum Free Space Buffer (%)</Label>
        <Slider
          value={freeSpace}
          onValueChange={setFreeSpace}
          max={50}
          min={0}
          step={1}
          trackHeight={6} 
          thumbSize={20}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0% (High Risk)</span>
          <span className="text-primary font-semibold">{freeSpace[0]}%</span>
          <span>50% (Conservative)</span>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3.5">
        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
        <p className="text-xs text-yellow-600">
           Reducing retention duration will cause older data to be permanently Removed during the next cleanup cycle (scheduled 03:00 AM).
        </p>
      </div>

    {/* Dual Recording */}
        <div className="flex items-start gap-4 rounded-xl border border-border p-4">
          <div className="p-2.5 rounded-lg bg-blue-50 shrink-0">
            <Database className="h-5 w-5 text-blue-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-md font-roboto font-medium text-black">Dual recording</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-roboto font-medium text-gray-700">
                   {dualRecording ? "Enabled" : "Disabled"}
                </span>
                <Switch checked={dualRecording} onCheckedChange={setDualRecording} />
              </div>
            </div>
            <p className="text-[12px] font-roboto font-regular text-slate-500 mt-1 max-w-sm">
              Writes video streams to both a primary volume and a designated secondary volume simultaneously. This ensures zero data loss if the primary storage fails.
            </p>
          </div>
        </div>

    </div>
  );
}
