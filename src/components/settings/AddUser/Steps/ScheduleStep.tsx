
import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  isClosed?: boolean;
}

interface EventType {
  id: string;
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
  enabled: boolean;
}

interface ScheduleEventsStepProps {
  scheduleData?: DaySchedule[];
  eventTypes?: EventType[];
  onScheduleChange?: (data: DaySchedule[]) => void;
  onEventTypesChange?: (data: EventType[]) => void;
}

const defaultSchedule: DaySchedule[] = [
  { day: "Monday", startTime: "09:00", endTime: "18:00", enabled: true },
  { day: "Tuesday", startTime: "09:00", endTime: "18:00", enabled: true },
  { day: "Wednesday", startTime: "09:00", endTime: "18:00", enabled: true },
  { day: "Thursday", startTime: "09:00", endTime: "18:00", enabled: true },
  { day: "Friday", startTime: "09:00", endTime: "18:00", enabled: true },
  { day: "Saturday", startTime: "10:00", endTime: "16:00", enabled: true },
  { day: "Sunday", startTime: "09:00", endTime: "18:00", enabled: true, isClosed: true },
];

const defaultEventTypes: EventType[] = [
  { id: "motion", name: "Motion detection", description: "Detects movement in defined areas", severity: "low", enabled: true },
  { id: "line-crossing", name: "Line crossing", description: "Operator L1", severity: "medium", enabled: false },
];

const timeOptions = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", 
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
  "Closed"
];
export function ScheduleStep({
  scheduleData: externalScheduleData,
  eventTypes: externalEventTypes,
  onScheduleChange,
  onEventTypesChange,
}: ScheduleEventsStepProps) {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(externalScheduleData || defaultSchedule);
  const [eventTypes, setEventTypes] = useState<EventType[]>(externalEventTypes || defaultEventTypes);

  const handleScheduleChange = (index: number, field: "startTime" | "endTime" | "enabled", value: string | boolean) => {
    const newSchedule = [...scheduleData];
    if (field === "startTime" && value === "Closed") {
      newSchedule[index] = { ...newSchedule[index], isClosed: true, startTime: "Closed" };
    } else if (field === "startTime" && typeof value === "string") {
      newSchedule[index] = { ...newSchedule[index], startTime: value, isClosed: false };
    } else if (field === "endTime" && typeof value === "string") {
      newSchedule[index] = { ...newSchedule[index], endTime: value };
    } else if (field === "enabled" && typeof value === "boolean") {
      newSchedule[index] = { ...newSchedule[index], enabled: value };
    }
    setScheduleData(newSchedule);
    onScheduleChange?.(newSchedule);
  };

  const handleEventToggle = (id: string) => {
    const newEventTypes = eventTypes.map(event => 
      event.id === id ? { ...event, enabled: !event.enabled } : event
    );
    setEventTypes(newEventTypes);
    onEventTypesChange?.(newEventTypes);
  };

  const handleSeverityChange = (id: string, severity: "low" | "medium" | "high") => {
    const newEventTypes = eventTypes.map(event => 
      event.id === id ? { ...event, severity } : event
    );
    setEventTypes(newEventTypes);
    onEventTypesChange?.(newEventTypes);
  };

  const getSeverityStyles = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "bg-green-50 text-blue-600 border-green-200";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "high":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          User is restricted to "Standard shift" hours (9:00 - 18:00) unless overridden below.
        </p>
      </div>

      {/* Allowed Login Times */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Allowed Login Times</h3>
        
        <div className="space-y-3 border bg-gray-50 p-3 rounded-md">
          {scheduleData.map((day, index) => (
            <div
              key={day.day}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-foreground w-24 flex-shrink-0">{day.day}</span>
              
              <Select
                value={day.isClosed ? "Closed" : day.startTime}
                onValueChange={(value) => handleScheduleChange(index, "startTime", value)}
              >
                <SelectTrigger className="w-[100px] h-9 text-sm  bg-white shadow-sm border border-border rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-border">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-sm text-muted-foreground">to</span>
              
              <Select
                value={day.endTime}
                onValueChange={(value) => handleScheduleChange(index, "endTime", value)}
                disabled={day.isClosed}
              >
                <SelectTrigger className="w-[100px] h-9 text-sm bg-white shadow-sm border border-border rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-border">
                  {timeOptions.filter(t => t !== "Closed").map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="ml-auto">
                <Switch
                  checked={day.enabled}
                  onCheckedChange={(checked) => handleScheduleChange(index, "enabled", checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {/* Allowed Event Types */}
        <div className="space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-foreground">Allowed Event Types</h3>
          <div className="border  rounded-md">
            {/* Header */}
            <div className="grid grid-cols-[200px_1fr_180px] gap-4 pb-2 border-b border-border p-3 bg-[#F1F5F9] rounded-t-lg">
                <span className="text-sm font-medium text-black-600">Event Name</span>
                <span className="text-sm font-medium text-black-600">Description</span>
                <span className="text-sm font-medium text-black-600">Severity</span>
            </div>
            
            {/* Event Rows */}
            {eventTypes.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[200px_1fr_180px] gap-4 py-3 items-center border-b border-border last:border-b-0 p-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={event.enabled}
                    onCheckedChange={() => handleEventToggle(event.id)}
                    className="h-4 w-4 rounded border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className={cn(
                    "text-sm",
                    event.enabled ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {event.name}
                  </span>
                </div>
                
                <span className="text-sm text-gray-500 font-normal">{event.description}</span>
                
                <Select
                  value={event.severity}
                  onValueChange={(value) => handleSeverityChange(event.id, value as "low" | "medium" | "high")}
                >
                  <SelectTrigger className={cn(
                    "w-full h-9 text-sm border rounded-md",
                    getSeverityStyles(event.severity)
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
