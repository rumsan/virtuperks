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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { UseFormReturn } from "react-hook-form";
import { Department } from "./schema";
import React from "react";
import { Wallet } from "lucide-react";

interface DepartmentFormProps {
  mode: "add" | "edit";
  saveForm: (departmentData: any) => void;
  defaultValues: any;
  isEditing?: boolean;
  form: UseFormReturn<Department>;
  children: React.ReactNode;
}

export const departmentOwnerList = [
  {
    id: 1,
    name: "A",
  },
  {
    id: 2,
    name: "B",
  },
  {
    id: 3,
    name: "C",
  },
];

export default function DepartmentBaseForm({
  mode,
  saveForm,
  defaultValues,
  form,
  children,
}: DepartmentFormProps) {
  const handleSubmit = form.handleSubmit(
    (data) => {
      saveForm(data);
    },
    (errors) => {
      console.log("Validation errors:", errors);
    }
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Owner</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOwnerList.map((owner) => (
                          <SelectItem key={owner.id} value={owner.name}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="Enter wallet address of department manager"
                          {...field}
                          value={field.value ?? ""}
                          className="pr-8"
                        />
                        <div className="absolute right-2 flex items-center">
                          <Wallet size={20} color="#424242" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end">
              <>{children}</>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
