"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useEntityList } from "@/hooks/subgraph/querycall";
import { useWriteContract } from "wagmi";
import { taskSchema } from "./schema";

import { EntityList, participantList, tokenList } from "@/sampleData";
import { isAddress } from "viem";

const defaultValues:any = {

  detailsUrl: "",
  owner: "",
  rewardToken: "",
  expiryDate: "",
  allowedWallets: "",
  maxParticipants: 0 ,
  rewardAmount:0,
  isActive: false,
  entityAddress: "",
};

type TaskAddProps = {
  router: any;
};

export default function TaskAdd({ router }: TaskAddProps) {
  const form = useForm({
    resolver: zodResolver(taskSchema()),
    defaultValues: defaultValues,
  });
   const getAllEntity = useEntityList()
  const entityList = getAllEntity?.data?.data?.entityTaskManagerCreateds


  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data: hash, writeContract } = useWriteContract()

 

  const handleSubmit = async (data: any) => {
    console.log(data.entityAddress, "data from form");

    if (!isAddress(data.entityAddress)) {
        console.error("Invalid Ethereum address:", data.entityAddress);
        return;
    }

    const { detailsUrl, rewardToken, owner, isActive } = data;
    const expiryDate = Math.floor(new Date(data.expiryDate).getTime() / 1000); // Convert to seconds
    const allowedWallets = Array.isArray(data.allowedWallets) ? data.allowedWallets : [data.allowedWallets]; // Ensure it's an array
    const rewardAmount = BigInt(data.rewardAmount);
    const maxParticipants = BigInt(data.maxParticipants);

    try {
        await writeContract({
            address: data.entityAddress as `0x${string}`,
            abi: EntityTaskManagementABI,
            functionName: "createTask",
            args: [{ detailsUrl, rewardToken, rewardAmount, allowedWallets, maxParticipants, expiryDate, owner, isActive }]
        });
    } catch (error) {
        console.error("Transaction failed:", error);
    }

  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
          <div
            onClick={() => router.push(PATHS.TASKS.HOME)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
          >
            <ArrowLeft size={24} strokeWidth={2} />
            <span className="font-base text-gray-700">Back</span>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Create Task</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Fill the form below to create a new task
            </h3>
          </div>

          <div className="my-6">
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="p-6">
                      <div className="flex flex-col w-full gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="detailsUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Task URL</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center bg-gray-200 rounded-md">
                                  <Input
                                    placeholder="Write title for the task"
                                    {...field}
                                    value={field.value ?? ""}
                                  />

                                  <div className="absolute right-2 flex items-center">
                                    <Copy
                                      size={20}
                                      strokeWidth={2.5}
                                      color="#334155"
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="entityAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Entity</FormLabel>
                              <FormControl>
                                        <Select
                                  onValueChange={(value) => field.onChange(value)}
                                  value={field.value} 
                                
                                >
          <SelectTrigger>
            <SelectValue placeholder="Select Entity" />
          </SelectTrigger>
          <SelectContent>
          {EntityList?.map((entity:any) => (
              <SelectItem key={entity.name} value={entity.address}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="rewardToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Token</FormLabel>
                              <FormControl>
                               <Select
                                  onValueChange={(value) => field.onChange(value)}
                                  value={field.value} 
                                
                                >
          <SelectTrigger>
            <SelectValue placeholder="Select reward" />
          </SelectTrigger>
          <SelectContent>
          {tokenList?.map((token:any) => (
            <SelectItem key={token.name} value={ token.address}>
                {token.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Number of Participants</FormLabel>
                               <Input
                                   type="number"
        placeholder="0"
                                
                                  {...field}
                                 value={field.value !== undefined && field.value !== null ? field.value.toString() : ""}
                                onChange={(e) => {
          const value = e.target.value;
          
          field.onChange(value === "" ? undefined : parseInt(value, 10));
        }}
                                />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="rewardAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reward Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                              value={field.value !== undefined && field.value !== null ? field.value.toString() : ""}
                                                        onChange={(e) => {
          const value = e.target.value;
          
          field.onChange(value === "" ? undefined : parseInt(value, 10));
        }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event status </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange(value === "true")}
                                  value={field.value ? "true" : "false"} 
                                
                                >
          <SelectTrigger>
            <SelectValue placeholder="Select event status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <Popover
                                  open={isPopoverOpen}
                                  onOpenChange={setIsPopoverOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <div className="relative flex items-center">
                                        <div className="w-[35px] h-full absolute flex items-center p-2">
                                          <CalendarIcon
                                            color="#64748B"
                                            strokeWidth={2.5}
                                            // size={24}
                                            className="w-8 h-8 ml-auto"
                                          />
                                        </div>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className={`w-full font-normal ${
                                            !field.value &&
                                            "text-muted-foreground"
                                          }`}
                                        >
                                          {field.value ? (
                                            format(
                                              new Date(field.value),
                                              "MM/dd/yyyy",
                                            )
                                          ) : (
                                            <span className="flex justify-start mr-auto ml-5">
                                              Select deadline date
                                            </span>
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={(date) => {
                                        field.onChange(date);
                                        setIsPopoverOpen(false);
                                      }}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("2022-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={form.control}
                          name="owner"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Set Task Owner</FormLabel>

                              {/* <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select task owner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ownerList.map((owner) => (
                                    <SelectItem
                                      key={owner.cuid}
                                      value={owner.name}
                                    >
                                      {owner.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select> */}
                               <Input
                                  type="string"
                                  placeholder="Add owner Address"
                                  {...field}
                                  value={field.value ?? ""}
                                />

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                     <FormField
                          control={form.control}
                          name="allowedWallets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Token</FormLabel>
                              <FormControl>
                               <Select
                                  onValueChange={(value) => field.onChange(value)}
                                  value={field.value} 
                                
                                >
          <SelectTrigger>
            <SelectValue placeholder="Select Participant" />
          </SelectTrigger>
          <SelectContent>
          {participantList?.map((token:any) => (
            <SelectItem key={token.walletAddress} value={ token.walletAddress}>
                {token.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
               
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
