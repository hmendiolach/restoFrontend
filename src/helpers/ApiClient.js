import axios from "axios";
import { API } from "../config/config";
import Cookie from "js-cookie";

const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

let retryCounter = 0;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(error.response.status === 402) { // payment required, subscription is not active
      window.location.href = "/dashboard/inactive-subscription"
      return;
    }

    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      retryCounter+=1;

      if(retryCounter > 3) {
        Cookie.remove("restroprosaas__authenticated");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await apiClient.post("/auth/refresh-token");
        const data = res.data;

        if(res.status == 401 || res.status == 403) {
          window.location.href = "/login";
          return;
        }
        retryCounter = 0;
        return apiClient(originalRequest);
      } catch (error) {
        // Handle refresh token error (e.g., redirect to login)
        console.error(error);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;