"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { BanIcon as BankIcon, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b flex justify-center">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Banking Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
