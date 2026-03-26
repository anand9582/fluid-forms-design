import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Video, Volume2, Ban, Clock, RefreshCw, CircleDot, Info, Mail, Smartphone, Webhook, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Check } from "lucide-react";
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

import { API_VAISHALI_URL, getAuthHeaders } from "@/components/Config/api";
import axios from "axios";


interface RecordingProps {
  deviceId?: string | number;
}

export default function RecordingPage({ deviceId }: RecordingProps) {
  const form = useForm({
    defaultValues: {
      streamUri: "",
      protocol: "rtsp",
      profile: "MAIN",
      videoCodec: "H265",
      resolution: "1920x1080",
      fps: "25",
      bitrate: "2048",
      audioCodec: "PCMU",
      syncMethod: "ntp",
      timezone: "utc-5",
      ntpPool: "pool.ntp.org",
      systemTime: "",
      showDeviceName: true,
      showTimestamp: true,
      customOverlayText: "",
      osdTimestampValue: "",
      recordingFormat: "fmp4",
      recordingMode: "continuous",
      chunkSize: "15",
      retentionPolicy: "standard",
      retentionPolicyName: "",
    },
  });

  const [systemTimeResult, setSystemTimeResult] = useState<string | null>(null);
  const syncMethod = form.watch("syncMethod");

  const handleSyncWithSystem = async () => {
    console.log("DEBUG: Syncing with system time (Recording)...");
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/system-time`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: System Time API Response (Recording):", response.data);

      if (response.data?.success && response.data?.data) {
        const timeData = response.data.data.localDateTime;
        const formattedTime = `${timeData.year}-${String(timeData.month).padStart(2, '0')}-${String(timeData.day).padStart(2, '0')} ${String(timeData.hour).padStart(2, '0')}:${String(timeData.minute).padStart(2, '0')}:${String(timeData.second).padStart(2, '0')}`;

        form.setValue("systemTime", formattedTime);
        setSystemTimeResult(formattedTime);
        // toast.success(response.data.message || "System time fetched successfully while using sync");
      }
    } catch (error) {
      console.error("DEBUG: Error syncing with system time (Recording):", error);
      toast.error("Failed to fetch system time");
    }
  };

  const fetchOSDSettings = async () => {
    const idToFetch = deviceId || 2;
    console.log(`DEBUG: Fetching OSD settings for ID: ${idToFetch}`);
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/get-osds/${idToFetch}`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: OSD API Response:", response.data);

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

  const fetchRecordingConfig = async () => {
    const idToFetch = deviceId || 2;
    console.log("idToFetch", idToFetch);
    console.log(`DEBUG: Fetching Recording config for ID: ${idToFetch}`);
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/device/recording-config/${idToFetch}`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: Recording Config API Response:", response.data);

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;

        let format = "fmp4";
        if (data.recordingFileType === ".ts") format = "ts";
        else if (data.recordingFileType === ".mkv") format = "mkv";

        form.setValue("recordingFormat", format);
        form.setValue("recordingMode", data.recordingMode?.toLowerCase() || "continuous");
        form.setValue("chunkSize", String(Math.floor((data.segmentDuration || 900) / 60)));
      }
    } catch (error) {
      console.error("DEBUG: Error fetching recording config:", error);
    }
  };

  const fetchRetentionPolicy = async () => {
    const idToFetch = deviceId || 3;
    console.log(`DEBUG: Fetching Retention Policy for ID: ${idToFetch}`);
    try {
      const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/retention-policy/${idToFetch}`, {
        headers: getAuthHeaders()
      });

      console.log("DEBUG: Retention Policy API Response:", response.data);

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        form.setValue("retentionPolicyName", data.policyName || "");
        // Map any valid policy name directly to the form's retentionPolicy field
        if (data.policyName) {
          form.setValue("retentionPolicy", data.policyName);
        }
      }
    } catch (error) {
      console.error("DEBUG: Error fetching retention policy:", error);
    }
  };

  useEffect(() => {
    if (syncMethod === "sync-with-system") {
      handleSyncWithSystem();
    }
  }, [syncMethod]);

  useEffect(() => {
    const idToFetch = deviceId || 1;
    const streamType = "MAIN";

    const fetchStreamInfo = async () => {
      console.log(`DEBUG: Fetching stream info for ID: ${idToFetch}, stream: ${streamType}`);
      try {
        const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/get-stream-info/${idToFetch}?streamType=${streamType}`, {
          headers: getAuthHeaders()
        });

        console.log("DEBUG: Stream Info API Response:", response.data);

        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          form.reset({
            ...form.getValues(),
            streamUri: data.streamUrl || "",
            protocol: (data.protocol || "rtsp").toLowerCase(),
            profile: data.profileType || "MAIN",
            videoCodec: (data.videoCodec || "H265").toUpperCase(),
            resolution: data.resolution || "1920x1080",
            fps: String(data.fps || "25"),
            bitrate: String(data.bitrate || "2048"),
            audioCodec: data.audioCodec || "PCMU",
          });
        }
      } catch (error) {
        console.error("Error fetching stream info:", error);
      }
    };

    const fetchAllData = async () => {
      await fetchStreamInfo();
      await fetchOSDSettings();
      await fetchRecordingConfig();
      await fetchRetentionPolicy();
    };

    fetchAllData();
  }, [deviceId, form]);

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
    <Form {...form}>
      <TabsContent value="recording" className="space-y-4 mt-0">
        <ConfigSection icon={<Video className="h-4 w-4" />} title="Device Stream Settings" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="streamUri"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-1">
                  <FormLabel text="Stream URI" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Stream Over */}
            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm text-muted-foreground">Stream Over</label>
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
                  <label className="text-sm text-muted-foreground">Profile</label>
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
                  <label className="text-sm text-muted-foreground">Codec</label>
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
                  <label className="text-sm text-muted-foreground">Resolution</label>
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

            {/* FPS */}
            <FormField
              control={form.control}
              name="fps"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm text-muted-foreground">FPS</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Bitrate (Kbps) */}
            <FormField
              control={form.control}
              name="bitrate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm text-muted-foreground">Bitrate (Kbps)</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1024">1024</SelectItem>
                      <SelectItem value="2048">2048</SelectItem>
                      <SelectItem value="4096">4096</SelectItem>
                      <SelectItem value="8192">8192</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </ConfigSection>

        <ConfigSection icon={<Volume2 className="h-4 w-4" />} title="Audio Settings">
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
              <FormField
                control={form.control}
                name="audioCodec"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel text="Audio Codec" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PCMU">PCMU</SelectItem>
                        <SelectItem value="PCMA">PCMA</SelectItem>
                        <SelectItem value="AAC">AAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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
                      <ShieldCheck className="h-4 w-4" />
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
                  checked={form.watch("showDeviceName")}
                  onCheckedChange={(checked) => form.setValue("showDeviceName", !!checked)}
                  className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-medium">Show Device Name</span>
              </label>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-2 border rounded-sm cursor-pointer bg-bglightblue hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={form.watch("showTimestamp")}
                    onCheckedChange={(checked) => form.setValue("showTimestamp", !!checked)}
                    className="h-4 w-4 rounded border  border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-medium">Show Timestamp</span>
                </label>

              </div>
            </div>

            {/* Custom Overlay Text */}
            <div className="flex items-end gap-4 flex-nowrap">
              <FormField
                control={form.control}
                name="customOverlayText"
                render={({ field }) => (
                  <FormItem className="space-y-2 w-[50%]">
                    <FormLabel text="Custom Overlay Text" />
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

              {form.watch("showTimestamp") && form.watch("osdTimestampValue") && (
                <div className="w-[50%]">
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
              Fetch OSD settings from Device
            </button>
          </div>
        </ConfigSection>


        <ConfigSection icon={<RecordingIcons className="h-4 w-4" />} title="Recording Mode">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel text="Recording Format" />
                <Select
                  value={form.watch("recordingFormat")}
                  onValueChange={(v) => form.setValue("recordingFormat", v)}
                >
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
                <label className="text-sm font-roboto font-medium text-[#111827]">Capture Strategy</label>
                <Select
                  value={form.watch("recordingMode")}
                  onValueChange={(v) => form.setValue("recordingMode", v)}
                >
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
              <label className="text-sm font-roboto font-medium text-[#111827]">Chunk Size (Minutes)</label>
              <Input {...form.register("chunkSize")} className="w-50" />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-tex text-blue-600 bg-blue-50 border border-blue-200 text-sm">
              <Info className="h-4 w-4 shrink-0 mr-4" />
              <span>Segmented recording helps ensure data integrity by dividing files periodically. In the event of sudden power loss, only the last segment would be affected.</span>
            </div>
          </div>
        </ConfigSection>

        <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Recording Retention">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-roboto font-normal text-muted-foreground">
                  Active Retention Mapping
                </p>
                <p className="text-sm font-medium font-roboto mt-0">
                  {form.watch("retentionPolicyName") || "Primary Array A → Volume 1"}
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
                <Select
                  value={form.watch("retentionPolicy")}
                  onValueChange={(v) => form.setValue("retentionPolicy", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard 30-Day Rollover</SelectItem>
                    <SelectItem value="extended">Extended 90-Day</SelectItem>
                    <SelectItem value="Default Retention Policy">Default Retention Policy</SelectItem>
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

        {/* <ConfigSection icon={<SettingIcons className="h-4 w-4" />} title="Other Settings">
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
            <Ban className="h-4 w-4" />
            Force Stop Recording
          </Button>
          <p className="text-sm text-center text-slate-700">
            Stops all active recordings on this device. Recording can be resumed at any time.
          </p>
        </ConfigSection> */}

        {/* <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
          <AlertsTable
            alerts={alerts}
            setAlerts={setAlerts}
            channels={CHANNELS}
          />
        </ConfigSection> */}
      </TabsContent>
    </Form>
  );
}
