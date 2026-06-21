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
    console.log(
      `[API Response Succes] Cererea către ${response.config.url} a răspuns cu status: ${response.status}`,
    );
    return response;
  },
  async (error) => {
    console.log("[API Response Eroare] Interceptorul a prins o eroare!");
    console.log("-> Status cod:", error.response?.status);
    console.log("-> Date eroare din backend:", error.response?.data);

    const originalRequest = error.config;

    // Verificăm dacă intră în această condiție
    if (error.response?.status === 403) {
      console.log(
        "-> Codul este 401! Verificăm dacă a fost deja reîncercat:",
        originalRequest._retry ? "DA" : "NU",
      );

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        console.log(
          "-> Condiția e îndeplinită! SE APLEAZĂ METODA DE REFRESH ACUM...",
        );

        try {
          // Schimbă ruta dacă backend-ul tău folosește altceva (ex: /api/refresh)
          const refreshUrl = `${API_URL}/users/refresh`;
          console.log(`-> Trimitere POST brut către: ${refreshUrl}`);

          const response = await axios.post(
            refreshUrl,
            {},
            { withCredentials: true },
          );
          console.log("-> Răspuns primit la refresh:", response.data);

          const newToken =
            response.data?.accessToken || response.data?.token || response.data;
          console.log(
            "-> Noul token extras:",
            newToken ? "S-a găsit string" : "E UNDEFINED/GOL",
          );

          if (newToken) {
            localStorage.setItem("token", newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            console.log("-> Se retrimite cererea inițială cu noul token...");
            return API(originalRequest);
          }
        } catch (refreshError) {
          console.error(
            "-> [CRITIC] Cererea de refresh a picat complet:",
            refreshError.message,
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    } else {
      console.log(
        "-> Eroarea NU este 401, deci interceptorul de refresh a ignorat-o.",
      );
    }

    return Promise.reject(error);
  },
);
export default API;
