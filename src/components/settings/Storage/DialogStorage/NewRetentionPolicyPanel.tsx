import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertTriangle, Database, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_MANISH_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import axios from "axios";
import { toast } from "sonner";

const retentionPolicySchema = z.object({
  policyName: z.string().min(2, "Policy name must be at least 2 characters").trim(),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Duration must be a positive number",
  }),
  action: z.enum(["Remove", "Archive"]),
  locations: z.string().min(1, "At least one location is required").trim(),
  freeSpace: z.array(z.number()).min(1),
  dualRecording: z.boolean().default(false),
});

type RetentionPolicyValues = z.infer<typeof retentionPolicySchema>;

export function NewRetentionPolicyPanel({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RetentionPolicyValues>({
    resolver: zodResolver(retentionPolicySchema),
    defaultValues: {
      policyName: "",
      duration: "30",
      action: "Remove",
      locations: "",
      freeSpace: [40],
      dualRecording: false,
    },
  });

  const onSubmit = async (values: RetentionPolicyValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        policyName: values.policyName,
        durationDays: Number(values.duration),
        actionAfterExpiry: values.action.toUpperCase(),
        minimumFreeSpaceBuffer: values.freeSpace[0],
        dualRecording: values.dualRecording,
      };

      await axios.post(
        `${API_MANISH_URL}${API_URLS.create_retention_policy}`,
        payload,
        { headers: getAuthHeaders() }
      );

      toast.success("Retention policy created successfully.");

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create retention policy:", error);
      toast.error(error.response?.data?.message || error.data?.message || "Failed to create retention policy. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Policy Name */}
        <FormField
          control={form.control}
          name="policyName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Policy Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Standard 30 days" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration & Action */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Duration (Days)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type="text" {...field} className="pr-10" />
                  </FormControl>
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Action after expiry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Remove">Remove</SelectItem>
                    <SelectItem value="Archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assigned Locations */}
        <FormField
          control={form.control}
          name="locations"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Assigned Locations</FormLabel>
              <FormControl>
                <Input placeholder="Add..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Free Space */}
        <FormField
          control={form.control}
          name="freeSpace"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Minimum Free Space Buffer (%)</FormLabel>
              <FormControl>
                <Slider
                  value={field.value}
                  onValueChange={field.onChange}
                  max={50}
                  min={0}
                  step={1}
                  trackHeight={6}
                  thumbSize={20}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (High Risk)</span>
                <span className="text-primary font-semibold">{field.value[0]}%</span>
                <span>50% (Conservative)</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warning */}
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3.5">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
          <p className="text-xs text-yellow-600">
            Reducing retention duration will cause older data to be permanently Removed during the next cleanup cycle (scheduled 03:00 AM).
          </p>
        </div>

        {/* Dual Recording */}
        <FormField
          control={form.control}
          name="dualRecording"
          render={({ field }) => (
            <FormItem className="flex items-start gap-4 rounded-xl border border-border p-4">
              <div className="p-2.5 rounded-lg bg-blue-50 shrink-0">
                <Database className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-md font-roboto font-medium text-black">Dual recording</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-roboto font-medium text-gray-700">
                      {field.value ? "Enabled" : "Disabled"}
                    </span>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </div>
                <p className="text-[12px] font-roboto font-regular text-slate-500 mt-1 max-w-sm">
                  Writes video streams to both a primary volume and a designated secondary volume simultaneously. This ensures zero data loss if the primary storage fails.
                </p>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Policy
          </Button>
        </div>
      </form>
    </Form>
  );
}
