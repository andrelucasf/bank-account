"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold">Banking Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your finances</p>
        </div>
        <div className="space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Login to Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
