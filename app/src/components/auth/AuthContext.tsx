import type { Users } from "@/types/User";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: Users | null;
  setUser: React.Dispatch<React.SetStateAction<Users | null>>; // 🔹 supaya bisa diubah dari luar
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Load user dari localStorage saat pertama kali
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      console.log("User yang dimuat dari localStorage:", parsed);
      setUser(parsed);
    }
    setIsLoading(false);
  }, []);

  // 🔹 Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const value = {
    user,
    setUser, // 🔹 supaya bisa diakses dari luar (misalnya setelah login API)
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
