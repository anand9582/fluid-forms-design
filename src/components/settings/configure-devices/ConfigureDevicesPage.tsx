import { useState } from "react"
import DeviceTreePanel from "./DeviceTreePanel"
import DeviceConfigContent from "./DeviceConfigContent"

export default function ConfigureDevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>("camera-1")

  return (
    <div className="flex h-full">
      {/* LEFT */}
      <DeviceTreePanel
        selectedDevice={selectedDevice}
        onSelect={setSelectedDevice}
      />

      {/* RIGHT */}
      <DeviceConfigContent deviceId={selectedDevice} />
    </div>
  )
}
