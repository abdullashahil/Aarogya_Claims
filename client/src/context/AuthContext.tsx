import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type AuthContextType = {
  accessToken: string | null;
  role: string | null;
  email: string | null;
  login: (accessToken: string, role: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  // Prevent double execution in Strict Mode
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const storedAccessToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    if (storedAccessToken && storedRole && storedEmail) {
      setAccessToken(storedAccessToken);
      setRole(storedRole);
      setEmail(storedEmail);
    }
  }, []);

  const login = (accessToken: string, role: string, email: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);

    setAccessToken(accessToken);
    setRole(role);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setAccessToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
