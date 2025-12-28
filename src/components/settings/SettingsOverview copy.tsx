import { useState } from "react";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsTabs } from "@/components/settings/SettingsTab";
import { RolesPanel } from "@/components/settings/RolesPanel";
import { PermissionsContent } from "@/components/settings/PermissionsContent";


const SettingsOverview = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("manage-users");   
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState("operator-l1");

  const getRoleName = (roleId: string) => {
    const roleNames: Record<string, string> = {
      "operator-l1": "Operator L1",
      "operator-l2": "Operator L2",
    };
    return roleNames[roleId] || roleId;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
          <SettingsSidebar
            activeItem={activeSidebarItem}
            onItemClick={setActiveSidebarItem}
          />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Panel */}
          <div className="flex flex-1 overflow-hidden bg-muted/30">
            {/* Roles Panel */}
            <RolesPanel
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />

            <PermissionsContent roleName={getRoleName(selectedRole)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview;
