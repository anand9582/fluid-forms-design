export const API_BASE_URL = "http://192.168.10.190:9080/api/v1";
export const API_BASE_URL2 = "http://192.168.10.190:9081/api/v1";
export const APISERVERURL = "http://192.168.10.190:8090/";
export const API_MANISH_URL = "http://192.168.10.190:8090/api";
export const API_VAISHALI_URL = "http://192.168.10.190:9081/api";
export const API_VIVEK_URL = "http://192.168.10.190:9081";

export const API_URLS = {
  Login: "/auth/login",
  GetRolesByRoleType: "/roles/get-all-roles",
  GetRoleByRoleId: "/roles/get-role-by-roleId",
  CreateRole: "/roles/create-role",
  UpdateRoleById: "/roles/update-role-by-roleId",
  DiscoverDevices: "/devices/discover",
  GetAllDevice: "/devices/get-all-devices",
  DeleteDeviceById: "/devices/delete-device-by-id",
  Liveview: "api/liveview/",
  get_all_devices: "device/get-all-devices",
  create_retention_policy: "/retention-policies/create-retention-policy",
  get_retention_policies: "/retention-policies/get-all-retention-policies",
  create_view: "/createView",
  update_view: "/updateViewById/",
  get_all_views: "/getAllViews",
  get_view_by_id: "/getViewById",
  delete_view_by_id: "/deleteViewById",
  get_storage_drives: "/storage/drives",
  create_fixed_storage: "/storage/create-fixed-storage",
  create_nas_storage: "/storage/create-nas-storage",
  get_all_storages: "/storage/get-all-storages",
  get_storage_by_id: "/storage/get-storage-by-storage-id",
  delete_storage_by_id: "/storage/delete-storage-by-storage-id",
  update_primary_storage_by_id: "/storage/update-primary-storage-by-external-device-id",
  update_secondary_storage_by_id: "/storage/update-secondary-storage-by-external-device-id",
  get_devices_by_storage_id: "/storage/get-devices-by-storage-id",
  stop_recording: "/storage/stop-recording",
  move_devices: "/storage/move-devices",
  Bookmark: "api/bookmarks/addBookmark",
  DELETE_BOOKMARK: "api/bookmarks/deleteBookmark",
  DeviceStatus: "metadata/status/all",
  AddDevices: "/devices/add-devices",
  Bookmark_List: "api/bookmarks/bookmarkList",
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};


