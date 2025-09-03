"use client";

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
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Token } from "./schema";

interface TokenBaseFormProps {
  form: UseFormReturn<Token>;
  saveForm: (data: Token) => void;
  children: React.ReactNode;
  router: AppRouterInstance;
  id: { id: string };
}

export default function TokenBaseForm({
  form,
  saveForm,
  children,
}: TokenBaseFormProps) {
  const handleSubmit = form.handleSubmit(
    (data) => {
      saveForm(data);
    },
    (errors) => {
      console.error("Validation errors:", errors);
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-end mt-5">{children}</div>
        </div>
      </form>
    </Form>
  );
}
