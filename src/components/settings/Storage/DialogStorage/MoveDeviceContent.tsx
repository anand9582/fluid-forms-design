import { AlertTriangle, RotateCcw, Server } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoveIcons } from "@/components/Icons/Svg/StorageRecordingIcon";

import { cn } from "@/lib/utils";

interface MoveDeviceContentProps {
  value: string;
  onChange: (value: string) => void;
  allStorages?: any[];
  selectedStorageId?: string;
  setSelectedStorageId?: (id: string) => void;
}

export function MoveDeviceDialogContent({
  value,
  onChange,
  allStorages = [],
  selectedStorageId,
  setSelectedStorageId,
}: MoveDeviceContentProps) {
  return (
    <div className="space-y-4">
      {/* Destination Selection */}
      <div className="space-y-2">
        <label className="text-sm font-roboto font-medium text-black">Target Storage Unit</label>
        <Select value={selectedStorageId} onValueChange={setSelectedStorageId}>
          <SelectTrigger className="w-full h-11 rounded-xl border-border bg-white">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select destination..." />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {allStorages.map((storage) => (
              <SelectItem key={storage.id} value={String(storage.id)} className="rounded-lg">
                {storage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-roboto font-medium text-black">Move Mode</label>
        <RadioGroup
          value={value}
          onValueChange={onChange}
          className="space-y-3"
        >
          {/* Move Everything */}
          <label
            htmlFor="move-everything"
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors",
              value === "move-everything"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:bg-muted/50"
            )}
          >
            <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
              <MoveIcons className="h-5 w-5 " />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Move everything</p>
              <p className="text-xs font-roboto text-muted-foreground">
                Include all past recordings
              </p>
            </div>

            <RadioGroupItem
              value="move-everything"
              id="move-everything"
            />
          </label>

          {/* Start Fresh */}
          <label
            htmlFor="start-fresh"
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors",
              value === "start-fresh"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/50"
            )}
          >
            <div className="p-2.5 rounded-lg bg-muted shrink-0">
              <RotateCcw className="h-5 w-5  text-muted-foreground" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Start fresh</p>
              <p className="text-xs font-roboto  text-muted-foreground">
                Only new recordings move
              </p>
            </div>

            <RadioGroupItem
              value="start-fresh"
              id="start-fresh"
            />
          </label>
        </RadioGroup>

        {/* Warning */}
        <div className="flex gap-2 rounded-lg items-center">
          <AlertTriangle className="h-4 w-4 font-roboto font-medium mt-0.5 text-amber-600" />
          <p className="text-sm text-black font-roboto font-regular">
            This action may take time and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
}
