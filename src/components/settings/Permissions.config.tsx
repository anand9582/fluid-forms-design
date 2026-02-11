export const ALL_PERMISSION_GROUPS = [
  {
    id: "LIVEVIEW",
    name: "LiveView",
    permissions: [
      { id: "LiveView_HD", title: "LiveView(HD)", description: "View live video in HD" },
      { id: "LiveView_SD", title: "LiveView(SD)", description: "View live video in SD" },
      { id: "PTZControl", title: "PTZ Control", description: "Pan, Tilt and Zoom camera" },
      { id: "Snapshot", title: "Snapshot", description: "Capture snapshot" },
      { id: "TwoWayAudio", title: "Two-way Audio", description: "Two-way audio communication" },
    ],
  },
  {
    id: "PLAYBACK",
    name: "Playback",
    permissions: [
      { id: "ExportVideo", title: "Export Video", description: "Export recorded videos" },
      { id: "PlayBack", title: "Playback", description: "Play recorded videos" },
    ],
  },
  {
    id: "ALERTS",
    name: "Alerts",
    permissions: [
      { id: "Acknowledge_Alerts", title: "Acknowledge Alerts", description: "Mark alerts as handled" },
      { id: "View_Alerts", title: "View Alerts", description: "See real-time alarms" },
    ],
  },
  {
    id: "EMap",
    name: "E-Map",
    permissions: [
      { id: "Manage_EMap", title: "Manage E-Map", description: "Manage E-Map" },
      { id: "View_EMap", title: "View E-Map", description: "View E-Map" },
    ],
  },
  {
    id: "HEALTH",
    name: "Health",
    permissions: [
      { id: "Export_Health_Report", title: "Export Health Report", description: "Export health reports" },
      { id: "System_Health", title: "System Health", description: "Monitor system health" },
    ],
  },
  {
    id: "SYSTEM_ADMINISTRATION",
    name: "System Administration",
    permissions: [
      { id: "Device_Configurations", title: "Device Configurations", description: "Configure devices" },
      { id: "Licensing", title: "Licensing", description: "Manage licenses" },
      { id: "Manage_Analytics", title: "Manage Analytics", description: "Manage analytics" },
      { id: "Manage_Devices", title: "Manage Devices", description: "Manage devices" },
      { id: "Manage_Recording", title: "Manage Recording", description: "Manage recording settings" },
      { id: "Manage_Storage", title: "Manage Storage", description: "Manage storage settings" },
      { id: "Manage_Users", title: "Manage Users", description: "Manage users and roles" },
    ],
  },
];

