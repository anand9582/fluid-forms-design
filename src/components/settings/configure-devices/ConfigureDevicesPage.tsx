import { useState } from "react";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { configureDeviceTabs } from "@/components/settings/SidebarConfigs/ConfigureDeviceTabs";
import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import Network from "@/components/settings/tabContents/Tabs_configure/NetworkSetting";
import Recording from "@/components/settings/tabContents/Tabs_configure/Recording";

import {
  Search,
  Monitor,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Trash2,
  VideoOff, 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Devices } from "@/components/ui/icons";

/* ---------------- MOCK CAMERA TREE ---------------- */

const cameraTree = [
  {
    id: "property-1",
    name: "Grand Hotel",
    type: "property",
    count: 45,
    online: 3,
    children: [
      {
        id: "building-a",
        name: "Building A (Guest)",
        type: "building",
        children: [
          {
            id: "floor-1",
            name: "Floor 1 (Lobby)",
            type: "floor",
            children: [
              { id: "cam-1", name: "Lobby Entrance", type: "camera", status: "error" },
              { id: "cam-2", name: "Concierge Desk", type: "camera", status: "online" },
              { id: "cam-3", name: "Elevator Bank A", type: "camera", status: "online" },
              { id: "cam-4", name: "Service Corridor", type: "camera", status: "warning" },
            ],
          },
        ],
      },
      {
        id: "exterior",
        name: "Exterior",
        type: "building",
        children: [{ id: "cam-5", name: "Valet Dropoff", type: "camera", status: "error" }],
      },
    ],
  },
];

/* ---------------- TREE NODE ---------------- */

interface TreeNodeProps {
  node: any;
  level: number;
  selectedId: string;
  onSelect: (id: string, node: any) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}

const TreeNode = ({
  node,
  level,
  selectedId,
  onSelect,
  expandedIds,
  toggleExpand,
}: TreeNodeProps) => {
  const hasChildren = node.children?.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isCamera = node.type === "camera";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm",
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
          !isCamera && "font-medium"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isCamera) onSelect(node.id, node);
          else if (hasChildren) toggleExpand(node.id);
        }}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-muted rounded"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {isCamera && <Monitor className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="flex-1 truncate">{node.name}</span>

        {isCamera && node.status && (
          <span className={cn("w-2 h-2 rounded-full", getStatusColor(node.status))} />
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */

const ConfigureDevicesPage = () => {
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["property-1", "building-a", "floor-1"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCameraSelect = (_id: string, node: any) => {
    setSelectedCamera({
      id: node.id,
      name: node.name,
      ip: "192.168.1.101",
      status: node.status,
    });
  };

  return (
    <div className="flex-1 flex flex-col  space-y-6">
      <SettingsHeader
        title="Configure Devices"
        description="Adjust camera-specific settings for analytics processing."
        showActions={false}
      />

      <div className="flex gap-6 min-h-[600px] mt-9">
        {/* LEFT TREE */}
        <div className="w-72 border rounded-lg bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Devices className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">Cameras</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2">
            {cameraTree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedCamera?.id || ""}
                onSelect={handleCameraSelect}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 border rounded-lg bg-card">
          {!selectedCamera ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-12 h-12 rounded-sm bg-gray-100 flex items-center justify-center mb-4">
                  <Devices className="h-6 w-6 text-muted-foreground" />
                </div>
                  <h3 className="text-lg font-semibold">No Device Selected</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Select a camera from the hierarchy tree on the left to manage its configurations.
                  </p>
              </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedCamera.name}</span>
                      <Badge
                        className={cn(
                          "text-xs",
                          selectedCamera.status === "online" && "bg-green-500"
                        )}
                      >
                        {selectedCamera.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      IP: {selectedCamera.ip}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <SettingsTabs defaultValue="network" tabs={configureDeviceTabs} className="px-4">
                    <TabsContent value="network" >
                        <Network />
                    </TabsContent>
                    <TabsContent value="recording" >
                        <Recording />
                    </TabsContent>
              </SettingsTabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigureDevicesPage;
