import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { DevicesDataTable, DiscoveredDevice } from "@/components/settings/Added-Devices/Devices/DevicesDataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockDiscoveredDevices: DiscoveredDevice[] = [
  { id: "1", name: "Cam-A-100", ip: "192.168.1.100:80", port: "80", make: "Axis", model: "Model-XO", type: "Camera", username: "Admin", password: "pass1234", group: "Main Hall" },
  { id: "2", name: "Cam-A-101", ip: "192.168.1.101:80", port: "8080", make: "Axis", model: "Model-XO", type: "NVR", username: "Operator", password: "pass5678", group: "Server Room" },
  { id: "3", name: "Cam-A-102", ip: "192.168.1.102:80", port: "80", make: "Axis", model: "Model-XO", type: "Router", username: "Admin", password: "pass9012", group: "Lobby" },
  { id: "4", name: "Cam-A-103", ip: "192.168.1.103:80", port: "443", make: "Axis", model: "Model-XO", type: "Access Control", username: "Admin", password: "pass3456", group: "Front roof" },
  { id: "5", name: "Cam-A-104", ip: "192.168.1.104:80", port: "78", make: "Axis", model: "Model-XO", type: "IOT Center", username: "Operator", password: "pass7890", group: "First floor" },
  { id: "6", name: "Cam-A-105", ip: "192.168.1.104:80", port: "663", make: "Axis", model: "Model-XO", type: "Camera", username: "Operator", password: "pass1122", group: "Second floor" },
  { id: "7", name: "Cam-A-105", ip: "192.168.1.104:80", port: "663", make: "Axis", model: "Model-XO", type: "Camera", username: "Operator", password: "pass1122", group: "Second floor" },
  { id: "8", name: "Cam-A-105", ip: "192.168.1.104:80", port: "663", make: "Axis", model: "Model-XO", type: "Camera", username: "Operator", password: "pass1122", group: "Second floor" },
  { id: "9", name: "Cam-A-105", ip: "192.168.1.104:80", port: "663", make: "Axis", model: "Model-XO", type: "Camera", username: "Operator", password: "pass1122", group: "Second floor" },
  { id: "10", name: "Cam-A-105", ip: "192.168.1.104:80", port: "663", make: "Axis", model: "Model-XO", type: "Camera", username: "Operator", password: "pass1122", group: "Second floor" },
];

export function AutoDiscoveryTab() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<DiscoveredDevice[]>(mockDiscoveredDevices);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleAddSelected = () => {
    // Handle adding selected devices
    console.log(`Adding ${selectedCount} devices`);
  };

  return (
    <div className="mt-3 sm:mt-3 space-y-4 sm:space-y-6">
      {/* Network Scanner Section */}
      <Card className="border-border border-[#BFDEFFB2] bg-blue-50/50 rounded-sm bg-[#EFF6FF]">
      <CardContent className="flex items-center justify-between p-4">
        {/* Left Content */}
        <div className="space-y-1">
          <h3 className="text-fontSize16px font-semibold text-blue-600 font-roboto">
            Network Scanner
          </h3>
           <p className="text-xs sm:text-sm font-normal text-blue-600 font-roboto">
              Scan the local subnet (192.168.1.0/24) for ONVIF compatible devices.
            </p>
        </div>

        {/* Right Button */}
        <Button 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-4"
            onClick={handleStartScan}
            disabled={isScanning}
          >
            <Search className="h-4 w-4 " />
            {isScanning ? "Scanning..." : "Start scan"}
          </Button>
      </CardContent>
      </Card>
      {/* Discovered Devices Section */}
      <div className="bg-white rounded-lg">
          <div className="flex border border-b-0 px-3 py-3 rounded-t-lg flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-3">
            <h3 className="text-base  font-lg font-roboto font-medium text-foreground">
              Discovered Devices ({devices.length})
            </h3>
            <Button 
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={handleAddSelected}
              disabled={selectedCount === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add selected ({selectedCount})
            </Button>
          </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] px-4 sm:px-0">
            <DevicesDataTable 
              data={devices}
              selectedCount={selectedCount}
              onSelectionChange={setSelectedCount}
            />
          </div>
        </div>


      </div>
    </div>
  );
}
