import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronRight, Video, Globe, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import { Device } from "./DeviceTypes";
import { cn } from "@/lib/utils";

interface AddCamerasDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (selectedCameras: Device[]) => void;
    existingCameraIds?: string[];
}

export function AddCamerasDialog({
    isOpen,
    onOpenChange,
    onAdd,
    existingCameraIds = [],
}: AddCamerasDialogProps) {
    const { cameras } = SidebarCameraStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>(existingCameraIds);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(existingCameraIds);
        }
    }, [isOpen, existingCameraIds]);

    // Group cameras by groupName
    const groupedCameras = useMemo(() => {
        const groups: Record<string, Device[]> = {};
        cameras.forEach((camera) => {
            if (camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                camera.groupName?.toLowerCase().includes(searchQuery.toLowerCase())) {
                const group = camera.groupName || "Others";
                if (!groups[group]) groups[group] = [];
                groups[group].push(camera);
            }
        });
        return groups;
    }, [cameras, searchQuery]);

    const toggleCamera = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleGroup = (groupName: string, groupCameras: Device[]) => {
        const groupIds = groupCameras.map((c) => c.cameraId);
        const allSelected = groupIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !groupIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...groupIds])));
        }
    };

    const handleAdd = () => {
        const selected = cameras.filter((c) => selectedIds.includes(c.cameraId));
        onAdd(selected);
        onOpenChange(false);
    };

    const toggleGroupOpen = (group: string) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
                <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold text-slate-900">Add Cameras to Sequence</DialogTitle>
                        <p className="text-sm text-slate-500 font-medium font-roboto">Select cameras to include in this sequence.</p>
                    </div>
                    <div className="flex items-center gap-4 mr-8">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                {selectedIds.length}
                            </span>
                            <span className="text-blue-700 text-xs font-bold font-roboto">Cameras selected</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search cameras, buildings or areas..."
                                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-roboto text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 bg-white">
                            <Filter className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>

                    {/* Tree View Container */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-[#f8fafc]/30 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {Object.entries(groupedCameras).map(([group, groupCameras]) => {
                            const isOpen = openGroups[group] ?? true;
                            const groupIds = groupCameras.map((c) => c.cameraId);
                            const isGroupPartiallySelected = groupIds.some((id) => selectedIds.includes(id));
                            const isGroupAllSelected = groupIds.every((id) => selectedIds.includes(id));

                            return (
                                <div key={group} className="border-b border-slate-100 last:border-none">
                                    <div
                                        className={cn(
                                            "flex items-center justify-between p-4 bg-white hover:bg-slate-50 cursor-pointer transition-colors",
                                            !isOpen && "bg-[#f8fafc]/50"
                                        )}
                                        onClick={() => toggleGroupOpen(group)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-1 hover:bg-slate-100 rounded transition-colors" onClick={(e) => {
                                                e.stopPropagation();
                                                toggleGroupOpen(group);
                                            }}>
                                                {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                            </div>
                                            <Checkbox
                                                checked={isGroupAllSelected ? true : isGroupPartiallySelected ? "indeterminate" : false}
                                                onCheckedChange={() => toggleGroup(group, groupCameras)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Globe size={16} className="text-slate-500" />
                                                <span className="text-sm font-bold text-slate-700">{group}</span>
                                                <Globe size={14} className="text-slate-300 ml-1" />
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-0.5 rounded-full border-none">
                                            {groupCameras.length} Devices
                                        </Badge>
                                    </div>

                                    {isOpen && (
                                        <div className="bg-white px-2 pb-2">
                                            <div className="ml-12 border-l border-slate-100 space-y-1 py-1">
                                                {groupCameras.map((camera) => (
                                                    <div
                                                        key={camera.cameraId}
                                                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                                        onClick={() => toggleCamera(camera.cameraId)}
                                                    >
                                                        <Checkbox
                                                            checked={selectedIds.includes(camera.cameraId)}
                                                            onCheckedChange={() => toggleCamera(camera.cameraId)}
                                                            className="rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                        />
                                                        <Video size={16} className={cn("text-slate-400", selectedIds.includes(camera.cameraId) && "text-blue-500")} />
                                                        <span className={cn(
                                                            "text-sm font-medium text-slate-600 font-roboto",
                                                            selectedIds.includes(camera.cameraId) && "text-slate-900 font-semibold"
                                                        )}>
                                                            {camera.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 flex items-center justify-end gap-3 border-t">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-11 px-6 font-bold text-slate-600 hover:bg-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={selectedIds.length === 0}
                        className="bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                        Add to sequence
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
