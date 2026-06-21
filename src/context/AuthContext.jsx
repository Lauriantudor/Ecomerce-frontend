import React, { createContext, useState, useContext, useEffect } from "react";
// Importăm instanța configurată de tine, nu axios-ul gol!
import API from "../services/api";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // La pornirea aplicației, verificăm dacă avem deja un utilizator salvat
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Eroare la citirea userului din localStorage", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log(
        "Se încearcă logarea prin serviciul authService pentru:",
        email,
      );

      // Apelăm funcția din authService
      const res = await authService.login(email, password);

      if (res) {
        console.log("Răspuns primit de la serviciu:", res);

        // 1. Extragere Token (Aici era deja ok la tine, dar asigurăm toate căile)
        const token = res.accessToken || res.data?.accessToken;

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token salvat cu succes!");
        } else {
          console.warn("Nu s-a găsit accessToken în structura răspunsului.");
        }

        // 2. Extragere User (CORECTAT: Adăugată verificarea pentru res.data?.data?.user)
        const userData = res.user || res.data?.user || res.data?.data?.user;

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          console.log(
            "Datele utilizatorului au fost salvate din DB:",
            userData,
          );
        } else {
          console.warn(
            "Nu s-a putut extrage user-ul din structura DB. Se aplică fallback.",
          );
          // Fallback în caz că structura e plată sau goală
          const fallbackUser = {
            id: res.id || res.data?.id,
            email,
            username: res.username || res.data?.username || email.split("@")[0],
          };
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        }

        setIsAuthModalOpen(false);

        // Refresh automat pentru a propaga token-ul proaspăt în CartContext și Axios
        window.location.reload();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Eroare în AuthContext login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.reload();
      return true;
    } catch (error) {
      console.error("Eroare în AuthContext login:", error);
      return false;
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        login,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
