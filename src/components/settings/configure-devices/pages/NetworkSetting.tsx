import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Wifi, Shield, Lock, Info, Mail, Smartphone, Webhook } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { ConfigSection } from "@/components/Common/ConfigSection";
import { AlertsTable } from "@/components/Common/AlertsTable";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertIcons,
} from "@/components/Icons/Svg/RecordingIcons";
import { API_VAISHALI_URL, getAuthHeaders } from "@/components/Config/api";
import axios from "axios";


interface NetworkSettingProps {
  deviceId?: string | number;
}

export default function NetworkSetting({ deviceId }: NetworkSettingProps) {
  const form = useForm({
    defaultValues: {
      deviceMake: "",
      model: "",
      logicalGroup: "",
      deviceCategory: "",
      ipAddress: "",
      port: "",
      protocol: "rtsp",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // Hardcoding 6 as per user request for testing, ignoring deviceId guard for now
    const idToFetch = deviceId || 1;

    const fetchDeviceInfo = async () => {
      console.log(`DEBUG: Fetching device info for ID: ${idToFetch}`);
      try {
        const response = await axios.get(`${API_VAISHALI_URL}/v1/devices/get-device-info/${idToFetch}`, {
          headers: getAuthHeaders()
        });

        console.log("DEBUG: API Response:", response.data);

        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          form.reset({
            deviceMake: data.make || "",
            model: data.model || "",
            logicalGroup: data.group || "",
            deviceCategory: data.deviceCategory || "",
            ipAddress: data.ipAddress || "",
            port: String(data.port || ""),
            protocol: (data.protocol || "rtsp").toLowerCase(),
            username: data.username || "",
            password: data.password || "",
          });
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, [deviceId, form]);

  const [alerts, setAlerts] = useState([
    {
      id: "connection-lost",
      name: "Connection Lost",
      enabled: true,
      channels: {
        mail: true,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "Ip-conflict",
      name: "IP Conflict",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    },
    {
      id: "Authentication-failure",
      name: "Authentication Failure",
      enabled: true,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: true,
      },
    },
    {
      id: "packet-loss",
      name: "Packet Loss High",
      enabled: false,
      channels: {
        mail: false,
        sms: true,
        desktop: false,
        webhook: false,
      },
    }
  ]);

  const CHANNELS = [
    { key: "mail", icon: Mail },
    { key: "sms", icon: Smartphone },
    { key: "desktop", icon: Monitor },
    { key: "webhook", icon: Webhook },
  ];




  return (
    <Form {...form}>
      <div className="space-y-4">
        <ConfigSection
          icon={<Monitor className="h-4 w-4" />}
          title="Device Identification"
          defaultOpen
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Device Make */}
            <FormField
              control={form.control}
              name="deviceMake"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Device Make" />
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model Identifier (read-only) */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Model Identifier" />
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted/50" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Logical Group */}
            <FormField
              control={form.control}
              name="logicalGroup"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Logical Group" />
                  <FormControl>
                    <Input {...field} className="bg-muted/50" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Device Category (read-only) */}
            <FormField
              control={form.control}
              name="deviceCategory"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Device Category" />
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted/50" />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>
        </ConfigSection>

        {/* Network Configuration */}
        <ConfigSection
          icon={<Wifi className="h-4 w-4" />}
          title="Connectivity and Network Configuration"
        >
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="IP Address" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Port" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Protocol" />
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rtsp">RTSP</SelectItem>
                        <SelectItem value="onvif">ONVIF</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start gap-2 p-3 mt-2 rounded-md bg-amber-50 border border-amber-200">
            <Info className="w-4 h-4 text-amber-600" />
            <p className="text-xs  text-amber-600 font-roboto font-normal">
              Connectivity Warning: Changing IP address or ports may cause a temporary loss of video signal while the system re-initializes.
            </p>
          </div>
        </ConfigSection>

        {/* Credentials */}
        <ConfigSection
          icon={<Shield className="h-4 w-4" />}
          title="Authentication and Credentials"
          defaultOpen
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Username" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel text="Password" />
                  <FormControl>
                    <div className="relative">
                      <Input type="password" {...field} />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-start gap-2 p-3 mt-2 rounded-md bg-blue-50 border border-blue-200">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-xs  text-blue-600 font-roboto font-normal">
              Credentials are verified against the local device database Ensure the provided Credentials match the hardware configuration.
            </p>
          </div>

        </ConfigSection>

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
