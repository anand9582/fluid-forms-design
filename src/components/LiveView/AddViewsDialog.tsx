import { useState, useMemo, useEffect } from "react";
import { Search, Globe, ChevronDown, ChevronRight, Video, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { API_VAISHALI_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { cn } from "@/lib/utils";

interface AddViewsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (selectedViews: any[]) => void;
    existingViewIds?: string[];
}

export function AddViewsDialog({
    isOpen,
    onOpenChange,
    onAdd,
    existingViewIds = [],
}: AddViewsDialogProps) {
    const [views, setViews] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>(existingViewIds);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(existingViewIds);
            fetchViews();
        }
    }, [isOpen, existingViewIds]);

    const fetchViews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_VAISHALI_URL}${API_URLS.get_all_views}`, {
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                const json = await response.json();
                const fetchedViews = json?.data?.map((v: any) => ({
                    id: String(v.id),
                    name: v.viewName,
                })) || [];
                setViews(fetchedViews);
            }
        } catch (error) {
            console.error("Error fetching views:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredViews = useMemo(() => {
        return views.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [views, searchQuery]);

    const toggleView = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        const allIds = filteredViews.map(v => v.id);
        const allSelected = allIds.every(id => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !allIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...allIds])));
        }
    };

    const handleAdd = () => {
        const selected = views.filter((v) => selectedIds.includes(v.id));
        // Map to format that SidebarCameraStore's playlist expects (it uses cameraId for items)
        const mappedSelected = selected.map(v => ({
            cameraId: v.id,
            name: v.name,
            duration: "10s",
            order: 0 // Will be set during save
        }));
        onAdd(mappedSelected);
        onOpenChange(false);
    };

    const isAllSelected = filteredViews.length > 0 && filteredViews.every(v => selectedIds.includes(v.id));
    const isPartiallySelected = filteredViews.some(v => selectedIds.includes(v.id)) && !isAllSelected;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
                <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold text-slate-900">Add Views to Sequence</DialogTitle>
                        <p className="text-sm text-slate-500 font-medium font-roboto">Select saved views to include in this sequence.</p>
                    </div>
                    <div className="flex items-center gap-4 mr-8">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                {selectedIds.length}
                            </span>
                            <span className="text-blue-700 text-xs font-bold font-roboto">Views selected</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search views..."
                                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-roboto text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Views List Container */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-[#f8fafc]/30 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-2">
                        {loading ? (
                            <div className="p-4 text-center text-slate-500 text-sm">Loading views...</div>
                        ) : filteredViews.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No views found</div>
                        ) : (
                            <>
                                <div
                                    className="flex items-center p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100"
                                    onClick={toggleAll}
                                >
                                    <Checkbox
                                        checked={isAllSelected ? true : isPartiallySelected ? "indeterminate" : false}
                                        onCheckedChange={toggleAll}
                                        onClick={(e) => e.stopPropagation()}
                                        className="rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mr-3"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Select All</span>
                                </div>
                                <div className="space-y-1 py-1">
                                    {filteredViews.map((view) => (
                                        <div
                                            key={view.id}
                                            className="flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-xl cursor-pointer transition-all"
                                            onClick={() => toggleView(view.id)}
                                        >
                                            <Checkbox
                                                checked={selectedIds.includes(view.id)}
                                                onCheckedChange={() => toggleView(view.id)}
                                                className="rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Globe size={16} className={cn("text-slate-400", selectedIds.includes(view.id) && "text-blue-500")} />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium text-slate-600 font-roboto",
                                                selectedIds.includes(view.id) && "text-slate-900 font-bold"
                                            )}>
                                                {view.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
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
