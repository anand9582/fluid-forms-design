import * as React from "react";
import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Search,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export interface SiteNode {
    id: string;
    name: string;
    level: number;
    status?: "healthy" | "critical" | "warning";
    children?: SiteNode[];
}

const MOCK_SITE_DATA: SiteNode[] = [
    {
        id: "hq-1",
        name: "Headquarters HQ",
        level: 0,
        status: "healthy",
        children: [
            {
                id: "b1",
                name: "Building 1",
                level: 1,
                status: "critical",
                children: [
                    { id: "f1", name: "Floor 1", level: 2, status: "healthy" },
                    { id: "f2", name: "Floor 2", level: 2, status: "healthy" }
                ]
            },
            {
                id: "b2",
                name: "Building 2",
                level: 1,
                status: "warning"
            }
        ]
    }
];

export function SiteFilter() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>(["hq-1", "b1", "f1"]);
    const [expandedIds, setExpandedIds] = useState<string[]>(["hq-1", "b1"]);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getAllChildIds = (node: SiteNode): string[] => {
        let ids = [node.id];
        if (node.children) {
            node.children.forEach(child => {
                ids = [...ids, ...getAllChildIds(child)];
            });
        }
        return ids;
    };

    const toggleSelect = (node: SiteNode) => {
        const isSelected = selectedIds.includes(node.id);
        if (isSelected) {
            setSelectedIds(prev => prev.filter(id => id !== node.id));
        } else {
            setSelectedIds(prev => [...prev, node.id]);
        }
    };

    const renderNode = (node: SiteNode) => {
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedIds.includes(node.id);
        const hasChildren = node.children && node.children.length > 0;

        if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase()) && !node.children?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return null;
        }

        return (
            <div key={node.id} className="w-full">
                <div
                    className={cn(
                        "flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer rounded-sm group",
                        node.level > 0 && "ml-4"
                    )}
                    style={{ paddingLeft: `${node.level * 12 + 8}px` }}
                >
                    <div className="flex items-center gap-1 w-full justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {hasChildren ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(node.id);
                                    }}
                                    className="p-0.5 hover:bg-slate-200 rounded transition-colors shrink-0"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                </button>
                            ) : (
                                <div className="w-4.5 shrink-0" />
                            )}

                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelect(node)}
                                className="h-4 w-4 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                            />

                            <span className="text-[13px] font-medium text-slate-700 truncate font-roboto">
                                {node.name}
                            </span>
                        </div>

                        <div className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0 ml-2",
                            node.status === "healthy" ? "bg-emerald-500" :
                                node.status === "critical" ? "bg-red-500" : "bg-amber-500"
                        )} />
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-0.5">
                        {node.children!.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[140px] h-9 justify-between bg-white border-none shadow-sm font-roboto text-sm px-3 hover:bg-white"
                >
                    {selectedIds.length > 0 ? "All Sites" : "Select Site"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 shadow-2xl border-slate-200 rounded-xl mt-1" align="start">
                <div className="flex flex-col bg-white rounded-xl overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                className="w-full h-10 pl-10 pr-3 text-[13px] font-roboto bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <ScrollArea className="h-[320px] bg-white">
                        <div className="py-2 px-1">
                            {MOCK_SITE_DATA.map(node => renderNode(node))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}
