"use client";

import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import { useState } from "react";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";
import TaskListStatus from "./list.status";

interface TaskListMainProps {
  router: any;
}

export const TaskList = [
  {
    cuid: "cu38nd93j930j0jf48j3",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Open",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "100",
  },
  {
    cuid: "cu38nd93j930j0jf48j2",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Closed",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "120",
  },
  {
    cuid: "cu38nd93j930j0jf48j0",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Open",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "100",
  },
  {
    cuid: "cu38nd93j930j0jf48j1",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Approved",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "100",
  },
  {
    cuid: "cu38nd93j930j0jf48j4",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Completed",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "150",
  },
  {
    cuid: "cu38nd93j930j0jf48j5",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Open",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "130",
  },
  {
    cuid: "cu38nd93j930j0jf48j6",
    title: "Organize a blood donation campaign",
    url: "https://github.com/user/random-repo",
    description: "Description",
    status: "Approved",
    owner: "Ram Thapa Magar",
    date: "26th July, 2025",
    participants: "20",
    tokens: "120",
  },
];

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState("active");

  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Hamro Life Bank</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the tasks
          </h3>
        </div>
        <TaskListStatus router={router} />

        <div className="flex items-center">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-xl">Task List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks
            </h3>
          </div>

          <div className="flex flex-col ml-auto justify-end h-full">
            <Button
              className="min-w-[10rem] fw-[600] h-10"
              variant="default"
              type="submit"
              onClick={() => router.push(PATHS.TASKS.ADD)}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Create Task</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="">
          <div className="flex items-center">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10 ">
                <TabsTrigger
                  value="active"
                  className="w-full h-8"
                  onClick={() => setTabStatus("active")}
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="w-full h-8"
                  onClick={() => setTabStatus("completed")}
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="active">
              <ListCardDetails
                taskList={TaskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
            <TabsContent className="w-full" value="completed">
              <ListCardDetails
                taskList={TaskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
