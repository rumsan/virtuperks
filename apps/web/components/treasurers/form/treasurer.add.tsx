"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
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
import { ArrowLeft, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { Treasurer, treasurerSchema } from "./schema";

const defaultValues: Treasurer = {
  name: "",
  walletAddress: "",
};

type TreasurerAddProps = {
  router: any;
};

export default function TreasurerAdd({ router }: TreasurerAddProps) {
  const form = useForm({
    resolver: zodResolver(treasurerSchema()),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: any) => {
    console.log(data, "data");
  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
          <div
            onClick={() => router.push(PATHS.TREASURER.HOME)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
          >
            <ArrowLeft size={24} strokeWidth={2} />
            <span className="font-base text-gray-700">Back</span>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Add Treasurer</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Fill the form below to create a new treasurer
            </h3>
          </div>

          <div className="my-6">
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <Form {...form}>
                  <form onSubmit={handleSubmit}>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Treasurer Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Write treasurer name"
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
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
