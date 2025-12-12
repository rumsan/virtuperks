"use client";

import { useSelectParticipantLookUp } from "@/hooks/client/participant.lookup";
import { useGetEntityById } from "@/hooks/subgraph/entity";
import { useGetApprovedTokens } from "@/hooks/subgraph/token";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import { CalendarIcon, Info } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { isAddress } from "viem";

interface TaskFormProps {
  mode: "add" | "edit";
  saveForm: (taskData: any) => void;
  defaultValues: any;
  form: UseFormReturn<any>;
  isPending: boolean;
}

export default function TaskBaseForm({
  mode,
  saveForm,
  form,
  defaultValues,
  isPending,
}: TaskFormProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const params = useParams();
  const cuid = params?.id as string;
  const { data: entity, isLoading: entityLoading } = useGetEntityById(cuid);
  const {
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = form;
  const { name, mappedTreasurers, isLoading } = useSelectParticipantLookUp();

  const entityAddress = watch("entityAddress");
  const totalRewardAmount = watch("totalRewardAmount");

  const { totalApproved: unallocatedTokens } = useGetApprovedTokens(
    entityAddress ?? "",
  );

  useEffect(() => {
    if (entity?.rewardManagement) {
      form.setValue("entityAddress", entity.rewardManagement);
    }
  }, [entity, form]);

  useEffect(() => {
    if (!entityAddress) return;
    if (unallocatedTokens === undefined) return;

    if (unallocatedTokens === "0") {
      setError("entityAddress", {
        type: "manual",
        message:
          "This entity has no tokens available. Please mint tokens first.",
      });
    } else {
      clearErrors("entityAddress");
    }
  }, [entityAddress, unallocatedTokens, setError, clearErrors]);

  const handleAddWallet = async () => {
    if (currentWallet && isAddress(currentWallet)) {
      const updated = [...walletAddresses, currentWallet];

      setWalletAddresses(updated);

      form.setValue("whitelistedParticipants", updated, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      await form.trigger("whitelistedParticipants");

      setCurrentWallet("");
    }
  };

  const removeWallet = async (addressToRemove: string) => {
    const updated = walletAddresses.filter((addr) => addr !== addressToRemove);
    setWalletAddresses(updated);
    form.setValue("whitelistedParticipants", updated, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    await form.trigger("whitelistedParticipants");
  };

  useEffect(() => {
    if (!entityAddress || unallocatedTokens === undefined) return;
    if (!totalRewardAmount) return;

    try {
      const totalAmount = BigInt(totalRewardAmount.toString());
      const availableAmount = BigInt(unallocatedTokens);

      if (totalAmount > availableAmount) {
        setError("totalRewardAmount", {
          type: "manual",
          message: `Insufficient tokens. Available: ${availableAmount.toString()}`,
        });
      } else {
        clearErrors("totalRewardAmount");
      }
    } catch (err) {
      console.error("Error parsing totalRewardAmount:", err);
    }
  }, [
    entityAddress,
    totalRewardAmount,
    unallocatedTokens,
    setError,
    clearErrors,
  ]);

  const handleSubmitForm = form.handleSubmit(saveForm);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)}>
        <div className="p-6">
          <div className="flex flex-col w-full gap-4 mb-5">
            {/* Task Title */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write name for the task"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length === 1 && value[0] === " ") return;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task URL */}
            <FormField
              control={form.control}
              name="detailsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write title Url"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length === 1 && value[0] === " ") return;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max participants + Treasurer */}
            <div className="grid grid-cols-2 gap-4 mb-5">
           
              <FormField
  control={form.control}
  name="totalRewardAmount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Reward Amount</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="0"
          {...field}
          value={field.value === 0 ? "" : (field.value ?? "")}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(val === "" ? undefined : Number(val));
          }}
        />
      </FormControl>

      {/* Professional disclaimer */}
      <div className="flex items-start gap-2 mt-2 bg-blue-50 border border-blue-200 rounded-md p-2">
        <Info className="text-blue-500 mt-0.5" size={18} />
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Note:</span> This amount will be 
          <span className="font-semibold"> equally distributed </span> among the verified participants.
        </p>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
            </div>
          </div>

          {/* Reward + Token + Entity */}
          <div className="grid grid-cols-2 gap-4 mb-5">
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
                        field.value !== undefined && field.value !== null
                          ? field.value.toString()
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10),
                        );
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Token */}
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
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue>Rahat Token</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={process.env.NEXT_PUBLIC_RAHAT_TOKEN || ""}
                        >
                          Rahat Token
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Entity */}
            <FormField
              control={form.control}
              name="entityAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="text"
                        value={entity?.name || "Loading..."}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <input
                        type="hidden"
                        {...field}
                        value={entity?.rewardManagement || ""}
                      />
                      {unallocatedTokens !== undefined && (
                        <span className="text-sm text-gray-500">
                          Available Tokens: {unallocatedTokens.toString()}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
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
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(new Date(field.value), "MM/dd/yyyy")
                              ) : (
                                <span className="flex justify-start mr-auto ml-5">
                                  Select deadline date
                                </span>
                              )}
                            </Button>
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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

            {/* Owner */}
            <FormField
              control={form.control}
              name="owner"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Set Task Owner</FormLabel>

                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Owner" />
                      </SelectTrigger>

                      <SelectContent>
                        {name.map((p: any) => (
                          <SelectItem key={p.address} value={p.address}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  {fieldState.error && <FormMessage />}
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="requireApproval"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <FormLabel>Approval Required</FormLabel>
                    <FormDescription>
                      Enable if tasks require owner approval.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-5 w-5 accent-blue-600 cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Whitelist Toggle */}
          <div className="mb-5">
            <FormField
              control={form.control}
              name="isWhitelisted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Whitelist Participants
                    </FormLabel>
                    <p className="text-sm text-gray-500">
                      Restrict task to specific wallet addresses
                    </p>
                  </div>
                  <FormControl>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          if (!e.target.checked) {
                            setWalletAddresses([]);
                            form.setValue("whitelistedParticipants", []);
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Add Participants */}
          {watch("isWhitelisted") && !showAddParticipants && (
            <div className="mt-2 p-2 border border-blue-300 bg-blue-50 rounded-lg mb-5">
              <p className="text-sm text-gray-700 mb-2">
                Whitelisting is enabled for this task. You can add participants
                or continue without adding any.
              </p>

              <Button
                type="button"
                className="mt-1"
                onClick={() => setShowAddParticipants(true)}
              >
                Add Participants
              </Button>
            </div>
          )}

          {/* Participant Selector */}
          {watch("isWhitelisted") && showAddParticipants && (
            <FormField
              control={form.control}
              name="whitelistedParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Participant Addresses</FormLabel>
                  <div className="space-y-4">
                    {/* Dropdown */}
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(val) => setCurrentWallet(val)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select participant" />
                        </SelectTrigger>

                        <SelectContent>
                          {name.map((p: any) => (
                            <SelectItem key={p.address} value={p.address}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        onClick={handleAddWallet}
                        disabled={!currentWallet}
                      >
                        Add
                      </Button>
                    </div>

                    {/* Display Added Wallets */}
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
          )}

          {/* Submit + Cancel */}
          <div className="w-full flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              className={`w-[170px] ${isPending ? "opacity-70" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (!isPending) history.back();
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
              {isPending ? "Processing..." : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
