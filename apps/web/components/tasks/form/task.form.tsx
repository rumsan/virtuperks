"use client";

import { useEntityList } from "@/hooks/subgraph/querycall";
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
import { CalendarIcon, Copy } from "lucide-react";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { isAddress } from "viem";

interface TaskFormProps {
  mode: "add" | "edit";
  saveForm: (taskData: any) => void;
  defaultValues: any;
  form: UseFormReturn<any>;
  isPending: boolean;
}
type EntityType = {
  aclAddress: string;
  blockNumber: string;
  blockTimeStamp: string;
  entityTaskManager: string;
  id: string;
  transactionHash: string;
  __typename: string;
  _appId: string;
  _name: string;
};

export default function TaskBaseForm({
  saveForm,
  form,
  isPending
}: TaskFormProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const getAllEntity = useEntityList();
    const entityList = getAllEntity?.data?.data?.entityTaskManagerCreateds;
    

  const handleAddWallet = () => {
    if (currentWallet && isAddress(currentWallet)) {
      setWalletAddresses(prev => [...prev, currentWallet]);
      form.setValue("allowedWallets", [...walletAddresses, currentWallet]);
      setCurrentWallet('');
    }
  };

  const removeWallet = (addressToRemove: string) => {
    const filtered = walletAddresses.filter(addr => addr !== addressToRemove);
    setWalletAddresses(filtered);
    form.setValue("allowedWallets", filtered);
  };

  const handleSubmit = form.handleSubmit(saveForm);

    return (
        
           
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
                                          onValueChange={(value) =>
                                            field.onChange(value)
                                          }
                                          value={field.value}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select Entity" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {entityList?.map((entity: EntityType) => (
                                              <SelectItem
                                                key={entity.id}
                                                value={entity.entityTaskManager}
                                              >
                                                {entity._name}
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
                                        value={
                                          field.value !== undefined &&
                                          field.value !== null
                                            ? field.value.toString()
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value;
        
                                          field.onChange(
                                            value === ""
                                              ? undefined
                                              : parseInt(value, 10),
                                          );
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
                                          value={
                                            field.value !== undefined &&
                                            field.value !== null
                                              ? field.value.toString()
                                              : ""
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
        
                                            field.onChange(
                                              value === ""
                                                ? undefined
                                                : parseInt(value, 10),
                                            );
                                          }}
                                        />
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
                                    <FormLabel>Token</FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={process.env.NEXT_PUBLIC_RAHAT_TOKEN || ""}
                                        disabled // Make it read-only
                                      >
                                        <SelectTrigger>
                                          <SelectValue>Rahat Token</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value={process.env.NEXT_PUBLIC_RAHAT_TOKEN || ""}>
                                            Rahat Token
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
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
                                          onValueChange={(value) =>
                                            field.onChange(value === "true")
                                          }
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
                                              disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return date < today;
                                              }}
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
                                    <FormLabel>Add Participant Addresses</FormLabel>
                                    <div className="space-y-4">
                                      <div className="flex gap-2">
                                        <Input
                                          type="text"
                                          placeholder="Paste wallet address"
                                          value={currentWallet}
                                          onChange={(e) => setCurrentWallet(e.target.value)}
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
              className="w-[170px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Create"
              )}
            </Button>
                              </div>
                            </div>
                          </form>
                        </Form>
                    
        
            
              
  );
}
