"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBalance } from "@/hooks/useBalance";
import { useRouter } from "next/navigation";
import { LogOut, ArrowDown, ArrowUp, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { balance, isLoading } = useBalance("100");
  const router = useRouter();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-blue-100 p-5 rounded-lg text-center shadow-md">
          <p className="text-lg text-gray-700">Saldo disponível</p>
          {isLoading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <p className="text-3xl font-bold text-blue-700 mt-2">
              R$ {balance}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 w-full p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
            <ArrowDown size={20} /> Depósito
          </button>
          <button className="flex items-center justify-center gap-2 w-full p-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
            <ArrowUp size={20} /> Saque
          </button>
          <button className="flex items-center justify-center gap-2 w-full p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            <RefreshCcw size={20} /> Transferência
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full p-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
