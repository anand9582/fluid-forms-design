// rolePermissions.ts
export const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  "admin-super": [
    // Video permissions
    "live-sd",
    "live-hd",
    "playback",
    "ptz",
    "two-way",
    "export",

    // System permissions
    "manage-users",
    "assign-cameras",
    "firmware",

    // Alerts and Monitoring
     "manage-users",
    "assign-cameras",
    "firmware",
  ],

  "admin-sub": [
    "live-sd",
    "playback",
    "users",
    "roles",
    "logs",
  ],

  operator: [
    "live-sd",
    "live-hd",
    "playback",
    "users",
    "logs",
  ],

  viewer: ["live-sd", "playback"],
};
