import type { User } from "@/types";
import { mockUser, mockUserApproved } from "@/utils/mockData";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: "mahasiswa" | "dosen"
  ) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("lms_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // 1️⃣ Cari user berdasarkan email dan password
    const foundUser = mockUser.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      setIsLoading(false);
      return false; // email atau password salah
    }

    // 2️⃣ Cek apakah user sudah disetujui oleh admin
    const isApproved = mockUserApproved.some(
      (approved) => approved.userId === foundUser.id
    );

    if (!isApproved) {
      alert("Akun Anda belum disetujui oleh admin.");
      setIsLoading(false);
      return false;
    }

    // ✅ Simulasi login sukses
    setUser(foundUser);
    localStorage.setItem("lms_user", JSON.stringify(foundUser));
    setIsLoading(false);
    return true;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "mahasiswa" | "dosen"
  ): Promise<boolean> => {
    setIsLoading(true);

    const pendingUser = {
      id: Date.now(),
      email,
      name,
      role,
      status: "pending",
      createdAt: new Date(),
    };

    console.log("Pendaftaran baru (menunggu persetujuan):", pendingUser);
    alert("Pendaftaran berhasil! Menunggu persetujuan admin.");
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms_user");
    navigate("/");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
