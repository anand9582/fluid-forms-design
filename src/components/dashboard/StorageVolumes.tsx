import { ChevronRight, ChevronDown, HardDrive, Cloud, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StorageItem {
  name: string;
  percentage: number;
  used?: string;
  total?: string;
  color: string;
  children?: StorageItem[];
}

const storageData: StorageItem[] = [
  { name: "CAMPulse Cloud", percentage: 54, color: "bg-blue-500" },
  { name: "NAS-01 (Pri)", percentage: 90, color: "bg-red-500" },
  {
    name: "NAS-02 (Pri)",
    percentage: 54,
    color: "bg-blue-500",
    children: [
      { name: "Bay 1 (HDD)", percentage: 53, used: "32/60TB", total: "32/60TB", color: "bg-blue-500" },
      { name: "Bay 2 (HDD)", percentage: 53, used: "32/60TB", total: "32/60TB", color: "bg-blue-500" },
    ],
  },
  { name: "Local HDD Array", percentage: 95, color: "bg-red-500" },
];

function StorageRow({ item, level = 0 }: { item: StorageItem; level?: number }) {
  const [expanded, setExpanded] = useState(item.name === "NAS-02 (Pri)");

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer transition-colors",
          level > 0 && "ml-4"
        )}
        onClick={() => item.children && setExpanded(!expanded)}
      >
        {item.children ? (
          expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )
        ) : (
          <div className="w-4" />
        )}

        {level > 0 ? (
          <HardDrive className="w-4 h-4 text-gray-400" />
        ) : item.name.includes("Cloud") ? (
          <Cloud className="w-4 h-4 text-blue-500" />
        ) : (
          <HardDrive className="w-4 h-4 text-gray-400" />
        )}

        <span className="flex-1 text-xs text-gray-900">{item.name}</span>

        {item.total && (
          <span className="text-[10px] text-gray-500 mr-2">{item.total}</span>
        )}

        <span
          className={cn(
            "text-xs font-medium",
            item.percentage >= 90 ? "text-red-500" : "text-gray-900"
          )}
        >
          {item.percentage}%
        </span>
      </div>

      {/* Progress bar for main items */}
      {!item.children && level === 0 && (
        <div className="ml-10 mr-2 mb-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", item.color)}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Children */}
      {item.children && expanded && (
        <div className="border-l border-gray-200 ml-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide px-4 py-1">
            Mounted disks
          </p>
          {item.children.map((child) => (
            <StorageRow key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StorageVolumes() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
      {/* Header */}
      <h3 className="font-semibold text-gray-900 text-sm mb-3">STORAGE VOLUMES</h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-blue-50 rounded-lg">
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Total Space</p>
          <p className="text-lg font-bold text-gray-900">
            780<span className="text-xs font-normal text-gray-500">TB</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">USED</p>
          <p className="text-lg font-bold text-blue-500">
            331<span className="text-xs font-normal text-gray-500">TB</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">FREE</p>
          <p className="text-lg font-bold text-emerald-500">
            58<span className="text-xs font-normal text-gray-500">%</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
      </div>

      {/* Storage List */}
      <div className="space-y-0.5 max-h-44 overflow-y-auto scrollbar-thin">
        {storageData.map((item) => (
          <StorageRow key={item.name} item={item} />
        ))}
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors mt-3"
      >
        Manage Volumes
        <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}
