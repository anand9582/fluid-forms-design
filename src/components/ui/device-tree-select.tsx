import * as React from "react";
import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Filter, Globe, Monitor ,Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DeviceNode {
  id: string;
  name: string;
  type: "group" | "device";
  status?: "online" | "offline";
  children?: DeviceNode[];
  deviceCount?: number;
}

interface DeviceTreeSelectProps {
  data: DeviceNode[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  searchPlaceholder?: string;
  selectionLabel?: string;
  className?: string;
}

interface TreeNodeProps {
  node: DeviceNode;
  level: number;
  index: number; 
  selectedIds: string[];
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string, allChildIds?: string[]) => void;
  getAllChildIds: (node: DeviceNode) => string[];
}

// Custom circular checkbox component
function CircularCheckbox({ 
  checked, 
  indeterminate,
  onChange 
}: { 
  checked: boolean; 
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "h-4 w-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
        checked
          ? "bg-blue-600 border-blue-600"
          : indeterminate
          ? "border-blue-600 bg-blue-600/20"
          : "border-muted-foreground/40 bg-background"
      )}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
      {indeterminate && !checked && (
        <div className="h-2 w-2 bg-blue-600 rounded-sm" />
      )}
    </button>
  );
}

function TreeNode({
  node,
  level,
  index,
  selectedIds,
  expandedIds,
  onToggleExpand,
  onToggleSelect,
  getAllChildIds,
}: TreeNodeProps) {
  const isExpanded = expandedIds.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isDevice = node.type === "device";
  
  const allChildIds = getAllChildIds(node);
  const isSelected = isDevice 
    ? selectedIds.includes(node.id)
    : allChildIds.length > 0 && allChildIds.every(id => selectedIds.includes(id));
  const isPartiallySelected = !isSelected && allChildIds.some(id => selectedIds.includes(id));

  const handleCheckboxChange = () => {
    if (isDevice) {
      onToggleSelect(node.id);
    } else {
      onToggleSelect(node.id, allChildIds);
    }
  };

  return (
    <div>
      <div
            className={cn(
                "flex items-center gap-3 px-3 py-3 hover:bg-muted/40 transition-colors",
                level === 0 && index === 0 && "border-b"
              )}
            style={{ paddingLeft: `${level * 24 + 12}px` }}
          >

        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="p-0.5 hover:bg-muted rounded flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5 flex-shrink-0" />
        )}

        {/* Circular Checkbox */}
        <CircularCheckbox
          checked={isSelected}
          indeterminate={isPartiallySelected}
          onChange={handleCheckboxChange}
        />

        {/* Icon */}
        {isDevice ? (
          <Monitor className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Globe className="h-3 w-3 text-muted-foreground/50" />
          </div>
        )}

        {/* Name */}
        <span className="flex-1 text-sm text-foreground truncate">{node.name}</span>

        {/* Status or device count */}
        {isDevice && node.status && (
          <span
  className={cn(
    "ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium",
    node.status === "online"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600"
  )}
>
            {node.status === "online" ? "Online" : "Offline"}
          </span>
        )}
        {!isDevice && node.deviceCount !== undefined && (
          <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-muted-foreground">
              {node.deviceCount} Devices
            </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child, childIndex) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                index={childIndex}     // ✅ REQUIRED
                selectedIds={selectedIds}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onToggleSelect={onToggleSelect}
                getAllChildIds={getAllChildIds}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function DeviceTreeSelect({
  data,
  selectedIds,
  onSelectionChange,
  searchPlaceholder = "Search cameras, buildings or areas...",
  selectionLabel = "Devices Assigned",
  className,
}: DeviceTreeSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    // Auto-expand first level
    return data.map((node) => node.id);
  });

  const getAllChildIds = (node: DeviceNode): string[] => {
    if (node.type === "device") return [node.id];
    if (!node.children) return [];
    return node.children.flatMap(getAllChildIds);
  };

  const getAllDeviceIds = (nodes: DeviceNode[]): string[] => {
    return nodes.flatMap(getAllChildIds);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelect = (id: string, allChildIds?: string[]) => {
    if (allChildIds) {
      // It's a group - toggle all children
      const allSelected = allChildIds.every((childId) =>
        selectedIds.includes(childId)
      );
      if (allSelected) {
        onSelectionChange(
          selectedIds.filter((selId) => !allChildIds.includes(selId))
        );
      } else {
        onSelectionChange([...new Set([...selectedIds, ...allChildIds])]);
      }
    } else {
      // It's a single device
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter((selId) => selId !== id));
      } else {
        onSelectionChange([...selectedIds, id]);
      }
    }
  };

  // Filter function for search
  const filterNodes = (nodes: DeviceNode[], query: string): DeviceNode[] => {
    if (!query.trim()) return nodes;
    
    return nodes
      .map((node) => {
        if (node.type === "device") {
          return node.name.toLowerCase().includes(query.toLowerCase())
            ? node
            : null;
        }
        const filteredChildren = node.children
          ? filterNodes(node.children, query)
          : [];
        if (
          filteredChildren.length > 0 ||
          node.name.toLowerCase().includes(query.toLowerCase())
        ) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as DeviceNode[];
  };

  const filteredData = filterNodes(data, searchQuery);
  const selectedCount = selectedIds.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 bg-background border-border"
          />
        </div>
        <Button variant="outline" size="icon" className="border-border">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </Button>
      </div>

      {/* Tree View */}
      <ScrollArea className="h-[300px] border border-border rounded-md">
          {filteredData.length > 0 ? (
          filteredData.map((node, index) => (
             <TreeNode
              key={node.id}
              node={node}
              level={0}
              index={index}  
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              onToggleSelect={handleToggleSelect}
              getAllChildIds={getAllChildIds}
            />
            ))
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
              No devices found
            </div>
          )}
      </ScrollArea>
    </div>
  );
}
