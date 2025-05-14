"use client";

import { useTokenMint } from "@/hooks/subgraph/querycall";
import { PATHS } from "@/routes/paths";
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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { Token, tokenSchema } from "./schema";

const defaultValues: Token = {
  amount: 0,
};

interface TokenAllocateMainProps {
  router: AppRouterInstance;
  id: { id: string };
}

const TokenCreateForm = ({ router, id }: TokenAllocateMainProps) => {
  const form = useForm({
    resolver: zodResolver(tokenSchema()),
    defaultValues,
  });

  const { address } = useAccount(); // Getting the connected wallet address from wagmi

  const { tokenMint, mintPending, mintSuccess, mintError } = useTokenMint();

  useEffect(() => {
    if (mintSuccess) {
      router.push(PATHS.TREASURER.HOME);
    }
  }, [mintSuccess, router]);

  // useEffect(() => {
  //   if (mint && error) {
  //     console.error("Token allocation failed:", error);
  //   }
  // }, [isError, error]);

  const handleSubmit = async (data: Token) => {
    try {
      console.log("Data: ", data);
      const amount = parseUnits(data.amount.toString(), 0);

      if (!address) {
        throw new Error("No connected wallet address");
      }

      await tokenMint({
        address: id.id,
        amount: amount.toString(),
      });
      console.log("Token minted successfully.");
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
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
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
                    disabled={mintPending}
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

export default TokenCreateForm;
