"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, Loader2 } from "lucide-react";

const formSchema = z.object({
  accountId: z.string().min(1, { message: "Account ID is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .min(1, { message: "Minimum deposit amount is $1" }),
});

export default function DepositPage() {
  const [accountId, setAccountId] = useState(process.env.clientId!);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: accountId,
      amount: undefined,
    },
  });

  const depositMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return createEvent({
        type: "deposit",
        amount: data.amount,
        destination: data.accountId,
      });
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Deposit failed",
          description: data.error,
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["balance", accountId] });

      toast({
        title: "Deposit successful",
        description: `$R${form.getValues(
          "amount"
        )} has been deposited to your account.`,
      });

      form.reset({
        accountId: accountId,
        amount: undefined,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    depositMutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>

            <Card>
              <CardHeader>
                <CardTitle>Make a Deposit</CardTitle>
                <CardDescription>Add funds to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="accountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account ID</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>Your account ID</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none" />
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="pl-7"
                                {...field}
                                disabled={depositMutation.isPending}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the amount you want to deposit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={depositMutation.isPending}
                    >
                      {depositMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="mr-2 h-4 w-4" />
                          Deposit Funds
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
