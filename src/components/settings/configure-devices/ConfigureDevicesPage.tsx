import { useState } from "react";
// import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/Store/SettingsStore";
import { Heading } from "@/components/ui/heading";
import { configureDeviceTabs } from "@/components/settings/SidebarConfigs/ConfigureDeviceTabs";
import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import Network from "@/components/settings/configure-devices/pages/NetworkSetting";
import Recording from "@/components/settings/configure-devices/pages/Recording";
import LiveViewTabs from "@/components/settings/configure-devices/pages/LiveViewTabs";
import OtherStreamTabs from "@/components/settings/configure-devices/pages/OtherStreamTabs";
import ArchivingTabs from "@/components/settings/configure-devices/pages/ArchivingTabs";
import DeviceAlertTabs from "@/components/settings/configure-devices/pages/DeviceAlertTabs";
import { CameraTreeSidebar } from "@/components/LiveView/CameraTreeSidebar";
import { useCameraTree  } from "@/hooks/TreeSidebar";

import {
  RefreshCw,
  Trash2,
  Plus,
  Square
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Devices } from "@/components/ui/icons";


const ConfigureDevicesPage = () => {
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["property-1", "building-a", "floor-1"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { setActiveRoute, setActiveItem } = useSettingsStore();
   const [activeTab, setActiveTab] = useState("network");
  const [showSidebar, setShowSidebar] = useState(true);
  const hook = useCameraTree(dummyCameraData);



  const openAddDevicePage = () => {
    setActiveItem("add-devices"); 
    setActiveRoute("/settings/devices/adddevices");
};

  return (
    <div className="flex-1 flex flex-col  space-y-6">
             {/* Header */}
        <div className="flex items-center justify-between  border-b pb-4">
          <div>
              <Heading weight="medium" className="text-fontSize20px text-black">Configure Devices</Heading>
              <p className="font-roboto font-normal text-sm text-muted-foreground">
                  Adjust camera-specific settings for analytics processing.
              </p>
          </div>
          <Button  className="gap-2" onClick={openAddDevicePage}>
            <Plus className="h-4 w-4" />
              Add Device
          </Button> 
        </div>

      <div className="flex gap-6 min-h-[600px]">
              <CameraTreeSidebar
            isVisible={showSidebar}      
            data={dummyCameraData}      
            hook={hook}                   
            onCameraClick={(camera) => { 
              setSelectedCamera({
                id: camera.id,
                name: camera.name,
                ip: "192.168.1.101",
                status: camera.status,
              });
            }}
          />

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
                  <div className="flex items-center justify-between p-4 border-b mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center">
                        <Devices className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{selectedCamera?.name}</span>
                            <Badge 
                              variant="outline"
                              className={cn(
                                "text-xs font-medium border-0",
                                selectedCamera?.status === "online" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              )}
                            >
                            {selectedCamera?.status === "online" ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">IP: {selectedCamera?.ip}</span>
                      </div>
                    </div>
                  
                  {/* Actions */}
                <div className="flex items-center gap-2">
                    {activeTab !== "network" && activeTab !== "DeviceAlert" && (
                        <Button variant="outline" size="sm" className="gap-2 h-9 border-0 font-roboto font-medium">
                          <RefreshCw className="h-4 w-4" />
                            {activeTab === "recording" && "Sync From Device"}
                            {activeTab === "liveView" && "Refresh Live Settings"}
                            {activeTab === "OtherStream" && "Scan for Extra Streams"}
                            {activeTab === "Archiving" && "Force Sync Status"}
                        </Button>
                    )}

                  {activeTab === "recording" && (
                    <div className="relative flex items-center group">
                      <Button variant="outline" size="sm" className="w-9 h-9 p-2 bg-white ">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                      </Button>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                      opacity-0 group-hover:opacity-100 
                                      transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                        Stop Recording
                      </div>
                    </div>
                  )}


                    <Button variant="outline" size="sm" className="gap-2 h-9 bg-white font-roboto font-medium">
                      <RefreshCw className="h-4 w-4" />
                      Reboot Device
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-white">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  </div>

                    <SettingsTabs 
                     onTabChange={setActiveTab}
                      defaultValue="network" tabs={configureDeviceTabs}  className="px-4">
                            <TabsContent value="network" >
                                <Network />
                            </TabsContent>
                            <TabsContent value="recording" >
                                <Recording />
                            </TabsContent>
                            <TabsContent value="liveView" >
                              <LiveViewTabs />
                          </TabsContent>
                          <TabsContent value="OtherStream" >
                              <OtherStreamTabs />
                          </TabsContent>
                          <TabsContent value="Archiving" >
                              <ArchivingTabs />
                          </TabsContent>
                            <TabsContent value="DeviceAlert" >
                              <DeviceAlertTabs />
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
