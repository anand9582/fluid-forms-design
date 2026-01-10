import { useState } from "react"
import CameraDetails from "../tabContents/Tabs_configure/CameraDetails"
import CameraSettings from "../tabContents/Tabs_configure/CameraSettings"
import CameraLogs from "../tabContents/Tabs_configure/CameraLogs"

interface Props {
  deviceId: string | null
}

export default function DeviceConfigContent({ deviceId }: Props) {
  const [activeTab, setActiveTab] = useState("details")

  if (!deviceId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a device
      </div>
    )
  }

  return (
    <div className="flex-1 p-4">
      {/* TOP TABS */}
      <div className="flex gap-6 border-b mb-4">
        {["details", "settings", "logs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-muted-foreground"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "details" && <CameraDetails />}
      {activeTab === "settings" && <CameraSettings />}
      {activeTab === "logs" && <CameraLogs />}
    </div>
  )
}
