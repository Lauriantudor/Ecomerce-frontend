import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // CORECTURĂ: Folosim o funcție de filtrare (bypass) pentru rutele de backend.
      // Dacă cererea vine de la browser (vrea o pagină HTML, cum e la refresh), o lăsăm să meargă în React.
      // Dacă cererea vine de la Axios (vrea JSON/date), o trimitem la backend pe portul 3000.
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/cart": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          // Dacă browserul cere o pagină web (apasă refresh), NU trimite la backend, lasă React-ul să se încarce
          if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/products": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/categories": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
