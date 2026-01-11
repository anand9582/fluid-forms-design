import { useState } from "react";

const cameraTree = [
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
        ],
      },
      { id: "exterior", label: "Exterior", children: [{ id: "valetDropoff", label: "Valet Dropoff" }] },
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

interface Props {
  onSelectCamera: (id: string) => void;
}

export default function CameraDetails({ onSelectCamera }: Props) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelect = (id: string) => {
    setSelectedNode(id);
    onSelectCamera(id);
  };

  const renderTree = (nodes: typeof cameraTree) => {
    return nodes.map((node) => (
      <div key={node.id} className="pl-4 mt-1">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              node.children ? toggleExpand(node.id) : handleSelect(node.id);
            }}
            className={`text-left w-full px-2 py-1 rounded hover:bg-muted ${
              selectedNode === node.id ? "bg-primary/10 text-primary" : ""
            }`}
          >
            {node.label}
          </button>
          {node.children && (
            <button onClick={() => toggleExpand(node.id)} className="px-1">
              {expandedNodes.includes(node.id) ? "▼" : "▶"}
            </button>
          )}
        </div>
        {node.children && expandedNodes.includes(node.id) && (
          <div className="pl-4">{renderTree(node.children)}</div>
        )}
      </div>
    ));
  };

  return <div>{renderTree(cameraTree)}</div>;
}
