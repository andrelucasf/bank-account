import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar saldo");
  }

  const data = await res.json();
  return data;
};

export function useBalance(accountId: string) {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof document !== "undefined") {
      const storedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      setToken(storedToken || null);
    }
  }, []);

  const { data, error, isValidating } = useSWR(
    isClient && token
      ? `http://localhost:8080/accounts/balance?account_id=${accountId}`
      : null,
    token ? (url) => fetcher(url, token) : null,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  return {
    balance: data,
    isLoading: isValidating && !data,
    isError: !!error,
  };
}
