import { createContext, useCallback, useContext, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("auth_token")),
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
