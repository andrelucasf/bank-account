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
import {
  ArrowLeftRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  sourceAccountId: z
    .string()
    .min(1, { message: "Source account ID is required" }),
  destinationAccountId: z
    .string()
    .min(1, { message: "Destination account ID is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .min(1, { message: "Minimum transfer amount is $1" }),
});

export default function TransferPage() {
  const [accountId, setAccountId] = useState(process.env.clientId!);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: balanceData } = useQuery({
    queryKey: ["balance", accountId],
    queryFn: () => getBalance(accountId),
  });

  const currentBalance = balanceData?.data || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceAccountId: accountId,
      destinationAccountId: "",
      amount: undefined,
    },
  });

  const transferMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return createEvent({
        type: "transfer",
        amount: data.amount,
        origin: data.sourceAccountId,
        destination: data.destinationAccountId,
      });
    },
    onSuccess: (data) => {
      setShowConfirmation(false);

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Transfer failed",
          description: data.error,
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["balance", accountId] });

      toast({
        title: "Transfer successful",
        description: `$R${formValues?.amount} has been transferred successfully.`,
      });

      form.reset({
        sourceAccountId: accountId,
        destinationAccountId: "",
        amount: undefined,
      });
      setFormValues(null);
    },
    onError: () => {
      setShowConfirmation(false);
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
        description: "You do not have enough funds to complete this transfer.",
      });
      return;
    }

    if (values.sourceAccountId === values.destinationAccountId) {
      toast({
        variant: "destructive",
        title: "Invalid transfer",
        description: "Source and destination accounts cannot be the same.",
      });
      return;
    }

    setFormValues(values);
    setShowConfirmation(true);
  }

  function confirmTransfer() {
    if (formValues) {
      transferMutation.mutate(formValues);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Transfer Funds</h1>

            <Card>
              <CardHeader>
                <CardTitle>Make a Transfer</CardTitle>
                <CardDescription>
                  Transfer funds to another account
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
                      name="sourceAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
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
                      name="destinationAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Account</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter destination account ID"
                              {...field}
                              disabled={transferMutation.isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            The account you want to transfer to
                          </FormDescription>
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
                                disabled={transferMutation.isPending}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the amount you want to transfer
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
                          The transfer amount exceeds your available balance.
                        </AlertDescription>
                      </Alert>
                    )}

                    {form.watch("sourceAccountId") ===
                      form.watch("destinationAccountId") &&
                      form.watch("destinationAccountId") !== "" && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Invalid transfer</AlertTitle>
                          <AlertDescription>
                            Source and destination accounts cannot be the same.
                          </AlertDescription>
                        </Alert>
                      )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        transferMutation.isPending ||
                        form.watch("amount") > currentBalance ||
                        (form.watch("sourceAccountId") ===
                          form.watch("destinationAccountId") &&
                          form.watch("destinationAccountId") !== "")
                      }
                    >
                      {transferMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowLeftRight className="mr-2 h-4 w-4" />
                          Continue
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Transfer</DialogTitle>
                  <DialogDescription>
                    Please review the transfer details before confirming.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      From Account:
                    </span>
                    <span className="font-medium">
                      {formValues?.sourceAccountId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      To Account:
                    </span>
                    <span className="font-medium">
                      {formValues?.destinationAccountId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Amount:
                    </span>
                    <span className="font-medium">{formValues?.amount}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">R$ {formValues?.amount}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    disabled={transferMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmTransfer}
                    disabled={transferMutation.isPending}
                  >
                    {transferMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm Transfer
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
