    import { useState, Suspense } from "react";
    import { SettingsSidebar } from "./SettingsSidebar";
    import { SettingsTabs, TabsContent } from "./SettingsTab";
    import { manageUsersTabs } from "./tabConfigs/ManageUsers";
    import { AddDeviceTabs } from "./tabConfigs/AddDevices"; 
    import { AddDevicesPage } from "./AddedDevices";
    import RolesContent from "./tabContents/RolesContent";
    import UsersContent from "./tabContents/UsersContent";
    import AuditContent from "./tabContents/AuditContent";
    import ConfigureDevicesPage from "./configure-devices/ConfigureDevicesPage";
    import { AddedDevicesPage } from "@/components/settings/Added-Devices/AddedDevicesPage";
    import { useSettingsStore } from "@/Store/SettingsStore"; 
    import { useRoleStore } from "@/Store/RoleStore";

    export default function SettingsOverview() {
      const { 
        activeItem, 
        activeRoute, 
        activeTab, 
        setActiveItem, 
        setActiveRoute, 
        setActiveTab 
      } = useSettingsStore();

    const { selectedRoleId, setSelectedRole } = useRoleStore();

     const handleNavigate = (route: string, id: string) => {
        setActiveItem(id);
        setActiveRoute(route);
     };


      return (
        <div className="flex min-h-screen bg-muted/20">
          <SettingsSidebar
            activeItem={activeItem}
            onNavigate={handleNavigate}
          />

          <div className="flex-1 overflow-hidden">
            {activeRoute === "/settings/users" && (
              <SettingsTabs
                tabs={manageUsersTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                <TabsContent value="roles">
                  <RolesContent
                    selectedRole={selectedRoleId}
                    onRoleSelect={setSelectedRole}
                    getRoleName={() => ""}
                  />
                </TabsContent>

                <TabsContent value="users">
                    <UsersContent />
                </TabsContent>

                <TabsContent value="audit">
                    <AuditContent />
                </TabsContent>
              </SettingsTabs>
            )}

            {activeRoute === "/settings/devices/add" && <AddDevicesPage />}
            {activeRoute === "/settings/devices/adddevices" && <AddedDevicesPage />}
            {activeRoute === "/settings/devices/configure" && (
              <ConfigureDevicesPage />
            )}

            {/* {activeRoute === "/settings/storage" && (
              <SettingsTabs
                tabs={AddDeviceTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                <TabsContent value="volumes">Storage Volumes</TabsContent>
                <TabsContent value="retention">Retention Policies</TabsContent>
                <TabsContent value="failover">Failover</TabsContent>
              </SettingsTabs>
            )} */}
          </div>
        </div>
      );
    }
