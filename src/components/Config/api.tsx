export const API_BASE_URL = "http://192.168.11.61:9080/api/v1";

export const API_URLS = {
  Login: "/auth/login",
  GetRolesByRoleType: "/roles/get-roles-by-role-type",
  GetRoleByRoleId: "/roles/get-role-by-roleId",
  CreateRole: "/roles/create-role",
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
