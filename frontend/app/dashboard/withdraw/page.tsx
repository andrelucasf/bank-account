"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createEvent, getBalance } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUpFromLine, AlertCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  accountId: z.string().min(1, { message: "Account ID is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .min(1, { message: "Minimum withdrawal amount is $1" }),
});

export default function WithdrawPage() {
  const [accountId, setAccountId] = useState(process.env.clientId!);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: balanceData } = useQuery({
    queryKey: ["balance", accountId],
    queryFn: () => getBalance(accountId),
  });

  console.log("balanceData", balanceData);
  const currentBalance = balanceData?.data || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: accountId,
      amount: undefined,
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return createEvent({
        type: "withdraw",
        amount: data.amount,
        origin: data.accountId,
      });
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Withdrawal failed",
          description: data.error,
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["balance", accountId] });

      toast({
        title: "Withdrawal successful",
        description: `R$${form.getValues(
          "amount"
        )} has been withdrawn from your account.`,
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
    if (values.amount > currentBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description:
          "You do not have enough funds to complete this withdrawal.",
      });
      return;
    }

    withdrawMutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>

            <Card>
              <CardHeader>
                <CardTitle>Make a Withdrawal</CardTitle>
                <CardDescription>
                  Withdraw funds from your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">
                    Available Balance:
                  </span>
                  <span className="font-bold">
                    R${currentBalance.toFixed(2)}
                  </span>
                </div>

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
                                disabled={withdrawMutation.isPending}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the amount you want to withdraw
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("amount") > currentBalance && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Insufficient funds</AlertTitle>
                        <AlertDescription>
                          The withdrawal amount exceeds your available balance.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        withdrawMutation.isPending ||
                        form.watch("amount") > currentBalance
                      }
                    >
                      {withdrawMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowUpFromLine className="mr-2 h-4 w-4" />
                          Withdraw Funds
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
