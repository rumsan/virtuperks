"use client";

import { useParticipantLookup } from "@/hooks/client/participant.lookup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import React, { useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Department } from "./schema";

interface DepartmentFormProps {
  mode: "add" | "edit";
  saveForm: (departmentData: Department) => void;
  defaultValues: Department;
  isEditing?: boolean;
  form: UseFormReturn<Department>;
  children: React.ReactNode;
}

interface Participant {
  address: string;
  name: string;
}

export default function DepartmentBaseForm({
  saveForm,
  form,
  children,
}: DepartmentFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: participantsData = [], isLoading } = useParticipantLookup();
  const participants: Participant[] = participantsData?.data || [];

  const owners = form.getValues("entityOwners") || [];

  // Filter participants based on input
  const filteredParticipants = useMemo(() => {
    const lower = inputValue.toLowerCase();
    return participants.filter(
      (p) => p.name.toLowerCase().includes(lower) && !owners.includes(p.address)
    );
  }, [inputValue, participants, owners]);

  const handleSelectParticipant = (participant: Participant) => {
    if (owners.length >= 5) return;

    const updated = [...owners, participant.address];

    form.setValue("entityOwners", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setInputValue("");
    setShowSuggestions(false);
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeWallet = (addressToRemove: string) => {
    const updated = owners.filter((addr: string) => addr !== addressToRemove);
    form.setValue("entityOwners", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredParticipants.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 0, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredParticipants[highlightedIndex]) {
        handleSelectParticipant(filteredParticipants[highlightedIndex]);
      }
    }
  };

  const handleSubmit = form.handleSubmit(
    (data) => saveForm(data),
    (errors) => {}
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Department Name */}
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
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Entity Owners */}
            <FormField
              control={form.control}
              name="entityOwners"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Owner</FormLabel>
                  <p className="text-sm text-gray-500 mb-2">
                    You can assign up to{" "}
                    <span className="font-semibold text-blue-600">5 owners</span>.
                  </p>

                  <div className="relative">
                    <Input
                      ref={inputRef}
                      placeholder={owners.length >= 5 ? "Max 5 owners added" : "Search participant by name"}
                      value={inputValue}
                      disabled={owners.length >= 5}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />

                    {showSuggestions && filteredParticipants.length > 0 && (
                      <ul className="absolute z-10 bg-white border mt-1 w-full max-h-48 overflow-y-auto shadow rounded">
                        {filteredParticipants.map((p, index) => (
                          <li
                            key={p.address}
                            className={`p-2 cursor-pointer ${
                              highlightedIndex === index ? "bg-blue-100" : "hover:bg-gray-100"
                            }`}
                            onMouseDown={() => handleSelectParticipant(p)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                          >
                            {p.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Display added owners */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {owners.map((addr: string) => {
                      const participant = participants.find((p) => p.address === addr);
                      return (
                        <div
                          key={addr}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{participant?.name || addr}</span>
                          <button
                            type="button"
                            onClick={() => removeWallet(addr)}
                            className="font-bold text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>

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
