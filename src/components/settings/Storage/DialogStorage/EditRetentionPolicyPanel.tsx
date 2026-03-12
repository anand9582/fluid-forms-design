import { useState, useEffect } from "react";
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
import { API_MANISH_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import axios from "axios";
import { toast } from "sonner";
import { RetentionPolicy } from "../RetentionPoliciesTable";

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

interface EditRetentionPolicyPanelProps {
    policy: RetentionPolicy;
    onSuccess?: () => void;
}

export function EditRetentionPolicyPanel({ policy, onSuccess }: EditRetentionPolicyPanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RetentionPolicyValues>({
        resolver: zodResolver(retentionPolicySchema),
        defaultValues: {
            policyName: policy.policyName,
            duration: String(policy.durationDays),
            action: (policy.actionAfterExpiry?.charAt(0).toUpperCase() + policy.actionAfterExpiry?.slice(1).toLowerCase()) as "Remove" | "Archive" || "Remove",
            locations: policy.locations?.join(", ") || "",
            freeSpace: [policy.minimumFreeSpaceBuffer],
            dualRecording: false, // Defaulting to false as it's not in the row data currently
        },
    });

    // Update form if policy changes
    useEffect(() => {
        form.reset({
            policyName: policy.policyName,
            duration: String(policy.durationDays),
            action: (policy.actionAfterExpiry?.charAt(0).toUpperCase() + policy.actionAfterExpiry?.slice(1).toLowerCase()) as "Remove" | "Archive" || "Remove",
            locations: policy.locations?.join(", ") || "",
            freeSpace: [policy.minimumFreeSpaceBuffer],
            dualRecording: false,
        });
    }, [policy, form]);

    const onSubmit = async (values: RetentionPolicyValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                id: policy.id, // Assuming ID is needed for update
                policyName: values.policyName,
                durationDays: Number(values.duration),
                actionAfterExpiry: values.action.toUpperCase(),
                minimumFreeSpaceBuffer: values.freeSpace[0],
                dualRecording: values.dualRecording,
            };

            // Using the same base URL patterns. If an explicit update endpoint exists, it should be used here.
            // For now, I'll follow the pattern of the create endpoint.
            await axios.post(
                `${API_MANISH_URL}${API_URLS.create_retention_policy}`, // Placeholder or actual update endpoint
                payload,
                { headers: getAuthHeaders() }
            );

            toast.success("Retention policy updated successfully.");
            onSuccess?.();
        } catch (error: any) {
            console.error("Failed to update retention policy:", error);
            toast.error(error.response?.data?.message || error.data?.message || "Failed to update retention policy. Please try again.");
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                        Update Policy
                    </Button>
                </div>
            </form>
        </Form>
    );
}
