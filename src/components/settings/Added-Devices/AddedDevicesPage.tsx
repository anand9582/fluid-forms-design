import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import { AddedDevicesTabs } from "@/components/settings/SidebarConfigs/AddedDevicesTabs";
import { AutoDiscoveryTab } from "@/components/settings/Added-Devices/Devices/AutoDiscoveryTab";

export function AddedDevicesPage() {
  return (
        <SettingsTabs defaultValue="auto-discovery" tabs={AddedDevicesTabs}>
            <TabsContent value="auto-discovery">
                 <AutoDiscoveryTab />
            </TabsContent>

            <TabsContent value="recording">
              Recording settings here
            </TabsContent>
        </SettingsTabs>
    
  );
}
