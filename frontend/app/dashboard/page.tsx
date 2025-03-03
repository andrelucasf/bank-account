"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { BalanceCard } from "@/components/dashboard/balance-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [accountId, setAccountId] = useState(process.env.clientId!);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <BalanceCard accountId={accountId} />

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Link
                    href="/dashboard/deposit"
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent"
                  >
                    <ArrowDownToLine className="h-4 w-4 text-green-500" />
                    <div>Deposit Funds</div>
                  </Link>
                  <Link
                    href="/dashboard/withdraw"
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent"
                  >
                    <ArrowUpFromLine className="h-4 w-4 text-red-500" />
                    <div>Withdraw Funds</div>
                  </Link>
                  <Link
                    href="/dashboard/transfer"
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                    <div>Transfer Funds</div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
