import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor,Video,Volume2,Ban,Clock,Bell,RefreshCw,CircleDot, Info,ChevronDown,Mail,Smartphone,Webhook,Plug } from "lucide-react";
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

export default function LiveViewTabs() {
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
      name: "Stream Interrupted",
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
      name: "Low Bandwidth",
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
      name: "Codec Mismatch",
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
      name: "Buffer Overflow",
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
      name: "Frame Rate Drop",
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
      name: "Unauthorised Access Attempt",
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
                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Device Stream Settings" defaultOpen>
                    <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-1">
                              <FormLabel text="Live Stream URI" />
                              <Input value="rtsp://192.168.10.101:554/live/main" />
                          </div>
                      </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel text="Protocol" />
                        <Select defaultValue="TCP">
                          <SelectTrigger>
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TCP">UDP</SelectItem>
                            <SelectItem value="UDP 2">UDP 2</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Codec */}
                    <div className="space-y-2">
                       <FormLabel text="Profile" />
                        <Select defaultValue="Main Stream">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Stream">Main Stream</SelectItem>
                            <SelectItem value="h265">H.265</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Resolution */}
                    <div className="space-y-2">
                      <FormLabel text="Codec" />
                      <Select defaultValue="h265">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="h265">H.265</SelectItem>
                           <SelectItem value="h266">H.266</SelectItem>
                          <SelectItem value="h267">H.267</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* FPS */}
                    <div className="space-y-2">
                        <FormLabel text="Resolution" />
                          <Select defaultValue="7272x2161">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7272x2161">7272x2161 (4K)</SelectItem>
                                <SelectItem value="7272x2162">7272x2162 (4K)</SelectItem>
                                <SelectItem value="7272x2163">7272x2163 (4K)</SelectItem>
                              </SelectContent>
                          </Select>
                    </div>
  
                
                  </div>

        <div className="grid grid-cols-[5fr_5fr_2fr] gap-4">
          {/* Protocol */}
          <div className="space-y-2">
            <FormLabel text="Protocol" />
            <Select defaultValue="TCP">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TCP">UDP</SelectItem>
                <SelectItem value="UDP2">UDP 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

            {/* FPS */}
            <div className="space-y-2">
            <FormLabel text="Bitrate (Kbps)" />
            <Input
              type="number"
              defaultValue={4096}
              min={64}
              max={100000}
              step={1}
              placeholder="Enter bitrate"
            />
          </div>

          {/* Bitrate */}
          <div className="space-y-2">
            <FormLabel text="VBR" />
            <Select defaultValue="4096">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4096">4096</SelectItem>
                <SelectItem value="4097">4097</SelectItem>
                <SelectItem value="4098">4098</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

              
                </ConfigSection>

       <ConfigSection icon={<Volume2   className="h-4 w-4" />} title="Live Audio">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-4 mt-3">
                              <div className="space-y-0.5">
                                <p className="text-md font-medium  font-roboto text-neutral-700">
                                    Stream Audio
                                </p>
                                <p className="text-fontSize14px text-neutral-600 font-roboto font-normal">
                                    Play audio from device during live viewing
                                </p>
                              </div>

                              <Switch defaultChecked />
                         </div>

                {/* Audio Codec and Input Gain */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                      <FormLabel text="Audio Format" />
                        <Select defaultValue="g711u">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g711a">G.711a (alaw)</SelectItem>
                            <SelectItem value="g711u">G.711u (ulaw)</SelectItem>
                            <SelectItem value="aac">AAC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <FormLabel text="Playback Volume"/>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-roboto font-medium text-neutral-500">
                              <span>0%</span>
                              <span>75%</span>
                              <span>100%</span>
                            </div>
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

                <ConfigSection icon={<Clock  className="h-4 w-4" />} title="Time Settings">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <FormLabel text="Synchronization Method" />
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="sync-method" defaultChecked className="accent-primary" />
                          NTP Server
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="sync-method" className="accent-primary" />
                          Sync with System
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="sync-method" className="accent-primary" />
                          Manual
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border border-slate-200 bg-slate-50 rounded-sm p-2 mt-3">
                            <div className="space-y-2">
                                <FormLabel text="Timezone" />
                              <Select defaultValue="utc-5">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                                  <SelectItem value="utc+0">UTC</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                              <div className="space-y-2">
                                  <FormLabel text="NTP Server Pool" />
                                    <div className="flex gap-2">
                                        <Input value="pool.ntp.org" className="flex-1" />
                                        <Button variant="outline" className="bg-slate-300 font-roboto font-medium rounded-sm text-black">Test Pool</Button>
                                    </div>
                              </div>
                    </div>
                  </div>
                </ConfigSection>

               <ConfigSection icon={<CircleDot className="h-4 w-4" />} title="OSD Settings">
                <div className="space-y-4">
                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-2 gap-4">
                   <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-bglightblue hover:bg-muted/50 transition-colors">
                    <Checkbox
                      defaultChecked
                      className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm font-medium">OSD Channel Name</span>
                  </label>

                    <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-bglightblue hover:bg-muted/50 transition-colors">
                      <Checkbox defaultChecked 
                       className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                       />
                      <span className="text-sm font-medium">OSD Timestamp</span>
                    </label>
                  </div>
                  
                  {/* Custom Overlay Text */}
                  <div className="space-y-2">
                      <FormLabel text="Live View Meta Text" />
                      <Input placeholder="e.g. ZONE-1 Security" className="max-w-md" />
                  </div>
                  
                  {/* Fetch Link */}
                  <button className="flex items-center gap-2 font-roboto text-sm font-medium text-blue-700">
                    <RefreshCw className="h-4 w-4" />
                     Fetch OSD from Device
                  </button>
                </div>
              </ConfigSection>


                <ConfigSection icon={<SettingIcons  className="h-4 w-4" />} title="Other Settings">
                      <div className="space-y-4">
                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-between gap-3 p-2 border rounded-sm cursor-pointer  hover:bg-muted/50 transition-colors shadow-sm">
                      <div className="flex gap-2">
                            <RefreshCw className="h-5 w-5 text-muted-foreground" />
                            <span className="font-roboto text-sm font-medium">Live Edge Sync</span>
                      </div>
                 
                      <Checkbox
                        defaultChecked
                        className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                  </label>

                    <label className="flex items-center  justify-between gap-3 p-2 border rounded-sm  cursor-pointer  hover:bg-muted/50 transition-colors shadow-sm">
                       <div className="flex gap-2">
                          <RefreshCw className="h-5 w-5 text-muted-foreground" />
                          <span className="font-roboto text-sm font-medium">Stream Encryption</span>
                       </div>
                      <Checkbox defaultChecked 
                      className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </label>
                  </div>
          </div>
                       <Button
                          variant="outline"
                          className="
                            w-full
                            border-red-300
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            hover:text-red-700
                            hover:border-red-400
                            font-roboto
                            font-medium
                          "
                        >
                          <DisconnectIcon  className="h-4 w-4" />
                            Force Disconnect Active Viewers
                        </Button>
                         <p className="text-sm text-center text-slate-700">
                              Clears all RTSP/HTTP sessions from hardware.
                          </p>
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
