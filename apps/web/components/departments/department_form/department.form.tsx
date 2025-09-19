"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { isAddress } from "viem";
import { Department } from "./schema";

interface DepartmentFormProps {
  mode: "add" | "edit";
  saveForm: (departmentData: Department) => void;
  defaultValues: Department;
  isEditing?: boolean;
  form: UseFormReturn<Department>;
  children: React.ReactNode;
}

export default function DepartmentBaseForm({
  saveForm,
  form,
  children,
}: DepartmentFormProps) {
  const [currentWallet, setCurrentWallet] = useState("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const handleAddWallet = () => {
    if (currentWallet && isAddress(currentWallet)) {
      setWalletAddresses((prev) => [...prev, currentWallet]);
      form.setValue("entityOwners", [...walletAddresses, currentWallet]);
      setCurrentWallet("");
    }
  };

  const removeWallet = (addressToRemove: string) => {
    const filtered = walletAddresses.filter((addr) => addr !== addressToRemove);
    setWalletAddresses(filtered);
    form.setValue("entityOwners", filtered);
  };
  const handleSubmit = form.handleSubmit(
    (data) => {
      saveForm(data);
    },
    (errors) => {},
  );
  return (
    <>
      {" "}
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write department name"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Prevent space as the first character
                          if (value.length === 1 && value[0] === " ") return;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entityOwners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Owner Addresses</FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Paste wallet address"
                          value={currentWallet}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Prevent space as the first character
                            if (value.length === 1 && value[0] === " ") return;

                            setCurrentWallet(value);
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleAddWallet}
                          disabled={!isAddress(currentWallet)}
                        >
                          Add
                        </Button>
                      </div>

                      {/* Display added addresses */}
                      <div className="flex flex-wrap gap-2">
                        {walletAddresses.map((address) => (
                          <div
                            key={address}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{address}</span>
                            <button
                              type="button"
                              onClick={() => removeWallet(address)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end mt-5">
              <>{children}</>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
