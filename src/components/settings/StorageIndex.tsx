import { Button } from "@/components/ui/button";
import { StorageVolume } from "@/components/settings/Storage/StorageVolumes";
import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import { StorageTabs } from "@/components/settings/SidebarConfigs/StorageTabs"; 
import { RetentionPoliciesTable } from "@/components/settings/Storage/RetentionPoliciesTable";
import { FailoverRedundancy } from "@/components/settings/Storage/FailoverRedundancy";
import {
  Plus,
} from "lucide-react";

export default function StorageIndex() {
  return (
        <SettingsTabs defaultValue="Storagevloume" tabs={StorageTabs}>
                    <TabsContent value="Storagevloume" >
                        <StorageVolume />
                    </TabsContent>
                    <TabsContent value="RetentionPolicies"  className="mt-6 space-y-6">
                          
                        <RetentionPoliciesTable />
                    </TabsContent>
                      <TabsContent value="FailoverRedundancy" >
                           <FailoverRedundancy />
                    </TabsContent>
            </SettingsTabs>
  );
}
