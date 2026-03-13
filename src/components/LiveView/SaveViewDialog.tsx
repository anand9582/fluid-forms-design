import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";
import { API_VAISHALI_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import useGridStore from "@/Store/UseGridStore";

interface SaveViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    activeViewId?: number | null;
    currentName?: string;
}

export function SaveViewDialog({ open, onOpenChange, onSuccess, activeViewId, currentName }: SaveViewDialogProps) {
    const { layout, slotAssignments } = useGridStore();
    const currentGridLabel = `${layout.rows}×${layout.cols} View`;
    const [viewName, setViewName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setViewName(currentName || currentGridLabel);
        }
    }, [open, currentGridLabel, currentName]);

    const handleSave = async () => {
        if (!viewName.trim()) {
            toast.error("Please enter a view name");
            return;
        }

        setIsLoading(true);
        try {
            // Map slotAssignments to cellMapping { index: cameraId }
            const cellMapping: Record<string, string> = {};
            slotAssignments.forEach((cameraId, index) => {
                if (cameraId) {
                    cellMapping[String(index)] = cameraId;
                }
            });

            const payload = {
                viewName: viewName,
                cellMapping: cellMapping,
            };

            const url = activeViewId
                ? `${API_VAISHALI_URL}${API_URLS.update_view}${activeViewId}`
                : `${API_VAISHALI_URL}${API_URLS.create_view}`;

            const method = activeViewId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${activeViewId ? 'update' : 'save'} view`);
            }

            toast.success(`View ${activeViewId ? 'updated' : 'saved'} successfully`);
            onOpenChange(false);
            setViewName("");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(`Error ${activeViewId ? 'updating' : 'saving'} view:`, error);
            toast.error(`Error ${activeViewId ? 'updating' : 'saving'} view. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-6 gap-6 rounded-2xl border-none shadow-2xl">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <DialogTitle className="text-2xl font-bold font-plus-jakarta">
                            {activeViewId ? "Update View" : "Save View"}
                        </DialogTitle>
                        <DialogDescription className="text-[#64748B] text-sm leading-relaxed">
                            {activeViewId
                                ? "Update the existing view with the current grid and camera arrangement."
                                : "Save the current grid and camera arrangement for faster monitoring."}
                        </DialogDescription>
                    </div>
                    {/* <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 focus-visible:ring-0">
                            <X className="h-5 w-5 text-slate-500" />
                        </Button>
                    </DialogClose> */}
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="view-name" className="text-sm font-medium text-[#1E293B]">
                            View Name
                        </Label>
                        <Input
                            id="view-name"
                            placeholder="Enter view name"
                            className="h-12 px-4 rounded-xl transition-all duration-200"
                            value={viewName}
                            onChange={(e) => setViewName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-3 sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="h-12 px-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#1E293B] font-semibold border-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="h-12 px-8 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95"
                    >
                        {isLoading ? "Saving..." : (activeViewId ? "Update View" : "Save View")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
