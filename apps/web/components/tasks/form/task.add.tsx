"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Task, taskSchema } from "./schema";

const defaultValues: Task = {
  title: "",
  url: "",
  status: "",
  description: "",
  owner: "",
  date: "",
  participants: "",
  tokens: "",
};

type TaskAddProps = {
  router: any;
};

const ownerList = [
  {
    cuid: "cuie8738hfj409f",
    name: "A",
  },
  {
    cuid: "cuie8738hfj409w",
    name: "B",
  },
  {
    cuid: "cuie8738hfj409x",
    name: "C",
  },
];

export default function TaskAdd({ router }: TaskAddProps) {
  const form = useForm({
    resolver: zodResolver(taskSchema()),
    defaultValues: defaultValues,
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSubmit = async (data: Task) => {
    console.log(data, "data");
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
                  <form onSubmit={handleSubmit}>
                    <div className="p-6">
                      <div className="flex flex-col w-full gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="url"
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
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Write title for the task"
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
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <Textarea
                                placeholder="Write task description"
                                {...field}
                                value={field.value ?? ""}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <FormField
                          control={form.control}
                          name="tokens"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
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
                          name="participants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max number of applicants</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="0"
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
                          name="date"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
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

                              <Select
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
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-full mb-5">
                        <FormField
                          control={form.control}
                          name="owner"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Add assignes</FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select assignees for the task" />
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
