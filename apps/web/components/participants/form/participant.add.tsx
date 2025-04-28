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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, Wallet } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";
import { Participant, participantSchema } from "./schema";

const defaultValues: Participant = {
  name: "",
  email: "",
  walletAddress: "",
  gender: "",
  manager: "",
  userRole: "",
};

type ParticipantAddProps = {
  router: AppRouterInstance;
};

export default function ParticipantAdd({ router }: ParticipantAddProps) {
  const form = useForm({
    resolver: zodResolver(participantSchema()),
    defaultValues: defaultValues,
  });

  const { toast } = useToast();

  const handleSubmit = async (data: Participant) => {
    console.log(data, "data");
  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
          <div
            onClick={() => router.push(PATHS.PARTICIPANT.HOME)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
          >
            <ArrowLeft size={24} strokeWidth={2} />
            <span className="font-base text-gray-700">Back</span>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Add Participant</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Fill the form below to create a new participant
            </h3>
          </div>

          <div className="my-6">
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Participant Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Write participant name"
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
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="others">Others</SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter participant email address"
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
                                    placeholder="Enter participant wallet address"
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

                        <FormField
                          control={form.control}
                          name="userRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Type</FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select participant type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="owner">Owner</SelectItem>
                                  <SelectItem value="manager">
                                    Manager
                                  </SelectItem>
                                  <SelectItem value="employee">
                                    Employee
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="manager"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manager</FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select manager" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="managerA">
                                    Manager A
                                  </SelectItem>
                                  <SelectItem value="managerB">
                                    Manager B
                                  </SelectItem>
                                  <SelectItem value="managerC">
                                    Manager C
                                  </SelectItem>
                                </SelectContent>
                              </Select>

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
