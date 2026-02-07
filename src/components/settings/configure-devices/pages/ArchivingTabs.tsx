import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor,AlertCircle,ChevronDown,Mail,Smartphone,Webhook,RefreshCcw} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
    AlertIcons,
    SettingIcons,
  } from "@/components/Icons/Svg/RecordingIcons";

import {
 ArchivingIcons,
 SycFlowIcons
  } from "@/components/Icons/Svg/ConfigureIcons";


import { IconWrapper } from "@/components/ui/icon-wrapper";

const ConfigSection = ({ icon, title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-3 w-full p-3 hover:bg-muted/50 transition-colors border-b" >
            <IconWrapper icon={icon} isActive={isOpen} />
              <span className="font-medium flex-1 text-left font-roboto">
                {title}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform p-1 rounded-full",
                  isOpen && "rotate-180 bg-blue-100 text-blue-700"
                )}
              />
      </CollapsibleTrigger>

      <CollapsibleContent>
          <div className="px-4 pb-4 pt-3 space-y-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function ArchivingTabs() {
  const form = useForm({
      defaultValues: {
        deviceMake: "axis",
        model: "DS-2CD2043G2-I",
        logicalGroup: "HQ / Floor 1",
        deviceCategory: "Camera",
      },
    });

  const [alerts, setAlerts] = useState([
    {
      id: "stream-interrupt",
      name: "Archiving Failed",
      enabled: true,
      channels: {
        mail: true,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "low-bandwidth",
      name: "Sync Delay High",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "codec-mismatch",
      name: "Destination Unreachable",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: true,
      },
    },
      {
      id: "Buffer-Overflow",
      name: "Integrity Check Failed",
      enabled: false,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
     {
      id: "Buffer-Overflow",
      name: "Bandwidth Throttled",
      enabled: false,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
     {
      id: "Buffer-Overflow",
      name: "Cloud Storage Limit",
      enabled: false,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
  ]);

  const CHANNELS = [
    { key: "mail", icon: Mail },
    { key: "sms", icon: Smartphone },
    { key: "desktop", icon: Monitor },
    { key: "webhook", icon: Webhook },
  ];

  return (
       <div className="space-y-4 mt-0">
       <ConfigSection icon={<ArchivingIcons   className="h-4 w-4" />} title="Archiving Strategy & Policy">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 mt-2">
                              <div className="space-y-0.5">
                                <p className="text-md font-medium  font-roboto text-neutral-700">
                                     Overwrite on Low Disk
                                </p>
                                <p className="text-fontSize14px text-neutral-600 font-roboto font-normal">
                                     Auto-Remove oldest archive data.
                                </p>
                              </div>
                              <Switch defaultChecked />
                         </div>

                {/* Sync Strategy  */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                      <FormLabel text="Sync Strategy" />
                        <Select defaultValue="Automatic">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Automatic two">Automatic two</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                  {/* Retention Health & Archive Volume */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg  border-slate-200 bg-slate-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-md font-roboto font-medium text-gray-600">Retention Health</span>
                      </div>
                      <p className="text-md font-roboto font-bold">90</p>
                      <p className="text-xs text-gray-500 font-roboto font-medium">Long-term (Days)</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-roboto font-medium text-gray-600">Archive Volume</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 font-roboto font-medium hover:bg-green-100">Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="text-[12px] font-roboto font-medium text-neutral-500">Used: 14.50 TB</span>
                        <span className="text-[12px] font-roboto font-medium text-neutral-500">Total: 500 TB</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                         <Slider
                              defaultValue={[75]} 
                              max={100}
                              step={1}
                              trackHeight={8}
                              thumbSize={14}
                              className="flex-1"
                            />
                      </div> 
                    </div>
                  </div>

            </div>
          </ConfigSection>

   {/* Sync Flow & Mapping */}
              <ConfigSection icon={<SycFlowIcons className="h-4 w-4" />} title="Sync Flow & Mapping" defaultOpen>
                <div className="space-y-6">
                    {/* Checkbox Grid */}
                  <div className="grid grid-cols-2 gap-4">
                   <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-slate-50 hover:bg-muted/50 transition-colors">
                      <Checkbox
                           defaultChecked
                          variant="soft"
                          size="sm"
                      />
                    <span className="text-sm font-medium">Sync all data (ignore aging)</span>
                  </label>

                    <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer  bg-slate-50 hover:bg-muted/50 transition-colors">
                       <Checkbox
                          defaultChecked
                          variant="soft"
                          size="sm"
                      />
                      <span className="text-sm font-medium">Remove source after sync</span>
                    </label>
                  </div>
                  
                  {/* Global Sync Flow Direction */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Global Sync Flow Direction</label>
                    <Select defaultValue="primary-to-secondary">
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary-to-secondary">Primary to Secondary</SelectItem>
                        <SelectItem value="secondary-to-primary">Secondary to Primary</SelectItem>
                        <SelectItem value="bidirectional">Bidirectional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Storage Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-md font-medium font-roboto text-gray-600">Primary Storage</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input value="aws-s3-east-1-vault" readOnly className="bg-muted/30 border" />
                      </div>
                    </div>
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-md font-medium font-roboto text-gray-600">Secondary Archive</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input value="CLOUD_S3_OFFSITE" readOnly className="bg-muted/30 border" />
                      </div>
                    </div>
                  </div>
                </div>
              </ConfigSection>


           {/* Sync Optimization */}
              <ConfigSection icon={<RefreshCcw className="h-4 w-4" />} title="Sync Optimization" defaultOpen>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Checkbox
                            defaultChecked
                            variant="soft"
                            size="sm"
                        />
                       <span className="text-sm font-medium">Bitstream Compression</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Checkbox
                            defaultChecked
                            variant="soft"
                            size="sm"
                        />
                       <span className="text-sm font-medium">AES-256 Volume Encryption</span>
                    </label>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-roboto font-regular text-gray-950">Maximum Bandwidth Allocation (Mbps)</label>
                      <span className="text-sm font-roboto font-semibold text-primary">750 Mbps</span>
                    </div>
                    <Slider 
                       defaultValue={[75]} max={100} step={1}
                       trackHeight={8}
                       thumbSize={14}
                      />
                  </div>
                  
                  {/* Warning Alert */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-200 text-sm">
                       <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
                        <span className="text-amber-600 font-roboto font-normal">
                          Allocating more than 50% of peak bandwidth may affect live-view stability for remote clients.
                        </span>
                  </div>
                </div>
              </ConfigSection>
            
 <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Archiving Alerts" defaultOpen>
              <div className="border rounded-lg overflow-hidden">

                {/* Header */}
                <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b text-sm font-medium bg-slate-100">
                  <span className="text-slate-600 font-roboto">Alert Trigger</span>
                  <span className="text-slate-600 font-roboto text-center">Enabled</span>
                  <span className="text-slate-600 font-roboto text-end mr-5">
                    Notification Channels
                  </span>
                </div>

                {/* Rows */}
                  {alerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "grid grid-cols-3 gap-4 px-4 py-3 items-center",
                        index !== alerts.length - 1 && "border-b"
                      )}
                    >
                      {/* Alert name */}
                      <span className="text-sm font-roboto font-medium">
                        {alert.name}
                      </span>

                      {/* Enable switch */}
                      <div className="flex justify-center">
                        <Switch
                          checked={alert.enabled}
                          onCheckedChange={(checked) => {
                            setAlerts((prev) =>
                              prev.map((a) =>
                                a.id === alert.id ? { ...a, enabled: checked } : a
                              )
                            );
                          }}
                        />
                      </div>

                      {/* Notification channels */}
                      <div className="flex justify-end space-x-2">
                        {CHANNELS.map(({ key, icon: Icon }) => {
                          const active = alert.channels[key];
                          return (
                            <Button
                              key={key}
                              variant="outline"
                              size="icon"
                              disabled={!alert.enabled}
                              onClick={() => {
                                setAlerts((prev) =>
                                  prev.map((a) =>
                                    a.id === alert.id
                                      ? {
                                          ...a,
                                          channels: {
                                            ...a.channels,
                                            [key]: !a.channels[key],
                                          },
                                        }
                                      : a
                                  )
                                );
                              }}
                                className={cn(
                                  "h-8 w-8 transition-colors",
                                  !alert.enabled &&
                                    "cursor-not-allowed text-muted-foreground bg-muted/10",
                                  alert.enabled && active &&
                                    "text-primary border-primary/40 bg-primary/10 hover:bg-primary/20",
                                  alert.enabled && !active &&
                                    "text-muted-foreground border-muted bg-background hover:bg-muted/50"
                                )}
                              >
                              <Icon className="h-4 w-4" />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </ConfigSection>


      </div>
  );
}
