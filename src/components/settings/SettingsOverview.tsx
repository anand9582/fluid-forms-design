    import { useState, Suspense } from "react";
    import { SettingsSidebar } from "./SettingsSidebar";
    import { SettingsTabs, TabsContent } from "./SettingsTab";
    import { manageUsersTabs } from "./tabConfigs/ManageUsers";
    import { AddDevicesPage } from "./AddedDevices";
    import RolesContent from "./tabContents/RolesContent";
    import UsersContent from "./tabContents/UsersContent";
    import AuditContent from "./tabContents/AuditContent";
    import ConfigureDevicesPage from "./configure-devices/ConfigureDevicesPage";
     import StorageIndex from "./StorageIndex";
    import { AddedDevicesPage } from "@/components/settings/Added-Devices/AddedDevicesPage";
    import { useSettingsStore } from "@/Store/SettingsStore"; 
    import { useRoleStore } from "@/Store/RoleStore";

    export default function SettingsOverview() {
      const { 
        activeRoute, 
        setActiveItem, 
        setActiveRoute, 
      } = useSettingsStore();

    const { selectedRoleId, setSelectedRole } = useRoleStore();

     const handleNavigate = (route: string, id: string) => {
        setActiveItem(id);
        setActiveRoute(route);
     };


      return (
        <div className="flex min-h-screen bg-muted/20">
          <SettingsSidebar
            onNavigate={handleNavigate}
          />

          <div className="flex-1 overflow-hidden pl-4" >
            {activeRoute === "/settings/users" && (
              <SettingsTabs
                tabs={manageUsersTabs}
                defaultValue="roles"
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

            {activeRoute === "/settings/storage" && (
              <StorageIndex />
              )}
          </div>
        </div>
      );
    }
