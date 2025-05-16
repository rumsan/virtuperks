"use client";

import { useTokenMint } from "@/hooks/subgraph/querycall";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Token, tokenSchema } from "./schema";
import TokenBaseForm from "./token.form";

const defaultValues: Token = {
  amount: 0,
};

interface TokenCreateProps {
  router: AppRouterInstance;
  id: { id: string };
}

export default function TokenCreate({ router, id }: TokenCreateProps) {
  const form = useForm({
    resolver: zodResolver(tokenSchema()),
    defaultValues,
  });

  const { tokenMint, mintPending, mintSuccess, mintError } = useTokenMint();

  useEffect(() => {
    if (mintSuccess) {
      history.back();
    }
  }, [mintSuccess]);

  useEffect(() => {
    if (mintError) {
      console.error("Token minting failed:", mintError);
    }
  }, [mintError]);

  const handleMintToken = async (data: Token) => {
    try {
      await tokenMint({
        address: id.id,
        amount: data.amount,
      });
    } catch (err) {
      console.error("Minting failed:", err);
    }
  };

  return (
    <div className="my-6">
      <Card className="rounded-lg w-full">
        <CardContent className="p-0">
          <TokenBaseForm
            form={form}
            saveForm={handleMintToken}
            router={router}
            id={id}
          >
            <Button
              variant="outline"
              type="button"
              className="w-[170px] flex justify-center items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                history.back();
              }}
              disabled={mintPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-[170px] flex justify-center items-center gap-2"
              disabled={mintPending}
            >
              {mintPending ? "Minting..." : "Allocate"}
            </Button>
          </TokenBaseForm>
        </CardContent>
      </Card>
    </div>
  );
}
