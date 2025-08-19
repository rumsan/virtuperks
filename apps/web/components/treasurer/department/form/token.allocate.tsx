"use client";

import { useRewardTokenMint } from "@/hooks/subgraph/entity";
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
import { useForm, useWatch } from "react-hook-form";
import { Token, tokenSchema } from "./schema";

const defaultValues: Token = {
  amount: 0,
};

interface TokenAllocateFormProps {
  id: string;
  availableTokens?: bigint;
  entityData?: any; 
}

const TokenAllocateForm = ({
  id,
  availableTokens,
  entityData,
}: TokenAllocateFormProps) => {
  

  const form = useForm({
    resolver: zodResolver(tokenSchema()),
    defaultValues,
  });

  const { tokenMint, mintPending, mintSuccess, mintError } =
    useRewardTokenMint();

  useEffect(() => {
    if (mintSuccess) {
      history.back();
    } else if (mintError) {
      console.error("Token minting failed:", mintError);
    }
  }, [mintSuccess, mintError]);

  const handleSubmit = async (data: Token) => {
    try {
      const amount = data.amount;

      await tokenMint({
        address: entityData.rewardManagement,
        amount: amount,
      });
    } catch (err) {
      console.error("Minting failed:", err);
    }
  };

  const noTokensAvailable = !availableTokens || availableTokens === BigInt(0);

  const enteredAmount = useWatch({ control: form.control, name: "amount" });

  const exceedsAvailable = Boolean(
    availableTokens && enteredAmount && enteredAmount > Number(availableTokens),
  );

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
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            disabled={noTokensAvailable} // disable input if no tokens
                          />
                        </FormControl>
                        {/* Message below input */}
                        {noTokensAvailable && (
                          <p className="text-sm text-red-500 mt-1">
                            ⚠️ No tokens to allocate
                          </p>
                        )}
                        {exceedsAvailable && (
                          <p className="text-sm text-red-500 mt-1">
                            ⚠️ You have only {availableTokens?.toString()}{" "}
                            tokens available
                          </p>
                        )}
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
                    disabled={
                      mintPending || noTokensAvailable || exceedsAvailable
                    }
                  >
                    {mintPending ? "Minting..." : "Create"}
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
