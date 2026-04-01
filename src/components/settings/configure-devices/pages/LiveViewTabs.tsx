import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Monitor, Video, Volume2, Clock, RefreshCw, CircleDot, Mail, Smartphone, Webhook, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/ui/FormLabel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertsTable } from "@/components/Common/AlertsTable";
import { ConfigSection } from "@/components/Common/ConfigSection";
import { API_VAISHALI_URL, getAuthHeaders } from "@/components/Config/api";
import { toast } from "sonner";

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
  DisconnectIcon
} from "@/components/Icons/Svg/liveViewIcons";

interface LiveViewTabsProps {
  deviceId?: string | number;
}

export default function LiveViewTabs({ deviceId }: LiveViewTabsProps) {
  const [systemTimeResult, setSystemTimeResult] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      streamUri: "",
      protocol: "rtsp",
      profile: "MAIN",
      videoCodec: "H264",
      resolution: "1920x1080",
      fps: "25",
      bitrate: "2048",
      audioCodec: "PCMU",
      syncMethod: "ntp",
      timezone: "utc-5",
      ntpPool: "pool.ntp.org",
      systemTime: "",
      showChannelName: true,
      showTimestamp: true,
      customOverlayText: "",
      osdTimestampValue: "",
    },
  });

  const syncMethod = form.watch("syncMethod");

  const handleSyncWithSystem = async () => {
    console.log("DEBUG: Syncing with system time...");
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/system-time`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: System Time API Response:", response.data);

      if (response.data?.success && response.data?.data) {
        const timeData = response.data.data.localDateTime;
        const formattedTime = `${timeData.year}-${String(timeData.month).padStart(2, '0')}-${String(timeData.day).padStart(2, '0')} ${String(timeData.hour).padStart(2, '0')}:${String(timeData.minute).padStart(2, '0')}:${String(timeData.second).padStart(2, '0')}`;

        form.setValue("systemTime", formattedTime);
        setSystemTimeResult(formattedTime);
        toast.success(response.data.message || "System time fetched successfully while using sync");
      }
    } catch (error) {
      console.error("DEBUG: Error syncing with system time:", error);
      toast.error("Failed to fetch system time");
    }
  };

  const fetchOSDSettings = async () => {
    const idToFetch = deviceId || 2;
    console.log(`DEBUG: Fetching LiveView OSD settings for ID: ${idToFetch}`);
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/get-osds/${idToFetch}`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: LiveView OSD API Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data)) {
        const osds = response.data.data;
        const dateTimeOsd = osds.find((o: any) => o.textType === "DateAndTime");
        const plainOsd = osds.find((o: any) => o.textType === "Plain");

        if (dateTimeOsd) {
          form.setValue("showTimestamp", true);
          const timestampFormat = `${dateTimeOsd.dateFormat || ""} ${dateTimeOsd.timeFormat || ""}`.trim();
          form.setValue("osdTimestampValue", timestampFormat);
        } else {
          form.setValue("showTimestamp", false);
          form.setValue("osdTimestampValue", "");
        }

        if (plainOsd) {
          form.setValue("customOverlayText", plainOsd.plainText || "");
        }

        // toast.success("OSD settings fetched successfully");
      }
    } catch (error) {
      console.error("DEBUG: Error fetching OSD settings:", error);
      toast.error("Failed to fetch OSD settings");
    }
  };

  useEffect(() => {
    if (syncMethod === "sync-with-system") {
      handleSyncWithSystem();
    }
  }, [syncMethod]);

  useEffect(() => {
    fetchOSDSettings();

    // Hardcoding id 1 and stream=MAIN for now as per user request for stream info testing
    const idToFetch = deviceId || 1;
    const streamType = "MAIN";

    const fetchStreamInfo = async () => {
      console.log(`DEBUG: Fetching live stream info for ID: ${idToFetch}`);
      try {
        const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/get-stream-info/${idToFetch}?streamType=${streamType}`, {
          headers: getAuthHeaders()
        });

        console.log("DEBUG: Live Stream API Response:", response.data);

        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          form.reset({
            ...form.getValues(),
            streamUri: data.streamUrl || "",
            protocol: data.protocol?.toLowerCase() || "rtsp",
            profile: data.profileType || "MAIN",
            videoCodec: data.videoCodec || "H264",
            resolution: data.resolution || "1920x1080",
            fps: String(data.fps || "25"),
            bitrate: String(data.bitrate || "2048"),
            audioCodec: data.audioCodec || "PCMU",
          });
        }
      } catch (error) {
        console.error("DEBUG: Error fetching live stream info:", error);
      }
    };

    fetchStreamInfo();
  }, [deviceId, form]);

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
    <Form {...form}>
      <div className="space-y-4 mt-0">
        <ConfigSection icon={<Video className="h-4 w-4" />} title="Device Stream Settings" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="streamUri"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-1">
                  <FormLabel text="Live Stream URI" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel text="Protocol" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="rtsp">RTSP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Profile */}
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel text="Profile" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MAIN">Main Stream</SelectItem>
                      <SelectItem value="SUB">Sub Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Codec */}
            <FormField
              control={form.control}
              name="videoCodec"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel text="Codec" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="H264">H.264</SelectItem>
                      <SelectItem value="H265">H.265</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Resolution */}
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel text="Resolution" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                      <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-[5fr_5fr_2fr] gap-4">
            {/* Bitrate */}
            <FormField
              control={form.control}
              name="bitrate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel text="Bitrate (Kbps)" />
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={64}
                      max={100000}
                      step={1}
                      placeholder="Enter bitrate"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FPS */}
            <div className="space-y-2">
              <FormLabel text="FPS" />
              <Input
                type="number"
                defaultValue={25}
                min={1}
                max={60}
                step={1}
                placeholder="Enter FPS"
              />
            </div>

            {/* VBR */}
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

        <ConfigSection icon={<Volume2 className="h-4 w-4" />} title="Live Audio">
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
              <FormField
                control={form.control}
                name="audioCodec"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel text="Audio Format" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PCMU">PCMU </SelectItem>
                        <SelectItem value="PCMA">PCMA (G.711a)</SelectItem>
                        <SelectItem value="AAC">AAC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel text="Playback Volume" />
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

        <ConfigSection icon={<Clock className="h-4 w-4" />} title="Time Settings">
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel text="Synchronization Method" />
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    value="ntp"
                    {...form.register("syncMethod")}
                    className="accent-primary"
                  />
                  NTP Server
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    value="sync-with-system"
                    {...form.register("syncMethod")}
                    className="accent-primary"
                  />
                  Sync with System
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    value="manual"
                    {...form.register("syncMethod")}
                    className="accent-primary"
                  />
                  Manual
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border border-slate-200 bg-slate-50 rounded-sm p-4 mt-3">
              <div className="space-y-2">
                {syncMethod === "sync-with-system" ? (
                  <>
                    <FormLabel text="System Local Time" />
                    {systemTimeResult && (
                      <div className="mb-2">
                        <Input value={systemTimeResult} readOnly className="bg-slate-100 border-slate-300 h-9" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <FormLabel text="Timezone" />
                    <Select
                      value={form.watch("timezone")}
                      onValueChange={(v) => form.setValue("timezone", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <div className="space-y-2">
                {syncMethod === "ntp" ? (
                  <>
                    <FormLabel text="NTP Server Pool" />
                    <div className="flex gap-2">
                      <Input {...form.register("ntpPool")} className="flex-1" />
                      <Button variant="outline" className="bg-slate-300 font-roboto font-medium rounded-sm text-black">Test Pool</Button>
                    </div>
                  </>
                ) : syncMethod === "sync-with-system" ? (
                  <div className="h-full flex flex-col justify-end">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-sm text-[#166534] font-medium text-sm h-10">
                      <Check className="h-4 w-4" />
                      Synchronized with VMS host clock.
                    </div>
                  </div>
                ) : (
                  <>
                    <FormLabel text="Manual Time" />
                    <Input type="datetime-local" className="flex-1" />
                  </>
                )}
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
                  checked={form.watch("showChannelName")}
                  onCheckedChange={(checked) => form.setValue("showChannelName", !!checked)}
                  className="h-4 w-4 rounded border border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-medium">OSD Channel Name</span>
              </label>

              <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-bglightblue hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={form.watch("showTimestamp")}
                  onCheckedChange={(checked) => form.setValue("showTimestamp", !!checked)}
                  className="h-4 w-4 rounded border border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-medium">OSD Timestamp</span>
              </label>
            </div>

            {/* Inputs Row */}
            <div className="flex items-end gap-4 flex-nowrap">
              {/* Custom Overlay */}
              <FormField
                control={form.control}
                name="customOverlayText"
                render={({ field }) => (
                  <FormItem className="space-y-2 w-[50%]">
                    <FormLabel text="Live View Meta Text" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. ZONE-1 Security"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timestamp Preview */}
              {form.watch("showTimestamp") && form.watch("osdTimestampValue") && (
                <div className="w-[50%]">
                  <FormLabel text="Timestamp Preview" />
                  <Input
                    value={form.watch("osdTimestampValue")}
                    readOnly
                    className="h-10 bg-slate-50 text-xs text-muted-foreground border-slate-200 w-full"
                  />
                </div>
              )}
            </div>

            {/* Fetch Link */}
            <button
              onClick={(e) => {
                e.preventDefault();
                fetchOSDSettings();
              }}
              className="flex items-center gap-2 font-roboto text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Fetch OSD from Device
            </button>
          </div>
        </ConfigSection>

        {/* 
        <ConfigSection icon={<SettingIcons className="h-4 w-4" />} title="Other Settings">
          <div className="space-y-4">
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
            <DisconnectIcon className="h-4 w-4" />
            Force Disconnect Active Viewers
          </Button>
          <p className="text-sm text-center text-slate-700">
            Clears all RTSP/HTTP sessions from hardware.
          </p>
        </ConfigSection> */}

        {/* <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
          <AlertsTable
            alerts={alerts}
            setAlerts={setAlerts}
            channels={CHANNELS}
          />
        </ConfigSection> */}

      </div>
    </Form>
  );
}
