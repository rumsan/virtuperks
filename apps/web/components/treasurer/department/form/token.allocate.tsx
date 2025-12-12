"use client";

import { useRewardTokenApprove } from "@/hooks/subgraph/token";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Token, tokenSchema } from "./schema";

const defaultValues: Token = {
  amount: 0,
};

interface TokenAllocateFormProps {
  id: string;
  availableTokens?: bigint;
  entityData?: any;
}

const TokenAllocateForm = ({ id, entityData }: TokenAllocateFormProps) => {
  const form = useForm({
    resolver: zodResolver(tokenSchema()),
  });

  const { tokenApprove,
    approvePending,
    approveSuccess,
    approveError, } =
  useRewardTokenApprove();

  useEffect(() => {
    if (approveSuccess) {
      history.back();
    } else if (approveError) {
      console.error("Token minting failed:", approveError);
    }
  }, [approveSuccess, approveError]);

  const handleSubmit = async (data: Token) => {
    try {
      await tokenApprove({
        address: entityData.rewardManagement,
        amount: data.amount!,
      });
    } catch (err) {
      console.error("Minting failed:", err);
    }
  };

  return (
    <div className="my-6">
      <Card className="rounded-lg w-full">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-5">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter token amount"
                            value={field.value ?? ""} // show empty string if undefined
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : e.target.valueAsNumber,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-[170px] flex justify-center items-center gap-2"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      history.back();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-[170px] flex justify-center items-center gap-2"
                    disabled={approvePending}
                  >
                    {approvePending ? "Approving..." : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenAllocateForm;
