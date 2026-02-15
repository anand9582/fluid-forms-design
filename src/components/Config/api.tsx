export const API_BASE_URL = "http://192.168.11.61:9080/api/v1";
export const API_BASE_URL2 = "http://192.168.10.107:8081/api/v1";
export const APISERVERURL = "http://192.168.10.190:8090/";

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
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};


