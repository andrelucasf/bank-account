"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
} from "lucide-react";

const items = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Deposit",
    href: "/dashboard/deposit",
    icon: ArrowDownToLine,
  },
  {
    name: "Withdraw",
    href: "/dashboard/withdraw",
    icon: ArrowUpFromLine,
  },
  {
    name: "Transfer",
    href: "/dashboard/transfer",
    icon: ArrowLeftRight,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-card md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-accent text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
