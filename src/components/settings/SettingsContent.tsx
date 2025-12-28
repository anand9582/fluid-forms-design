import { useState, useEffect } from "react";
import { SettingsTabs } from "@/components/settings/SettingsTab";
import { RolesContent } from "@/components/settings/tabContents/RolesContent";
import { UsersContent } from "@/components/settings/tabContents/UsersContent";
import { AuditContent } from "@/components/settings/tabContents/AuditContent";

interface Props {
  activeSidebarItem: string;
}

const sidebarToTabMap: Record<string, string> = {
  "manage-users": "roles",
  "manage-devices": "users",
  "storage": "audit",
  "api-sdk": "roles",
  "video-analytics": "audit",
  "licensing": "users",
};

export const SettingsContent = ({ activeSidebarItem }: Props) => {
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState("operator-l1");

  useEffect(() => {
    if (sidebarToTabMap[activeSidebarItem]) {
      setActiveTab(sidebarToTabMap[activeSidebarItem]);
    }
  }, [activeSidebarItem]);

  const getRoleName = (roleId: string) => ({
    "operator-l1": "Operator L1",
    "operator-l2": "Operator L2",
  }[roleId] || roleId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "roles" && (
          <RolesContent
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
            getRoleName={getRoleName}
          />
        )}

        {activeTab === "users" && <UsersContent />}

        {activeTab === "audit" && <AuditContent />}
      </SettingsTabs>
    </div>
  );
};
