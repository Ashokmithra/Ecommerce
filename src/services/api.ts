import {
  clearLocalStorage,
  getLocalStorageItem,
  storeLocalStorage,
} from "@/utils/localStorage";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getLocalStorageItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getLocalStorageItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await api.post("auth/refresh", {
            refreshToken: JSON.parse(refreshToken),
          });
          storeLocalStorage(response?.data);
          originalRequest.headers.Authorization = `Bearer ${response?.data?.accessToken}`;
          return await api(originalRequest);
        } catch (err1) {
          clearLocalStorage();
          return await Promise.reject(err1);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
