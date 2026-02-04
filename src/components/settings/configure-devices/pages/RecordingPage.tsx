import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video,Volume,AlertCircle, Bell, RefreshCw, Info,ChevronDown,Mail,Smartphone,MonitorSmartphone,Webhook} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card,CardHeader,CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

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
        <div className="px-4 pb-4 pt-2 space-y-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function RecordingPage() {
  const form = useForm({
  defaultValues: {
    deviceMake: "axis",
    model: "DS-2CD2043G2-I",
    logicalGroup: "HQ / Floor 1",
    deviceCategory: "Camera",
  },
});

  return (
       <TabsContent value="recording" className="space-y-4 mt-0">
                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Device Stream Settings" defaultOpen>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Stream URL</label>
                      <Input value="rtsp://192.168.10.101:554/live/main" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Stream Type</label>
                        <Select defaultValue="tcp">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="udp">UDP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Profile</label>
                        <Select defaultValue="main">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main Stream</SelectItem>
                            <SelectItem value="sub">Sub Stream</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Codec</label>
                        <Select defaultValue="h264">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h264">H.264</SelectItem>
                            <SelectItem value="h265">H.265</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Resolution</label>
                        <Select defaultValue="1080p">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4k">3840x2160 (4K)</SelectItem>
                            <SelectItem value="1080p">1920x1080 (FHD)</SelectItem>
                            <SelectItem value="720p">1280x720 (HD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">FPS</label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 FPS</SelectItem>
                            <SelectItem value="25">25 FPS</SelectItem>
                            <SelectItem value="30">30 FPS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Bitrate (kbps)</label>
                        <Input value="4096" />
                      </div>
                    </div>
                  </div>
                </ConfigSection>
                
                <ConfigSection icon={<Volume  className="h-4 w-4" />} title="Audio Settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Enable Microphone / Audio In</p>
                        <p className="text-xs text-muted-foreground">Captures audio in-feed alongside video.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Audio Codec</label>
                        <Select defaultValue="g711a">
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
                     <div className="space-y-3">
                              <label className="text-sm font-medium">Input Gain</label>

                              {/* Percentage labels */}
                              <div className="relative">
                                <span className="absolute left-0 -top-5 text-xs text-muted-foreground">0%</span>
                                <span className="absolute left-1/2 -translate-x-1/2 -top-5 text-xs text-muted-foreground">
                                  75%
                                </span>
                                <span className="absolute right-0 -top-5 text-xs text-muted-foreground">100%</span>

                                {/* Slider */}
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  defaultValue={75}
                                  className="w-full h-2 appearance-none rounded-full bg-muted accent-blue-600"
                                  style={{
                                    background: `linear-gradient(
                                      to right,
                                      rgb(37 99 235) 75%,
                                      rgb(229 231 235) 75%
                                    )`,
                                  }}
                                />
                              </div>
                            </div>

                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Time Settings">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Synchronization Method</label>
                      <div className="flex items-center gap-6">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Timezone</label>
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
                        <label className="text-sm text-muted-foreground">NTP Server Pool</label>
                        <div className="flex gap-2">
                          <Input value="pool.ntp.org" className="flex-1" />
                          <Button variant="outline">Test Pool</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Video  className="h-4 w-4" />} title="OSD Settings">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="accent-primary rounded" />
                        Show Device Name
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="accent-primary rounded" />
                        Show Timestamp
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Custom Overlay Text</label>
                      <Input placeholder='e.g., "ZONE 1 Security"' />
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Fetch OSD Settings from Device
                    </Button>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Recording Mode">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Recording Format</label>
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
                      <Input value="15" className="w-32" />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-600 text-sm">
                      <Info className="h-4 w-4 shrink-0" />
                      <span>Segmented recording helps ensure data integrity by dividing files periodically. In the event of sudden power loss, only the last segment would be affected.</span>
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Recording Retention">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Active Retention Mapping</label>
                        <p className="text-sm font-medium">Primary Array A → Volume 1</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Data Lifecycle</label>
                        <p className="text-sm">Deleting data older than <span className="text-primary font-medium cursor-pointer">14 days</span>.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Retention Policy</label>
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
                        <label className="text-sm text-muted-foreground">Volume Utilization</label>
                        <div className="space-y-1">
                          <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full" />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Used: 1.43 TB</span>
                            <span>Total: 500 TB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Video  className="h-4 w-4" />} title="Other Settings">
                  <div className="space-y-4">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <Switch />
                        <span className="text-sm">Live Edge Sync</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch />
                        <span className="text-sm">Stream Encryption</span>
                      </div>
                    </div>
                    <Button variant="destructive" className="w-full">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Force Stop Recording
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Stops all active recordings on this device. Recording can be resumed at any time.
                    </p>
                  </div>
                </ConfigSection>

                <ConfigSection icon={<Bell className="h-4 w-4" />} title="Recording Module Alerts">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[1fr_100px_1fr] gap-4 px-4 py-3 bg-muted/30 border-b text-sm font-medium text-muted-foreground">
                      <span>Alert Trigger</span>
                      <span className="text-center">Enabled</span>
                      <span>Notification Channels</span>
                    </div>
                    {[
                      { id: "recording-aborted", name: "Recording Aborted", enabled: true },
                      { id: "recording-connected", name: "Recording Connected", enabled: true },
                      { id: "recording-stopped", name: "Recording Stopped", enabled: true },
                      { id: "storage-full", name: "Storage Full", enabled: false },
                      { id: "disk-read-error", name: "Disk Read Error", enabled: false },
                      { id: "write-speed-low", name: "Write Speed Low", enabled: false },
                    ].map((alert, index, arr) => (
                      <div 
                        key={alert.id}
                        className={cn(
                          "grid grid-cols-[1fr_100px_1fr] gap-4 px-4 py-3 items-center",
                          index !== arr.length - 1 && "border-b"
                        )}
                      >
                        <span className="text-sm">{alert.name}</span>
                        <div className="flex justify-center">
                          <Switch defaultChecked={alert.enabled} />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className={cn("h-8 w-8", alert.enabled && "text-primary border-primary/30 bg-primary/5")}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className={cn("h-8 w-8", alert.enabled && "text-primary border-primary/30 bg-primary/5")}>
                            <Smartphone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className={cn("h-8 w-8", alert.enabled && "text-primary border-primary/30 bg-primary/5")}>
                            <MonitorSmartphone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className={cn("h-8 w-8", alert.enabled && "text-primary border-primary/30 bg-primary/5")}>
                            <Webhook className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ConfigSection>
      </TabsContent>
  );
}
