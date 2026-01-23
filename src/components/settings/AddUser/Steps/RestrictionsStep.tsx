import { useState } from "react";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/* TAG INPUT */
/* ------------------------------------------------------------------ */

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
  label: string;
}

function TagInput({
  tags,
  onTagsChange,
  placeholder,
  label,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="flex flex-wrap items-center gap-2 min-h-[42px] px-3 py-2 rounded-md border border-input bg-white">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RESTRICTIONS STEP */
/* ------------------------------------------------------------------ */

interface RestrictionsStepProps {
  currentStep: number;
  totalSteps: number;
}

export function RestrictionsStep({
  currentStep,
  totalSteps,
}: RestrictionsStepProps) {
  const [macAddresses, setMacAddresses] = useState<string[]>([
    "00:1A:2B:3C:4D:5E",
  ]);
  const [deviceUIDs, setDeviceUIDs] = useState<string[]>(["D-99283-X"]);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [inactivityTimeout, setInactivityTimeout] = useState("");
  const [allowedIPStart, setAllowedIPStart] = useState("192.168.1.1");
  const [allowedIPEnd, setAllowedIPEnd] = useState("192.168.1.255");
  const [maxLogins, setMaxLogins] = useState("2");
  const [loginAllowed, setLoginAllowed] = useState(false);

  return (
    <div className="space-y-6">
      {/* STEP HEADER */}
      <p className="text-xs font-semibold text-blue-600 uppercase">
        Step {currentStep + 1} of {totalSteps}
      </p>

      {/* MAC ADDRESSES */}
      <TagInput
        tags={macAddresses}
        onTagsChange={setMacAddresses}
        placeholder="Add MAC address..."
        label="Allowed MAC Addresses"
      />

      {/* DEVICE UID */}
      <TagInput
        tags={deviceUIDs}
        onTagsChange={setDeviceUIDs}
        placeholder="Add Device UID..."
        label="Allowed Device UIDs"
      />

      {/* EXPIRY + TIMEOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start h-[42px]",
                  !expiryDate && "text-muted-foreground"
                )}
              >
                {expiryDate
                  ? format(expiryDate, "dd/MM/yyyy")
                  : "dd/mm/yyyy"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Inactivity Timeout (minutes)</Label>
          <Input
            value={inactivityTimeout}
            onChange={(e) => setInactivityTimeout(e.target.value)}
            placeholder="Value"
            className="h-[42px]"
          />
        </div>
      </div>

      {/* IP RANGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Allowed IP Start</Label>
          <Input
            value={allowedIPStart}
            onChange={(e) => setAllowedIPStart(e.target.value)}
            className="h-[42px]"
          />
        </div>
        <div>
          <Label>Allowed IP End</Label>
          <Input
            value={allowedIPEnd}
            onChange={(e) => setAllowedIPEnd(e.target.value)}
            className="h-[42px]"
          />
        </div>
      </div>

      {/* MAX LOGINS */}
      <div className="max-w-sm">
        <Label>Max Simultaneous Logins</Label>
        <Select value={maxLogins} onValueChange={setMaxLogins}>
          <SelectTrigger className="h-[42px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="unlimited">Unlimited</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LOGIN ALLOWED */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          checked={loginAllowed}
          onCheckedChange={(v) => setLoginAllowed(v === true)}
         className="h-4 w-4 rounded border-2 border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
        <Label>User login allowed</Label>
      </div>
    </div>
  );
}
