import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterOption {
  value: string;
  label: string;
}

interface DeviceFilterContentProps {
  values?: Record<string, string[] | string>;
  onChange?: (key: string, value: string[] | string) => void;
}

// Static options
const usernameOptions: FilterOption[] = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
  { value: "admin1", label: "Admin1" },
  { value: "alice", label: "Alice" },
];

const groupOptions: FilterOption[] = [
  { value: "hq", label: "HQ" },
  { value: "warehouse-a", label: "Warehouse A" },
  { value: "external", label: "External" },
  { value: "basement", label: "Basement" },
];

// Dummy options for demo
const statusOptions = ["All", "Offline", "Online", "Error"];
const deviceTypeOptions = ["Camera", "IoT Sensor", "NVR", "Access Control"];
const makeOptions = ["Axis", "Hikvision", "Dahua", "Hanwha"];
const modelOptions = ["P3245-LVE", "XNV-6080R", "M3067-P", "NDS-8560-H"];

export function DeviceFilterContent({ values = {}, onChange = () => {} }: DeviceFilterContentProps) {
  const [usernameSearch, setUsernameSearch] = React.useState("");
  const [groupSearch, setGroupSearch] = React.useState("");

  const safeValues = {
    username: [] as string[],
    group: [] as string[],
    portFrom: "",
    portTo: "",
    ipFrom: "",
    ipTo: "",
    ...values,
  };

  const handleCheckboxChange = (key: string, optionValue: string, checked: boolean) => {
    const current = (safeValues[key] as string[]) || [];
    if (checked) {
      onChange(key, [...current, optionValue]);
    } else {
      onChange(key, current.filter((v) => v !== optionValue));
    }
  };

  const filteredUsernames = usernameOptions.filter((opt) =>
    opt.label.toLowerCase().includes(usernameSearch.toLowerCase())
  );

  const filteredGroups = groupOptions.filter((opt) =>
    opt.label.toLowerCase().includes(groupSearch.toLowerCase())
  );

  // --- Inner reusable components ---
  function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div>
        <h3 className="font-roboto font-medium mb-3">{title}</h3>
        {children}
      </div>
    );
  }

  function FilterCheckbox({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: (checked: boolean) => void }) {
    const id = label.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex items-center gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
/>
            <Label htmlFor={id} className="text-sm font-roboto font-normal cursor-pointer">
            {label}
            </Label>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="flex flex-col h-full">
      <ScrollArea>
        <div className="space-y-6 pr-5">
          {/* Status */}
          <FilterSection title="Status">
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <FilterCheckbox key={option} label={option} />
              ))}
            </div>
          </FilterSection>

          {/* Device Type */}
          <FilterSection title="Device Type">
            <div className="grid grid-cols-2 gap-3">
              {deviceTypeOptions.map((option) => (
                <FilterCheckbox key={option} label={option} />
              ))}
            </div>
          </FilterSection>

          {/* Make */}
          <FilterSection title="Make">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="p-2 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search Make..." className="pl-9 border-0 shadow-none focus-visible:ring-0 h-8 p-0 pl-9" />
                    </div>
                </div>
                <ScrollArea className="h-[140px]">
                  <div className="p-3 space-y-3">
                    {makeOptions.map((option) => (
                      <FilterCheckbox key={option} label={option} />
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-border" />
              </div>
            </FilterSection>

         {/* Model */}
            <FilterSection title="Model">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search Model..." className="pl-9 border-0 shadow-none focus-visible:ring-0 h-8 p-0 pl-9" />
                  </div>
                </div>
                <ScrollArea className="h-[140px]">
                  <div className="p-3 space-y-3">
                    {modelOptions.map((option) => (
                      <FilterCheckbox key={option} label={option} />
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-border" />
              </div>
            </FilterSection>

          {/* Username */}
            <FilterSection title="Username">
            <div className="border border-border rounded-sm overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-border">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                    placeholder="Search Username..."
                    value={usernameSearch}
                    onChange={(e) => setUsernameSearch(e.target.value)}
                    className="pl-9 border-0 shadow-none focus-visible:ring-0 h-8 pl-9"
                    />
                </div>
                </div>

                {/* Scrollable Checkbox List */}
                <ScrollArea className="h-[140px]">
                <div className="p-3 space-y-3">
                    {filteredUsernames.map((option) => (
                    <FilterCheckbox
                        key={option.value}
                        label={option.label}
                        checked={safeValues.username.includes(option.value)}
                        onChange={(checked) =>
                        handleCheckboxChange("username", option.value, !!checked)
                        }
                    />
                    ))}
                </div>
                </ScrollArea>

                {/* Bottom Border */}
                <div className="border-t border-border" />
            </div>
            </FilterSection>


        {/* Group */}
            <FilterSection title="Group">
            <div className="border border-border rounded-sm overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                    placeholder="Search Group..."
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    className="pl-9 border-0 shadow-none focus-visible:ring-0 h-8 pl-9"
                    />
                </div>
                </div>

                {/* Scrollable Checkbox List */}
                <ScrollArea className="h-[140px]">
                <div className="p-3 space-y-3">
                    {filteredGroups.map((option) => (
                    <FilterCheckbox
                        key={option.value}
                        label={option.label}
                        checked={safeValues.group.includes(option.value)}
                        onChange={(checked) =>
                        handleCheckboxChange("group", option.value, !!checked)
                        }
                    />
                    ))}
                </div>
                </ScrollArea>

       

                {/* Bottom Border */}
                <div className="border-t border-border" />
            </div>
            </FilterSection>

                   {/* Port Range */}
                    <FilterSection title="Port Range">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-sm font-roboto font-normal mb-1.5 block">
                                From Port
                            </Label>
                            <Input
                                placeholder="10"
                                className="h-10"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-roboto font-normal mb-1.5 block">
                                To Port
                            </Label>
                            <Input
                                placeholder="2000"
                                className="h-10"
                            />
                        </div>
                    </div>
                    </FilterSection>

                      {/* Port Range */}
                    <FilterSection title="IP Range">
                        <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-sm font-roboto font-normal mb-1.5 block">
                                            From Port
                                        </Label>
                                        <Input
                                            placeholder="193.237.32.1"
                                            className="h-10"
                                        />
                                    </div>
                                <div>
                                        <Label className="text-sm font-roboto font-normal mb-1.5 block">
                                            To IP
                                        </Label>
                                        <Input
                                            placeholder="391.242.23.1"
                                            className="h-10"
                                        />
                                </div>
                        </div>
                    </FilterSection>

        </div>
      </ScrollArea>
    </div>
  );
}
