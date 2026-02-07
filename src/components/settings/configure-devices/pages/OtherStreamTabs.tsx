import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor,RefreshCw,Shield, Info,ChevronDown,Mail,Smartphone,Webhook,Activity,Network} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
    RecordingIcons,
    AlertIcons,
    SettingIcons,
  } from "@/components/Icons/Svg/RecordingIcons";

import {
 DisconnectIcon
  } from "@/components/Icons/Svg/liveViewIcons";


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

export default function OtherStreamTabs() {
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
      name: "Multicast Conflict",
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
      name: "Extra Stream Failure",
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
      name: "Auth Configuration Changed",
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
      name: "Streaming Rate Limit",
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
      name: "Packet Dropped (Network High)",
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
      name: "RTSP Session Timeout",
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
       <ConfigSection icon={<Shield   className="h-4 w-4" />} title="Stream Access Security">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 mt-2">
                              <div className="space-y-0.5">
                                <p className="text-md font-medium  font-roboto text-neutral-700">
                                     Enable Auth Challenge
                                </p>
                                <p className="text-fontSize14px text-neutral-600 font-roboto font-normal">
                                    Require credentials for all RTSP/HTTP stream requests.
                                </p>
                              </div>

                              <Switch defaultChecked />
                         </div>

                {/* Audio Codec and Input Gain */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                      <FormLabel text="Auth Mechanism" />
                        <Select defaultValue="Digest">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Digest">Digest</SelectItem>
                            <SelectItem value="Digest One">Digest One</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-tex text-blue-600 bg-blue-50 border border-blue-200 text-sm">
                        <Info className="h-4 w-4 shrink-0 mr-2" />
                        <span>
                            <strong className="font-roboto font-medium">Digest authentication</strong> is recommended as it uses a challenge-response mechanism to ensure credentials are never transmitted in plaintext across the network.
                        </span>
                    </div>

                  </div>
                </ConfigSection>

                <ConfigSection icon={<Activity   className="h-4 w-4" />} title="Additional Streams (Auxiliary)">
                      {/* Table Container */}
                          <div className="mt-2 rounded-sm border overflow-hidden">

                            {/* Table Header */}
                            <div className="grid grid-cols-3 px-4 py-3 bg-slate-100 font-roboto text-sm font-medium text-slate-600">
                              <span>Stream Name</span>
                              <span>Configuration</span>
                              <span className="text-right">Active</span>
                            </div>

                            {/* Row 1 */}
                            <div className="grid grid-cols-3 px-4 py-4 items-center border-t">
                              <span className="text-slate-800 text-fontSize14px">Stream Interrupted</span>

                              <span className="text-slate-500 text-fontSize14px">
                                  1280x720 | 10 FPS | 1.5 Mbps
                              </span>

                              <div className="flex justify-end">
                                <Switch defaultChecked />
                              </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-3 px-4 py-4 items-center border-t">
                              <span className="text-slate-800">Stream Interrupted</span>

                              <span className="text-slate-500">
                                1280x720 | 10 FPS | 1.5 Mbps
                              </span>

                              <div className="flex justify-end">
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </div>

                            <div className="flex items-center gap-2 p-3 rounded-lg bg-tex text-blue-600 bg-blue-50 border border-blue-200 text-sm">
                               <Info className="h-4 w-4 shrink-0" />
                              <span>
                                 toring auxiliary streams increases storage consumption by approx. 12GB/Day per stream (at current settings).
                              </span>
                          </div>

                        <button className="flex items-center gap-2 font-roboto text-sm font-medium text-blue-700">
                          <RefreshCw className="h-4 w-4" />
                           Fetch Streams
                       </button>
                </ConfigSection>


                <ConfigSection icon={<Network   className="h-4 w-4" />} title="Multicast Configuration">
                             <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 mt-3">
                                        <div className="space-y-0.5">
                                          <p className="text-md font-medium  font-roboto text-neutral-700">
                                               Active Multicast
                                          </p>
                                          <p className="text-fontSize14px text-neutral-600 font-roboto font-normal">
                                               Enable one-to-many stream distribution.
                                          </p>
                                        </div>
                                        <Switch defaultChecked />
                                  </div>

                                   {/* Audio Codec and Input Gain */}
                               <div className="grid grid-cols-2 gap-6">
                                    {/* IP Group Address */}
                                    <div className="space-y-2">
                                      <FormLabel text="IP Group Address" />
                                      <Input
                                        type="text"
                                        placeholder="239.1.1.1"
                                        defaultValue="Digest"
                                      />
                                    </div>

                                    {/* Group Port Input */}
                                    <div className="space-y-2">
                                      <FormLabel text="Group Port" />
                                      <Input
                                        type="number"
                                        placeholder="3534"
                                        min={0}
                                      />
                                    </div>

                                      {/* TTL Hop Limit Input */}
                                    <div className="space-y-2">
                                        <FormLabel text="TTL Hop Limit" />
                                        <Input
                                          type="number"
                                          placeholder="34"
                                          min={0}
                                        />
                                    </div>
                                  </div>

                            </div>
                </ConfigSection>

              <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
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
