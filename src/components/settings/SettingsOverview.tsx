  // SettingsOverview.tsx
  import { useState, Suspense, lazy } from "react";
  import { SettingsSidebar } from "./SettingsSidebar";
  import { SettingsTabs, TabsContent } from "./SettingsTab";
  import { manageUsersTabs } from "./tabConfigs/ManageUsers";
  import { AddDeviceTabs } from "./tabConfigs/AddDevices";

  import RolesContent from "./tabContents/RolesContent";
  import UsersContent from "./tabContents/UsersContent";
  import AuditContent from "./tabContents/AuditContent";


  // Map default tab per sidebar item
  const defaultTabMap: Record<string, string> = {
      "manage-users": "roles",
      "add-devices": "discover",
      "storage": "volumes",
  };

  export default function SettingsOverview() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("manage-users");
    const [activeTab, setActiveTab] = useState(defaultTabMap["manage-users"]);
    const [selectedRole, setSelectedRole] = useState("admin-super");

    const handleSidebarClick = (id: string) => {
      setActiveSidebarItem(id);
      setActiveTab(defaultTabMap[id]);
    };

    const getTabsForSidebar = () => {
      if (activeSidebarItem === "manage-users") return manageUsersTabs;
      if (activeSidebarItem === "add-devices") return AddDeviceTabs;
      // if (activeSidebarItem === "storage") return storageTabs;
      return [];
    };

    return (
      <div className="flex min-h-screen bg-muted/20">
        <SettingsSidebar
          activeItem={activeSidebarItem}
          onItemClick={handleSidebarClick}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {getTabsForSidebar().length > 0 && (
            <SettingsTabs
              tabs={getTabsForSidebar()}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              {/* MANAGE USERS */}
              {activeSidebarItem === "manage-users" && (
                <>
                  <TabsContent value="roles">
                        <RolesContent
                          selectedRole={selectedRole}
                          onRoleSelect={setSelectedRole}
                          getRoleName={() => ""}
                        />
                  </TabsContent>

                  <TabsContent value="users">
                      <Suspense fallback="Loading...">
                           <UsersContent />
                      </Suspense>
                  </TabsContent>

                  <TabsContent value="audit">
                    <Suspense fallback="Loading...">
                      <AuditContent />
                    </Suspense>
                  </TabsContent>
                </>
              )}

              {/* ADD DEVICES */}
              {activeSidebarItem === "add-devices" && (
                <>
                  <TabsContent value="discover">
                    <Suspense fallback="Loading...">
                           <UsersContent />
                      </Suspense>
                  </TabsContent>
                  <TabsContent value="manual">Manual Add</TabsContent>
                  <TabsContent value="bulk">Bulk Upload</TabsContent>
                </>
              )}

              {/* STORAGE */}
              {activeSidebarItem === "storage" && (
                <>
                  <TabsContent value="volumes">Storage Volumes</TabsContent>
                  <TabsContent value="retention">Retention Policies</TabsContent>
                  <TabsContent value="failover">Failover & Redundancy</TabsContent>
                </>
              )}
            </SettingsTabs>
          )}

          {/* NON-TAB PAGES */}
          {activeSidebarItem === "configure-devices" && (
            <h1 className="p-6">Configure Devices</h1>
          )}
        </div>
      </div>
    );
  }

