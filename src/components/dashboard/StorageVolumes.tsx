  import {
    ChevronRight,
    ChevronDown,
    ArrowRight,
    Database,
    HardDrive,
  } from "lucide-react";
  import { useState } from "react";
  import { cn } from "@/lib/utils";
  import { CardHeader, CardTitle } from "@/components/ui/card";

  /* ---------------- TYPES ---------------- */
  interface StorageItem {
    name: string;
    percentage: number;
    used?: string;
    total?: string;
    children?: StorageItem[];
  }

  /* ---------------- DATA ---------------- */
  const storageData: StorageItem[] = [
    { name: "CAMPulse Cloud", percentage: 54 },
    { name: "NAS-01 (Pri)", percentage: 90 },
    {
      name: "NAS-02 (Pri)",
      percentage: 54,
      children: [
        { name: "Bay 1 (HDD)", percentage: 53, total: "32/60TB" },
        { name: "Bay 2 (HDD)", percentage: 53, total: "32/60TB" },
      ],
    },
    { name: "Local HDD Array", percentage: 95 },
  ];

  /* ---------------- ROW ---------------- */
 function StorageRow({ item, level = 0 }: { item: StorageItem; level?: number }) {
  const [expanded, setExpanded] = useState(item.name === "NAS-02 (Pri)");
  const hasChildren = !!item.children;

  return (
    <div>
      {/* ROW */}
      <div
        className={cn(
          "flex items-center gap-2 py-2 rounded",
          hasChildren ? "cursor-pointer hover:bg-gray-50" : "cursor-default"
        )}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {/* ✅ ARROW (ALL ROWS SAME) */}
        {expanded && hasChildren ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight
            className={cn(
              "w-4 h-4",
              hasChildren ? "text-gray-400" : "text-gray-300"
            )}
          />
        )}

        {/* ICON */}
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
          {level > 0 ? (
            <HardDrive className="w-4 h-4 text-gray-500" />
          ) : (
            <Database className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* NAME */}
        <span className="flex-1 text-sm text-gray-800">{item.name}</span>

        {/* SIZE */}
        {item.total && (
          <span className="text-xs text-gray-500 mr-2">{item.total}</span>
        )}

        {/* % */}
        <span
          className={cn(
            "text-sm font-semibold",
            item.percentage >= 90 ? "text-orange-500" : "text-gray-600"
          )}
        >
          {item.percentage}%
        </span>
      </div>

      {/* PROGRESS BAR (TOP LEVEL ONLY) */}
      {level === 0 && (
        <div className="ml-14 mr-4 mb-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                item.percentage >= 90 ? "bg-orange-500" : "bg-blue-500"
              )}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* CHILDREN */}
      {hasChildren && expanded && (
        <div className="ml-6 border-l border-gray-200 pl-2">
          <p className="text-[11px] text-gray-400 uppercase py-1">
            Mounted disks
          </p>
          {item.children!.map((child) => (
            <StorageRow key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}


  /* ---------------- MAIN ---------------- */
  export function StorageVolumes() {
    return (
      <div className="bg-white rounded-xl shadow-sm ">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
          <CardTitle className="text-sm font-roboto font-medium  uppercase text-gray-600 text">
            Storage Volumes 
          </CardTitle>
        </CardHeader>

        <div className="border shadow-sm bg-white p-4 rounded-none">
          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase text-sm font-semibold">Total Space </p>
              <p className="text-lg font-bold">
                780<span className="text-xs ml-1 text-gray-500">TB</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Used</p>
              <p className="text-lg font-bold">
                331<span className="text-xs ml-1 text-gray-500">TB</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Free</p>
              <p className="text-lg font-bold text-[#365314]">58%</p>
            </div>
          </div>

          {/* TOTAL BAR */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: "42%" }}
            />
          </div>

          {/* LIST */}
          <div className="space-y-1">
            {storageData.map((item) => (
              <StorageRow key={item.name} item={item} />
            ))}
          </div>

          {/* LINK */}
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-3"
          >
            Manage Volumes
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }
