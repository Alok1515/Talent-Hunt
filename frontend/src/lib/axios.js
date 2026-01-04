import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor to add Clerk token to headers
axiosInstance.interceptors.request.use(async (config) => {
  try {
    // If Clerk is available on window (it should be since it's loaded in main.jsx)
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error getting Clerk token for axios:", error);
  }
  return config;
});

export default axiosInstance;
