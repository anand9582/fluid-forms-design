import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* ---------------- TYPES ---------------- */

export interface CameraTreeNode {
  id: string;
  label: string;
  children?: CameraTreeNode[];
}

/* ---------------- DATA ---------------- */

const cameraTree: CameraTreeNode[] = [
  {
    id: "buildingA",
    label: "Building A (Guest)",
    children: [
      {
        id: "floor1",
        label: "Floor 1 (Lobby)",
        children: [
          { id: "lobbyEntrance", label: "Lobby Entrance" },
          { id: "conciergeDesk", label: "Concierge Desk" },
          { id: "elevatorBank", label: "Elevator Bank A" },
          { id: "serviceCorridor", label: "Service Corridor" },
        ],
      },
      {
        id: "exterior",
        label: "Exterior",
        children: [{ id: "valetDropoff", label: "Valet Dropoff" }],
      },
    ],
  },
  {
    id: "buildingB",
    label: "Building B (Amenities)",
    children: [
      {
        id: "rooftopPool",
        label: "Rooftop Pool",
        children: [
          { id: "poolAreaNorth", label: "Pool Area North" },
          { id: "poolBar", label: "Pool Bar" },
        ],
      },
    ],
  },
];

/* ---------------- PROPS ---------------- */

interface Props {
  activeItem: string;
  onNavigate: (id: string) => void;
}

/* ---------------- COMPONENT ---------------- */

export function CameraSidebarTree({ activeItem, onNavigate }: Props) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /* ✅ auto-expand parents when child active */
  useEffect(() => {
    const expandParents = (nodes: CameraTreeNode[], parents: string[] = []) => {
      for (const node of nodes) {
        if (node.id === activeItem) {
          setExpandedItems((prev) =>
            Array.from(new Set([...prev, ...parents]))
          );
        }
        if (node.children) {
          expandParents(node.children, [...parents, node.id]);
        }
      }
    };

    expandParents(cameraTree);
  }, [activeItem]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /* ---------------- RECURSIVE TREE ---------------- */

  const renderTree = (nodes: CameraTreeNode[], level = 0) =>
    nodes.map((node) => {
      const isExpanded = expandedItems.includes(node.id);
      const isActive = activeItem === node.id;

      /* ---------- LEAF NODE ---------- */
      if (!node.children) {
        return (
          <button
            key={node.id}
            onClick={() => onNavigate(node.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm",
              isActive && "bg-primary/10 text-primary font-medium"
            )}
            style={{ paddingLeft: 12 + level * 12 }}
          >
            {node.label}
          </button>
        );
      }

      /* ---------- PARENT NODE ---------- */
      return (
        <Collapsible
          key={node.id}
          open={isExpanded}
          onOpenChange={() => toggleExpand(node.id)}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
              style={{ paddingLeft: 12 + level * 12 }}
            >
              <span>{node.label}</span>
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 mt-1">
            {renderTree(node.children, level + 1)}
          </CollapsibleContent>
        </Collapsible>
      );
    });

  /* ---------------- RENDER ---------------- */

  return (
    <aside className="w-56 shrink-0 border rounded-md bg-white">
      <ScrollArea className="h-full p-2 space-y-1">
        {renderTree(cameraTree)}
      </ScrollArea>
    </aside>
  );
}
