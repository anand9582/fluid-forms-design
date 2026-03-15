import { SettingsTabs, TabsContent } from "@/components/settings/SettingsTab";
import { manageUsersTabs } from "@/components/settings/tabConfigs/ManageUsers";
import RolesContent from "@/components/settings/tabContents/RolesContent";
import UsersContent from "@/components/settings/tabContents/UsersContent";
import AuditContent from "@/components/settings/tabContents/AuditContent";
import { useRoleStore } from "@/Store/RoleStore";

export function ManageUsersTabs() {
  const { selectedRoleId, setSelectedRole } = useRoleStore();

  return (
    <SettingsTabs tabs={manageUsersTabs} defaultValue="roles">
      
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
  );
}