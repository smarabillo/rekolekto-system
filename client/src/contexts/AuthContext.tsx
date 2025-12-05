import { createContext, useContext, useState, type ReactNode } from "react";
import type { Admin } from "@/hooks/use-admin";

interface AuthContextType {
  admin: Admin | null;
  login: (admin: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  const login = (admin: Admin) => setAdmin(admin);
  const logout = () => setAdmin(null);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
