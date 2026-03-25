import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Database,
  HardDrive,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { storageData } from "@/components/dashboard/SampleStorageData";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/theme/themeColors";
import axios from "axios";
import { API_MANISH_URL } from "@/components/Config/api";

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
  data?: StorageItem[];
  title?: string;
  isLoading?: boolean;
}

/* ---------------- HELPERS ---------------- */
const getTextColor = (percentage: number) => {
  if (percentage >= 90) return "text-orange-600";
  if (percentage >= 70) return "text-warning";
  return "text-muted-foreground";
};

const capitalizeFirstLetter = (string: string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const parseValueAndUnit = (str: string | undefined, defaultVal: string, defaultUnit: string) => {
  if (!str) return { value: defaultVal, unit: defaultUnit };
  const parts = str.trim().split(' ');
  if (parts.length === 1) {
    const match = str.match(/([\d.]+)([a-zA-Z]+)/);
    if (match) {
      return { value: match[1], unit: match[2] };
    }
  }
  return { value: parts[0], unit: parts.slice(1).join(' ') || defaultUnit };
};

const parseSizeToBytes = (sizeStr: string) => {
  if (!sizeStr) return 0;
  const match = sizeStr.match(/([\d.]+)\s*(KB|MB|GB|TB|B)/i);
  if (!match) return parseFloat(sizeStr) || 0;

  const val = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case 'KB': return val * 1024;
    case 'MB': return val * 1024 ** 2;
    case 'GB': return val * 1024 ** 3;
    case 'TB': return val * 1024 ** 4;
    default: return val;
  }
};

const calculatePercentage = (used?: string, total?: string) => {
  if (!used || !total) return 0;
  const usedBytes = parseSizeToBytes(used);
  const totalBytes = parseSizeToBytes(total);
  if (totalBytes === 0) return 0;
  return Math.round((usedBytes / totalBytes) * 100);
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
        {/* {item.total && (
          <span
            className={cn(
              "text-xs font-medium font-roboto",
              level === 0 ? "text-black" : "text-slate-600 font-regular"
            )}
          >
            {item.total}
          </span>
        )} */}

        {/* % */}
        {level === 0 && (
          <span className={cn("text-sm font-medium font-roboto", getTextColor(item.percentage))}>
            {item.percentage}%
          </span>
        )}
      </button>

      {/* TOP-LEVEL BAR */}
      {level === 0 && (
        <div className="ml-14 mr-4 mb-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${item.percentage}%`,
                background:
                  item.percentage >= 90
                    ? "#EA580C"
                    : item.percentage >= 70
                      ? "#EA580C"
                      : item.percentage < 30
                        ? "#EA580C"
                        : "#2B43FF",
              }}
            />
          </div>
        </div>
      )}

      {/* CHILDREN (always blue) */}
      {level > 0 && (
        <div className="ml-14 mr-4 mb-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
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

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await axios.get(`${API_MANISH_URL}/storage/get-dashboard`);
        if (res.data?.data) {
          setDashboardData(res.data.data);
          setApiError(null);
        } else {
          setApiError("No data found from server.");
        }
      } catch (error) {
        console.error("API ERROR ❌", error);
        setApiError("Failed to fetch storage data.");
      } finally {
        setApiLoading(false);
      }
    };

    fetchStorage();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const parsedData = useMemo(() => {
    let listDataToRender: StorageItem[] = [];

    if (dashboardData?.storages) {
      listDataToRender = dashboardData.storages.map((apiItem: any) => {
        let percent = 0;
        if (apiItem.usedSpace && apiItem.totalSpace) {
          percent = calculatePercentage(apiItem.usedSpace, apiItem.totalSpace);
        } else {
          percent = parseFloat((apiItem.usedPercentage || apiItem.percentage || '0').toString().replace('%', ''));
        }

        return {
          id: String(apiItem.id),
          name: capitalizeFirstLetter(apiItem.name),
          percentage: percent,
          total: apiItem.totalSpace || apiItem.basePath,
        };
      });
    } else {
      listDataToRender = data && data.length > 0 ? data : storageData;
    }

    const totalSpace = parseValueAndUnit(dashboardData?.totalStorage, '780', 'TB');
    const usedSpace = parseValueAndUnit(dashboardData?.usedSpace, '331', 'TB');

    const calculatedTotalPercent = (dashboardData?.usedSpace && dashboardData?.totalStorage)
      ? calculatePercentage(dashboardData.usedSpace, dashboardData.totalStorage)
      : 42;
    const totalBarWidth = dashboardData?.usedPercentage || `${calculatedTotalPercent}%`;

    return {
      listDataToRender,
      totalSpace,
      usedSpace,
      totalBarWidth,
      freePercentage: dashboardData?.freePercentage || '58%',
    };
  }, [dashboardData, data]);

  if (isLoading || apiLoading) {
    return (
      <Card className="border-border/80 shadow-none overflow-hidden rounded">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
          <CardTitle className="text-sm font-roboto font-medium uppercase text-gray-600">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 px-4 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (apiError) {
    return (
      <Card className="border-border/80 shadow-none overflow-hidden rounded">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
          <CardTitle className="text-sm font-roboto font-medium uppercase text-gray-600">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 px-4 text-center text-red-500 font-medium">
          {apiError}
        </CardContent>
      </Card>
    );
  }

  const { listDataToRender, totalSpace, usedSpace, totalBarWidth, freePercentage } = parsedData;

  if (!listDataToRender || listDataToRender.length === 0) {
    return <div className="text-center text-muted-foreground">No storage data</div>;
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
              {totalSpace.value}
              <span className="text-xs ml-1 text-muted-foreground">{totalSpace.unit}</span>
            </p>
          </div>
          <div className="ml-5">
            <p className="text-sm uppercase font-roboto text-slate-600 font-semibold mr-4">Used</p>
            <p className="text-lg font-bold text-foreground">
              {usedSpace.value}
              <span className="text-xs ml-1 text-muted-foreground">{usedSpace.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase font-roboto text-slate-600 font-medium mr-1.5">Free</p>
            <p className="text-lg font-bold text-black">{freePercentage}</p>
          </div>
        </div>

        {/* TOTAL BAR */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: totalBarWidth,
              background: `linear-gradient(90deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
            }}
          />
        </div>

        {/* LIST */}
        <div className="space-y-1">
          {listDataToRender.map((item) => (
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
