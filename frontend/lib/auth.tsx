"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const storedUser = Cookies.get("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        Cookies.remove("auth_token");
        Cookies.remove("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    Cookies.set("auth_token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    setUser(user);

    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
