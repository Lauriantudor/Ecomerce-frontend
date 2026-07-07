import axios from "axios";

const API_URL = "http://localhost:3000";

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

// 1. Adăugare token automat la fiecare cerere (Request Interceptor)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verificăm dacă intră în această condiție
    if (error.response?.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Schimbă ruta dacă backend-ul tău folosește altceva (ex: /api/refresh)
          const refreshUrl = `${API_URL}/users/refresh`;
          const response = await axios.post(
            refreshUrl,
            {},
            { withCredentials: true },
          );

          const newToken =
            response.data?.accessToken || response.data?.token || response.data;

          if (newToken) {
            localStorage.setItem("token", newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            return API(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
export default API;
