// pages/DeviceSetup.jsx
import { useEffect, useState } from "react";
import { Scan, HardDrive } from "lucide-react";
import { Wizard } from "@/components/Wizard/Wizard";
import { getDevices } from "@/services/deviceService";

export default function DeviceSetup() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function fetchDevices() {
      const data = await getDevices();
      setDevices(data);
    }
    fetchDevices();
  }, []);

  const stepsData = [
    { id: 1, title: "Add Device", description: `You have ${devices.length} devices.`, primaryAction: "Next", secondaryAction: "Back" },
    { id: 2, title: "Configure Storage", description: "Set up your storage", primaryAction: "Next", secondaryAction: "Back" },
  ];

  const navButtonsData = [
    { icon: Scan, label: "Scan Device" },
    { icon: HardDrive, label: "Add Storage" },
  ];

  return <Wizard title="Device Setup" steps={stepsData} navButtons={navButtonsData} size="medium" onFinish={() => alert("Wizard Finished")} />;
}
