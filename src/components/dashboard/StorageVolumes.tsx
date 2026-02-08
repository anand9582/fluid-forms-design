import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Database,
  HardDrive,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {Card, CardHeader, CardTitle,CardContent } from "@/components/ui/card";
import { storageData } from "@/components/dashboard/SampleStorageData";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/theme/themeColors";

/* ---------------- TYPES ---------------- */
export interface StorageItem {
  id: string;
  name: string;
  percentage: number;
  used?: string;
  total?: string;
  children?: StorageItem[];
}

/* ---------------- PROPS ---------------- */
interface StorageVolumesProps {
  data: StorageItem[];
  title?: string;
  isLoading?: boolean;
}

/* ---------------- HELPERS ---------------- */
const getUsageColor = (percentage: number) => {
  if (percentage >= 90) return "bg-destructive";
  if (percentage >= 70) return "bg-warning";
  return "bg-primary";
};

const getTextColor = (percentage: number) => {
  if (percentage >= 90) return "text-orange-600";
  if (percentage >= 70) return "text-warning";
  return "text-muted-foreground";
};

/* ---------------- ROW ---------------- */
function StorageRow({
  item,
  level = 0,
  expandedRows,
  toggleRow,
}: {
  item: StorageItem;
  level?: number;
  expandedRows: string[];
  toggleRow: (id: string) => void;
}) {
  const hasChildren = !!item.children;
  const isExpanded = expandedRows.includes(item.id);
   const { isAltTheme } = useTheme();
  const theme = isAltTheme ? themeColors.dark : themeColors.light;
  
  return (
    <div className="pb-1">
      {/* ROW */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md w-full text-left",
          hasChildren ? "hover:bg-muted/50" : "",
          level > 0 ? "pl-0" : ""
        )}
        onClick={() => hasChildren && toggleRow(item.id)}
        aria-expanded={isExpanded}
      >
        {/* ARROW */}
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <span className="w-4" />
        )}

        {/* ICON */}
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          {level > 0 ? (
            <HardDrive className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Database className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

      
          <span
            className={cn(
              "flex-1 text-sm font-medium font-roboto",
              level === 0 ? "text-black" : "text-slate-600 font-regular"
            )}
          >
            {item.name}
          </span>

        {/* SIZE */}
        {item.total && (
            <span
            className={cn(
              "text-xs font-medium font-roboto",
              level === 0 ? "text-black" : "text-slate-600 font-regular"
            )}
          >
           {item.total}
          </span>
       
        )}

        {/* % */}
        {level === 0 && (
          <span className={cn("text-sm font-medium text-slate-600 font-roboto", getTextColor(item.percentage))}>
            {item.percentage}%
          </span>
        )}
      </button>

      {/* TOP-LEVEL BAR */}
{level === 0 && (
  <div className="ml-14 mr-4 mb-2">
    <div className="h-1 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${item.percentage}%`,
          background: item.percentage >= 90 
                      ? "#EA580C"  // red
                      : item.percentage >= 70
                      ? "#EA580C"  // orange
                      : "#2B43FF", // blue
        }}
      />
    </div>
  </div>
)}

{/* CHILDREN (always blue) */}
{level > 0 && (
  <div className="ml-14 mr-4 mb-2">
    <div className="h-1 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${item.percentage}%`,
          background: "linear-gradient(90deg, #2563EB, #153885)",
        }}
      />
    </div>
  </div>
)}



      {/* CHILDREN */}
      {hasChildren && isExpanded && (
        <div className="ml-6 pl-2">
          <p className="text-[11px] uppercase font-medium text-slate-600 font-roboto py-1 text-left p-6">Mounted disks</p>
          {item.children!.map((child) => (
            <StorageRow
              key={child.id}
              item={child}
              level={level + 1}
              expandedRows={expandedRows}
              toggleRow={toggleRow}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export function StorageVolumes({
  data,
  title = "Storage Volumes",
  isLoading = false,
}: StorageVolumesProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { isAltTheme } = useTheme(); 
  const theme = isAltTheme ? themeColors.dark : themeColors.light;

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">
        <StorageVolumes data={storageData} />
    </div>;
  }

  return (
    <Card className="border-border/80 shadow-none overflow-hidden rounded">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
              <CardTitle className="text-sm font-roboto font-medium  uppercase text-gray-600 text">
                    {title}
              </CardTitle>
          </CardHeader>


      {/* BODY */}
      <CardContent className="py-4 px-4">
        {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="text-left">
              <p className="text-sm  font-roboto text-slate-600 font-semibold">Total Space</p>
              <p className="text-lg font-bold text-foreground ">
                780
                <span className="text-xs ml-1 text-muted-foreground">TB</span>
              </p>
            </div>
            <div className="ml-5">
              <p className="text-sm uppercase font-roboto text-slate-600 font-semibold mr-4">Used</p>
              <p className="text-lg font-bold text-foreground">
                331
                <span className="text-xs ml-1 text-muted-foreground">TB</span>
              </p>
            </div>
             <div className="text-right">
              <p className="text-sm uppercase font-roboto text-slate-600 font-medium mr-1.5">Free</p>
              <p className="text-lg font-bold text-black">58%</p>
            </div>
          </div>

        {/* TOTAL BAR */}
       <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: "42%",
              background: `linear-gradient(90deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
            }}
          />
        </div>


        {/* LIST */}
        <div className="space-y-1">
            {data.map((item) => (
              <StorageRow
                key={item.id}
                item={item}
                expandedRows={expandedRows}
                toggleRow={toggleRow}
              />
            ))}
        </div>

        {/* FOOTER */}
        <div className="mt-5 border-t pt-4 flex justify-center">
          <button className="text-primary flex items-center gap-1 text-sm font-medium hover:underline">
            Manage Volumes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
