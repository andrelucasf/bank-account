"use client";

import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  accountId: string;
}

export function BalanceCard({ accountId }: BalanceCardProps) {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["balance", accountId],
    queryFn: () => getBalance(accountId),
    refetchInterval: 30000,
  });

  console.log("accountId", accountId);
  console.log("balanceData", data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Account Balance</CardTitle>
          <CardDescription>Current available balance</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefetching && "animate-spin")}
          />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-14 w-full" />
        ) : error || data?.error ? (
          <div className="text-destructive">
            {data?.error || "Failed to load balance"}
          </div>
        ) : (
          <div className="text-3xl font-bold">
            {formatCurrency(data?.data || 0)}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Account ID: {accountId}
        </p>
      </CardContent>
    </Card>
  );
}
