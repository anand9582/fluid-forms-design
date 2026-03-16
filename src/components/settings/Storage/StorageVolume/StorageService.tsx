import { API_MANISH_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { Server, HardDrive, Cloud } from "lucide-react";
import { StorageUnit } from "@/components/settings/Storage/StorageVolume/StorageUnits";

export async function getStorageUnits(): Promise<StorageUnit[]> {
  try {
    const response = await fetch(`${API_MANISH_URL}${API_URLS.get_all_storages}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch storages");
    }

    const json = await response.json();
    const data = json.data || [];

    return data.map((item: any) => {
      // Parse "138.6 GB" -> 138.6
      const used = parseFloat(item.usedSpaceGb) || 0;
      const total = parseFloat(item.totalSpaceGb) || 1; // avoid div by zero

      const type = item.type === "FIXED" ? "HDD Storage Unit" : "NAS Storage Unit";
      const icon = item.type === "FIXED" ? HardDrive : Server;

      return {
        id: String(item.id),
        name: item.name,
        type: type,
        icon: icon,
        badge: item.isDefault ? "Default" : undefined,
        devices: item.deviceCount || 0,
        load: Math.round((used / total) * 100),
        retention: `${item.estimatedRetentionDays || 0} Days remaining`,
        retentionWarn: (item.estimatedRetentionDays || 0) < 2,
        hardDiscs: item.type === "FIXED" ? 1 : 4, // Placeholder for hardDiscs count
        used: used,
        total: total,
        category: (item.role === "PRIMARY" || item.isDefault) ? "primary" : "secondary"
      };
    });
  } catch (error) {
    console.error("Error fetching storage units:", error);
    return [];
  }
}
