// permissions.config.ts

export const ALL_PERMISSION_GROUPS = [
  {
    id: "video-access",
    name: "Video Access Control",
    permissions: [
      {
        id: "live-sd",
        title: "Live view (SD)",
        description: "View standard definition streams",
      },
      {
        id: "live-hd",
        title: "Live view (HD)",
        description: "View high definition streams",
      },
      {
        id: "playback",
        title: "Playback",
        description: "Access recorded footage",
      },
      {
        id: "ptz",
        title: "PTZ Control",
        description: "Control Pan-Tilt-Zoom cameras",
      },
      {
        id: "two-way",
        title: "Two-way Audio",
        description: "Listen and speak through cameras",
      },
      {
        id: "export",
        title: "Export Video",
        description: "Download video clips",
      },
    ],
  },

  {
    id: "system-admin",
    name: "System Administration",
    permissions: [
      {
        id: "manage-users",
        title: "Manage Users",
        description: "Create and edit user accounts",
      },
      {
        id: "assign-cameras",
        title: "Assign Cameras",
        description: "Change camera assignments",
      },
      {
        id: "firmware",
        title: "Firmware Updates",
        description: "Update device firmware",
      },
    ],
  },

  {
    id: "alerts-monitoring",
    name: "Alerts and Monitoring",
    permissions: [
      {
        id: "view-alerts",
        title: "View Alerts",
        description: "See real-time alarms",
      },
      {
        id: "ack-alerts",
        title: "Acknowledge Alerts",
        description: "Mark alerts as handled",
      },
    ],
  },
];
