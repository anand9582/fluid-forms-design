import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Wifi, Shield, Bell, Lock, Info,ChevronDown,Mail,Smartphone,MonitorSmartphone,Webhook} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card,CardHeader,CardTitle } from "@/components/ui/card";

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

export default function NetworkSetting() {
  const form = useForm({
  defaultValues: {
    deviceMake: "axis",
    model: "DS-2CD2043G2-I",
    logicalGroup: "HQ / Floor 1",
    deviceCategory: "Camera",
  },
});

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

   <ConfigSection icon={<Bell className="h-4 w-4" />} title="Network Module Alerts" defaultOpen>
  <div className="border rounded-lg overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-muted/30 border-b text-sm font-medium bg-bgprimary">
     {/* <CardHeader className="flex flex-row items-center justify-between  rounded-t">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
            REAL-TIME AI ALERTS
        </CardTitle>
          <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white text-[12px] font-medium px-2 py-0.5 rounded-full">
                122
              </span>
         
          </div>
      </CardHeader> */}

      <span className="text-gray-500 font-roboto">Alert Trigger</span>
      <span className="text-gray-500 font-roboto text-center">Enabled</span>
      <span className="text-gray-500 font-roboto space-x-2 text-end mr-5">Notification Channels</span>
    </div>

    {/* Alert Rows */}
    {[
      { id: "connection-lost", name: "Connection Lost", enabled: true },
      { id: "ip-conflict", name: "IP Conflict", enabled: true },
      { id: "auth-failure", name: "Authentication Failure", enabled: true },
      { id: "packet-loss", name: "Packet Loss High", enabled: false },
    ].map((alert, index) => (
      <div
        key={alert.id}
        className={cn(
          "grid grid-cols-3 gap-4 px-4 py-3 items-center",
          index !== 3 && "border-b"
        )}
      >
        {/* Alert Name */}
        <span className="text-sm">{alert.name}</span>

        {/* Enabled Switch */}
        <div className="flex justify-center">
          <Switch defaultChecked={alert.enabled} />
        </div>

        {/* Notification Buttons */}
        <div className="flex justify-end space-x-2">
          {[
            <Mail key="mail" className="h-4 w-4" />,
            <Smartphone key="phone" className="h-4 w-4" />,
            <MonitorSmartphone key="monitor" className="h-4 w-4" />,
            <Webhook key="webhook" className="h-4 w-4" />,
          ].map((icon, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 flex items-center justify-center",
                alert.enabled && "text-primary border-primary/30 bg-primary/5"
              )}
            >
              {icon}
            </Button>
          ))}
        </div>
      </div>
    ))}
  </div>
</ConfigSection>



    </div>
    </Form>
  );
}
