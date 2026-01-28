import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Wifi, Shield, Bell, Lock, Info,ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/FormLabel";

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

const ConfigSection = ({ icon, title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b">
      <CollapsibleTrigger className="flex items-center gap-3 w-full p-4 hover:bg-muted/50 transition-colors">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-medium flex-1 text-left font-roboto">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2 space-y-4">
            {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default function CameraDetails() {
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
        <FormItem className="space-y-2">
          <FormLabel>
            Device Make
          </FormLabel>
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
        <FormItem className="space-y-2">
          <FormLabel>
            Model Identifier
          </FormLabel>
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
        <FormItem className="space-y-2">
          <FormLabel>
            Logical Group
          </FormLabel>
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
        <FormItem className="space-y-2">
          <FormLabel>
            Device Category
          </FormLabel>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">IP Address</label>
            <Input value="192.168.1.101" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Port</label>
            <Input value="554" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Protocol</label>
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

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Stream Path</label>
            <Input value="/stream1" />
          </div>
        </div>
      </ConfigSection>

      {/* Credentials */}
      <ConfigSection
        icon={<Shield className="h-4 w-4" />}
        title="Authentication and Credentials"
        defaultOpen
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Username</label>
            <Input value="admin" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <Input type="password" value="********" />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-600 text-sm">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Credentials are verified against the local device database.
            Ensure the provided credentials match the hardware configuration.
          </span>
        </div>
      </ConfigSection>

        <ConfigSection
          icon={<Bell className="h-4 w-4" />}
          title="Network Module Alerts"
        >
          <p className="text-sm text-muted-foreground">
            Configure alerts for network connectivity issues, timeout events,
            and connection failures.
          </p>
      </ConfigSection>
    </div>
    </Form>
  );
}
