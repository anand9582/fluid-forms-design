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

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
  label: string;
}

function TagInput({ tags, onTagsChange, placeholder, label }: TagInputProps) {
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
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex flex-wrap items-center gap-2 min-h-[42px] px-3 py-2 rounded-md border border-input">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
          placeholder={tags.length === 0 ? placeholder : placeholder}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}

export function RestrictionsStep() {
  const [macAddresses, setMacAddresses] = useState<string[]>([
    "00:1A:2B:3C:4D:5E",
    "00:1A:2B:3C:4D:5E",
  ]);
  const [deviceUIDs, setDeviceUIDs] = useState<string[]>(["D-99283-X"]);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [inactivityTimeout, setInactivityTimeout] = useState("");
  const [allowedIPStart, setAllowedIPStart] = useState("193.47.38.1");
  const [allowedIPEnd, setAllowedIPEnd] = useState("283.36.18.4");
  const [maxLogins, setMaxLogins] = useState("2");
  const [loginAllowed, setLoginAllowed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Allowed MAC Addresses */}
      <TagInput
        tags={macAddresses}
        onTagsChange={setMacAddresses}
        placeholder="Add MAC Address..."
        label="Allowed MAC Addresses"
      />

      {/* Allowed Device UIDs */}
      <TagInput
        tags={deviceUIDs}
        onTagsChange={setDeviceUIDs}
        placeholder="Add Device UID.."
        label="Allowed Device UIDs"
      />

      {/* Account Expiry Date & Inactivity Timeout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Account Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-[42px] bg-white",
                  !expiryDate && "text-muted-foreground"
                )}
              >
                {expiryDate ? format(expiryDate, "dd/MM/yy") : <span>dd/mm/yy</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                initialFocus
                className={cn("p-3 pointer-events-auto ")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Inactivity Timeout (minutes)</Label>
          <Input
            placeholder="Value"
            value={inactivityTimeout}
            onChange={(e) => setInactivityTimeout(e.target.value)}
            className="h-[42px]"
          />
        </div>
      </div>

      {/* Allowed IP Start & End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Allowed IP Start</Label>
          <Input
            placeholder="e.g. 192.168.1.1"
            value={allowedIPStart}
            onChange={(e) => setAllowedIPStart(e.target.value)}
            className="h-[42px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Allowed IP End</Label>
          <Input
            placeholder="e.g. 192.168.1.255"
            value={allowedIPEnd}
            onChange={(e) => setAllowedIPEnd(e.target.value)}
            className="h-[42px]"
          />
        </div>
      </div>

      {/* Max Simultaneous Logins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2">
                 Max Simultaneous 
              </Label>
            <Select value={maxLogins} onValueChange={setMaxLogins}>
              <SelectTrigger className="h-[42px]">
                <SelectValue placeholder="Select max logins" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            </div>
        </div>

      {/* User login allowed checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="loginAllowed"
          checked={loginAllowed}
          onCheckedChange={(checked) => setLoginAllowed(checked === true)}
          className="h-4 w-4 rounded border-2 border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
        <Label 
          htmlFor="loginAllowed" 
          className="text-sm text-foreground cursor-pointer"
        >
          User login allowed.
        </Label>
      </div>
    </div>
  );
}
