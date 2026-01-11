import { useState } from "react"
import { ChevronDown, ChevronRight, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

const deviceTree = [
  {
    id: "building-a",
    name: "Building A dd",
    devices: [
      { id: "camera-1", name: "Lobby Camera" },
      { id: "camera-2", name: "Parking Camera" },
    ],
  },
  {
    id: "building-b",
    name: "Building B",
    devices: [{ id: "camera-3", name: "Entrance Camera" }],
  },
]

interface Props {
  selectedDevice: string | null
  onSelect: (id: string) => void
}

export default function DeviceTreePanel({
  selectedDevice,
  onSelect,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>(["building-a"])

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-[280px] border-r bg-muted/30 p-2">
      <div className="font-medium text-sm px-3 py-2 text-muted-foreground">
        Devices
      </div>

      {deviceTree.map((group) => {
        const isOpen = expanded.includes(group.id)

        return (
          <div key={group.id} className="mb-2">
            {/* GROUP */}
            <button
              onClick={() => toggle(group.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-muted rounded"
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              {group.name}
            </button>

            {/* DEVICES */}
            {isOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {group.devices.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelect(d.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded",
                      selectedDevice === d.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "hover:bg-muted"
                    )}
                  >
                    <Camera size={14} />
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
