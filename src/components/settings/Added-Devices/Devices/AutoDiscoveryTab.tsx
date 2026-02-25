import { useState } from "react";
import axios from "axios";
import { Search, Plus,Loader2 } from "lucide-react";
import { DevicesDataTable, DiscoveredDevice } from "@/components/settings/Added-Devices/Devices/DevicesDataTable";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL2, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/SweetAlertpopup/ToastService";
import { useSettingsStore } from "@/Store/SettingsStore"; 
import { showAlert } from "@/components/SweetAlertpopup/SweetAlert";

export function AutoDiscoveryTab() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedDevices, setSelectedDevices] = useState<DiscoveredDevice[]>([]);
      const { 
        setActiveItem, 
        setActiveRoute, 
      } = useSettingsStore();

  /* ---------------- SCAN DEVICES ---------------- */
  const handleStartScan = async () => {
    setIsScanning(true);
    setDevices([]); 

    try {
      const res = await axios.post(
        `${API_BASE_URL2}${API_URLS.DiscoverDevices}`,
        {},
        { headers: getAuthHeaders() }
      );

      if (res.data.message) {
        showToast({
          title: res.data.message,
          type: res.data.success ? "success" : "error",
        });
      }

      if (res.data.success) {
        const discovered: DiscoveredDevice[] = res.data.data.map(
          (d: any, index: number) => ({
            id: String(index + 1),
            name: d.name || "N/A",
            ip: d.ipAddress || "N/A",
            port: d.port || "80",
            make: d.make || "N/A",
            model: d.model || "N/A",
            type: d.deviceType || "N/A",
            username: d.username || "",
            password: d.password || "",
            group: "N/A",
          })
        );
        setDevices(discovered);
      } else {
        setDevices([]);
      }
    } catch (err: any) {
      showToast({
        title: err?.message || "Failed to discover devices",
        type: "error",
      });
      setDevices([]);
    } finally {
      setIsScanning(false); 
    }
  };

  /* ---------------- ADD SELECTED ---------------- */
const handleAddSelected = async () => {
  try {
    const payload = selectedDevices.map((d) => ({
      name: d.name,
      ipAddress: d.ip,
      port: Number(d.port),
      username: d.username,
      password: d.password,
      make: d.make,
      model: d.model,
      authType: "DIGEST",
    }));

    const response = await axios.post(
      "http://192.168.10.190:9081/api/v1/devices/add-devices",
      payload
    );

    const { addedDevices, failedDevices, totalAdded, totalFailed } =
      response.data.data;

    if (totalAdded > 0 && totalFailed === 0) {
      showAlert(
        "Success",
        `${totalAdded} device(s) added successfully`,
        "success"
      );
      setActiveItem("add-devices");
      setActiveRoute("/settings/devices/add");
    } else if (totalAdded > 0 && totalFailed > 0) {
      showAlert(
        "Partial Success",
        `${totalAdded} added, ${totalFailed} failed`,
        "warning"
      );
    } else {
      showAlert("Error", "All devices failed to add", "error");
    }

    console.log("Added Devices:", addedDevices);
    console.log("Failed Devices:", failedDevices);
  } catch (error: any) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || "API error occurred"
      : "Unexpected error occurred";
    showAlert("Error", message, "error");
  }
};


//   const handleAddSelected = async () => {
//   try {
//     const payload = selectedDevices.map((d) => ({
//       name: d.name,
//       ipAddress: d.ip,
//       port: Number(d.port),
//       username: d.username,
//       password: d.password,
//       make: d.make,
//       model: d.model,
//       authType: "DIGEST",
//     }));

//     const response = await axios.post(
//       "http://192.168.10.190:9081/api/v1/devices/add-devices",
//       payload
//     );

//     const { totalAdded, totalFailed } = response.data.data;

//     if (totalAdded > 0) {
//       showToast({
//         title:
//           totalFailed === 0
//             ? `${totalAdded} device added successfully`
//             : `${totalAdded} added, ${totalFailed} failed`,
//         type: totalFailed === 0 ? "success" : "warning",
//       });

//       setActiveItem("add-devices"); 
//       setActiveRoute("/settings/devices/add"); 
//     } else {
//       showToast({
//         title: "All devices failed to add",
//         type: "error",
//       });
//     }
//   } catch (error: any) {
//     showToast({
//       title:
//         error?.response?.data?.message || "Failed to add devices",
//       type: "error",
//     });
//   }
// };

  return (
    <div className="space-y-4">
      {/* Network Scanner */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="flex items-center justify-between p-4">
          <div>
              <h3 className="text-blue-600 font-medium">Network Scanner</h3>
                <p className="text-sm text-blue-600">
                  Scan for ONVIF compatible devices
                </p>
          </div>

            <Button
            onClick={handleStartScan}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Start Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Discovered Devices */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium">
              Discovered Devices ({devices.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <DevicesDataTable
            data={devices}
            onSelectionChange={setSelectedCount}
            onSelectedDevicesChange={setSelectedDevices}
            onDataChange={setDevices}
          />
        </div>
      </div>

      {selectedCount > 0 && (
          <div className="bottom-0 left-0 right-0 bg-slate-200 rounded-md mt-4 text-white px-6 py-3 flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium">
                {selectedCount}
              </span>
              <span className="text-sm font-medium text-gray-700">
                Device selected for bulk processing
              </span>
            </div>

            <div className="flex items-center gap-3">
                <Button size="sm" onClick={handleAddSelected}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Selected ({selectedCount})
                 </Button>
            </div>
          </div>
      )}
    </div>
  );
}
