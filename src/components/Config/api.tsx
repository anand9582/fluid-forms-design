// Base URL for your API
export const API_BASE_URL = "http://192.168.11.61:8080/api/v1";

export const API_URLS = {
  Login: "/auth/login",
};

// Helper for fetch headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
