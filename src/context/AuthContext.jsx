import React, { createContext, useState, useContext, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const clerk = useClerk();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [menu, setMenu] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser).menu || [] : [];
    } catch {
      return [];
    }
  });

  // Add storage event listener to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUser);
        setMenu(newUser?.menu || []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setMenu(userData.menu || []);
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setMenu([]);

    try {
      await clerk.signOut(); // ✅ Sign out from Clerk
    } catch (error) {
      console.error("Clerk signOut failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        menu,
        login,
        logout,
        setUser,
        setMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
