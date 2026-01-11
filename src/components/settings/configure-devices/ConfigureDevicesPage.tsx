import { useState } from "react";
import { CameraSidebarTree } from "@/components/settings/CameraTreeSidebar";
import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";

import CameraDetails from "@/components/settings/tabContents/Tabs_configure/CameraDetails";
import { CameraLogs } from "@/components/settings/tabContents/Tabs_configure/CameraLogs";
import CameraSettings from "@/components/settings/tabContents/Tabs_configure/CameraSettings";


export default function ConfigureDevicesPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="flex h-full bg-white rounded-md">
      {/* LEFT – Camera Tree */}
      <CameraSidebarTree
        activeItem={selectedNodeId}
        onNavigate={(id) => setSelectedNodeId(id)}
      />

      {/* RIGHT – Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedNodeId ? (
          <div className="p-6 text-muted-foreground">
            Select a camera to configure
          </div>
        ) : (
          <SettingsTabs
            tabs={[
              { id: "details", label: "Details" },
              { id: "logs", label: "Logs" },
              { id: "settings", label: "Settings" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <TabsContent value="details">
              <CameraDetails cameraId={selectedNodeId} />
            </TabsContent>

            <TabsContent value="logs">
              <CameraLogs cameraId={selectedNodeId} />
            </TabsContent>

            <TabsContent value="settings">
              <CameraSettings cameraId={selectedNodeId} />
            </TabsContent>
          </SettingsTabs>
        )}
      </div>
    </div>
  );
}
