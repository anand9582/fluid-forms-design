import { useState, useEffect } from "react";
import { SettingsTabs } from "@/components/settings/SettingsTab";
import { RolesContent } from "@/components/settings/tabContents/RolesContent";
import { UsersContent } from "@/components/settings/tabContents/UsersContent";
import { AuditContent } from "@/components/settings/tabContents/AuditContent";

interface Props {
  activeSidebarItem: string;
}



export const ManageDevicesPage = () => {
  return <div>Manage Devices</div>;
};
