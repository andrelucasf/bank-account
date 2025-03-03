"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Simulando um usuário fixo com ID 100
    setUser({ id: "100" });
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pass: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      document.cookie = `token=${data.token}; path=/; secure`;

      setUser({ id: "100" }); // Simula o usuário logado
      setIsAuthenticated(true);

      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  };

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { user, isAuthenticated, isLoading, login, logout };
}
