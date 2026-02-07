import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor,Video,Volume2,Ban,Clock,RefreshCw,CircleDot, Info,Mail,Smartphone,Webhook} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { AlertsTable } from "@/components/Common/AlertsTable";
import { ConfigSection } from "@/components/Common/ConfigSection";

import {
    RecordingIcons,
    AlertIcons,
    SettingIcons
  } from "@/components/Icons/Svg/RecordingIcons";


  export default function RecordingPage() {
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
      id: "recording-aborted",
      name: "Recording Aborted",
      enabled: true,
      channels: {
        mail: true,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "recording-connect",
      name: "Recording Connected",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "recording-stopped",
      name: "Recording Stopped",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: true,
      },
    },
    {
      id: "storage-full",
      name: "Storage Full",
      enabled: false,
      channels: {
         mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
      {
      id: "disk-read",
      name: "Disk Read Error",
      enabled: false,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
     {
      id: "write-speed",
      name: "Write Speed Low",
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
       <TabsContent value="recording" className="space-y-4 mt-0">
                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Device Stream Settings" defaultOpen>
                    <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-1">
                              <FormLabel text="Stream URI" />
                              <Input value="rtsp://192.168.10.101:554/live/main" />
                          </div>
                      </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Stream Over */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Stream Over</label>
                        <Select defaultValue="TCP">
                          <SelectTrigger>
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TCP">TCP</SelectItem>
                            <SelectItem value="sub">Sub Stream</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Codec */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Profile</label>
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
                      <label className="text-sm text-muted-foreground">Codec</label>
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
                      <label className="text-sm text-muted-foreground">Resolution</label>
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
  
                  {/* FPS */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">FPS</label>
                        <Select defaultValue="30">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="31">31</SelectItem>
                              <SelectItem value="32">32</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bitrate (Kbps) */}
                      <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Bitrate (Kbps)</label>
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

                <ConfigSection icon={<Volume2   className="h-4 w-4" />} title="Audio Settings">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-4 mt-3">
                              <div className="space-y-0.5">
                                <p className="text-md font-medium  font-roboto text-neutral-700">
                                    Enable Microphone / Audio In
                                </p>
                                <p className="text-xs text-neutral-600 font-roboto font-normal">
                                  Capture audio stream alongside video.
                                </p>
                              </div>

                              <Switch defaultChecked />
                         </div>

                {/* Audio Codec and Input Gain */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                      <FormLabel text="Audio Codec" />
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
                        <FormLabel text="Input Gain" />
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
                    <div className="grid grid-cols-2 gap-4 border border-slate-200 bg-bglightblue rounded-sm p-2 mt-3">
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
                    <span className="text-sm font-medium">Show Device Name</span>
                  </label>

                    <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-bglightblue hover:bg-muted/50 transition-colors">
                      <Checkbox defaultChecked 
                       className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                       />
                      <span className="text-sm font-medium">Show Timestamp</span>
                    </label>
                  </div>
                  
                  {/* Custom Overlay Text */}
                  <div className="space-y-2">
                      <FormLabel text="Custom Overlay Text" />
                      <Input placeholder="e.g. ZONE-1 Security" className="max-w-md" />
                  </div>
                  
                  {/* Fetch Link */}
                  <button className="flex items-center gap-2 font-roboto text-sm font-medium text-blue-700">
                    <RefreshCw className="h-4 w-4" />
                        Fetch OSD settings from Device
                  </button>
                </div>
              </ConfigSection>


                <ConfigSection icon={<RecordingIcons   className="h-4 w-4" />} title="Recording Mode">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <FormLabel text="Recording Format" />
                          <Select defaultValue="fmp4">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fmp4">Fragmented MP4 (.mp4)</SelectItem>
                                <SelectItem value="mkv">Matroska (.mkv)</SelectItem>
                                <SelectItem value="ts">Transport Stream (.ts)</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Capture Strategy</label>
                        <Select defaultValue="continuous">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="continuous">Continuous Recording</SelectItem>
                            <SelectItem value="motion">Motion-based</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Chunk Size (Minutes)</label>
                      <Input value="15" className="w-50" />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-tex text-blue-600 bg-blue-50 border border-blue-200 text-sm">
                      <Info className="h-4 w-4 shrink-0 mr-4" />
                      <span>Segmented recording helps ensure data integrity by dividing files periodically. In the event of sudden power loss, only the last segment would be affected.</span>
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<AlertIcons  className="h-4 w-4" />} title="Recording Retention">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-sm font-roboto font-normal text-muted-foreground">
                              Active Retention Mapping
                            </p>
                        <p className="text-sm font-medium font-roboto mt-0">
                          Primary Array A → Volume 1
                          </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-roboto font-normal text-muted-foreground">
                                Days Until Remove
                        </p>
                        <p className="text-sm font-medium font-roboto mt-0">Deleting data older than <span className="text-primary font-medium cursor-pointer">30 days</span>.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                           <FormLabel text="Retention Policy" />
                        <Select defaultValue="standard">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard 30-Day Rollover</SelectItem>
                            <SelectItem value="extended">Extended 90-Day</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                         <FormLabel text="Volume Utilization" />
                        <div className="space-y-1">
                            <div className="flex justify-between font-roboto font-medium text-xs text-muted-foreground">
                                <span>Used: 14.50 TB</span>
                                <span>Total: 500 TB</span>
                            </div>
                          <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full" />
                          </div>
                      
                        </div>
                      </div>
                    </div>
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
                          <Ban className="h-4 w-4" />
                          Force Stop Recording
                        </Button>
                         <p className="text-sm text-center text-slate-700">
                                  Stops all active recordings on this device. Recording can be resumed at any time.
                          </p>
                </ConfigSection>

              <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
                <AlertsTable
                            alerts={alerts}
                            setAlerts={setAlerts}
                            channels={CHANNELS}
                        />
            </ConfigSection>

      </TabsContent>
  );
}
