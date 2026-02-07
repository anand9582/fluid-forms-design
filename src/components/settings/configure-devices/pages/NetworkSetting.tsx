import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Wifi, Shield,Lock, Info,Mail,Smartphone,Webhook} from "lucide-react";
import { useState } from "react";
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


export default function NetworkSetting() {
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger> 
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="axis">Axis</SelectItem>
                      <SelectItem value="hikvision">Hikvision</SelectItem>
                      <SelectItem value="dahua">Dahua</SelectItem>
                  </SelectContent>
                </Select>
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
          <div className="space-y-1">
             <FormLabel text="IP Address" />
            <Input value="192.168.1.101" />
          </div>

          <div className="space-y-1">
               <FormLabel text="Port" />
               <Input value="554" />
          </div>

          <div className="space-y-1">
             <FormLabel text="Protocol" />
            <Select defaultValue="rtsp">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rtsp">RTSP</SelectItem>
                  <SelectItem value="onvif">ONVIF</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
          </div>

       
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
              <div className="space-y-1">
                    <FormLabel text="Username" />
                    <label className="text-sm text-muted-foreground"></label>
                    <Input value="admin" />
              </div>

            <div className="space-y-1">
              <FormLabel text="Password" />
                <div className="relative">
                    <Input type="password" value="********" />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>
          </div>

        <div className="flex items-start gap-2 p-3 mt-2 rounded-md bg-blue-50 border border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
                <p className="text-xs  text-blue-600 font-roboto font-normal">
                    Credentials are verified against the local device database Ensure the provided Credentials match the hardware configuration.
                </p>
            </div>

      </ConfigSection>

        <ConfigSection icon={<AlertIcons className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
         <AlertsTable
                    alerts={alerts}
                    setAlerts={setAlerts}
                    channels={CHANNELS}
                />
        </ConfigSection>

    </div>
    </Form>
  );
}
