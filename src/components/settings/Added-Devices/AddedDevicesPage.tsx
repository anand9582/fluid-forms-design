import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import { AddedDevicesTabs } from "@/components/settings/SidebarConfigs/AddedDevicesTabs";
import { AutoDiscoveryTab } from "@/components/settings/Added-Devices/Devices/AutoDiscoveryTab";
import { AddSingleTab } from "@/components/settings/Added-Devices/Devices/AddSingleTab";
import { BatchAddTab } from "@/components/settings/Added-Devices/Devices/BatchAddTab";
import { ImportCSVTab } from "@/components/settings/Added-Devices/Devices/ImportCSVTab";
import { ManageGroupsTab } from "@/components/settings/Added-Devices/Devices/ManageGroupsTab";

export function AddedDevicesPage() {
  return (
        <SettingsTabs defaultValue="auto-discovery" tabs={AddedDevicesTabs}>
            <TabsContent value="auto-discovery">
                 <AutoDiscoveryTab />
            </TabsContent>
            <TabsContent value="add-single">
                <AddSingleTab />
            </TabsContent>
            <TabsContent value="batch-add">
                <BatchAddTab />
            </TabsContent>
            <TabsContent value="import-csv">
                <ImportCSVTab />
            </TabsContent>
             <TabsContent value="manage-groups">
                <ManageGroupsTab />
            </TabsContent>
        </SettingsTabs>
    
  );
}
