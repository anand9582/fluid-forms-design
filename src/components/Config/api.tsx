export const API_BASE_URL = "http://192.168.10.190:9080/api/v1";
export const API_BASE_URL2 = "http://192.168.10.190:9081/api/v1";
export const APISERVERURL = "http://192.168.10.190:8090/";
export const API_MANISH_URL = "http://192.168.11.212:8080/api";
export const API_VAISHALI_URL = "http://192.168.10.107:9081/api";

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
  update_view: "/updateViewById/6",
  get_view_by_id: "/getViewById/6",
  delete_view_by_id: "/deleteViewById/6",
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};


