"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import { Coins, Layers, LayoutList, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

export default function EntityOwnerNav({ children }: PropsWithChildren) {
  const [activeNavBar, setActiveNavBar] = useState("dashboard");

  const handleNavClick = (nav: string) => {
    setActiveNavBar(nav);
  };

  const getNavItemClasses = (nav: string) => {
    return activeNavBar === nav
      ? "text-[#297AD6] border-b-2 border-[#297AD6]"
      : "text-[#1E293B] hover:text-[#1e293b]";
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-4 gap-8 border-b-2 border-[#E2E8F0]">
        <nav className="flex items-center justify-center w-[50px] h-full">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/bg/rumsan-logo.png"
              width={50}
              height={50}
              alt="Logo"
            />
          </Link>
        </nav>
        <nav className="flex items-center gap-6 h-full">
          {/* <Link
            href="/participants"
            onClick={() => handleNavClick("participants")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("dashboard")}`}
          >
            <LayoutDashboard
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "dashboard" ? "#297AD6" : "#334155"}`}
            />
            Participants
          </Link> */}
          <Link
            href="/departments"
            onClick={() => handleNavClick("departments")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("departments")}`}
          >
            <Coins
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "departments" ? "#297AD6" : "#334155"}`}
            />
            Departments
          </Link>
          <Link
            href="/tasks"
            onClick={() => handleNavClick("tasks")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("tasks")}`}
          >
            <Layers
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "tasks" ? "#297AD6" : "#334155"}`}
            />
            Task Management
          </Link>
          {/* <Link
            href="/history"
            onClick={() => handleNavClick("history")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("departments")}`}
          >
            <Layers
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "departments" ? "#297AD6" : "#334155"}`}
            />
            History
          </Link> */}
        </nav>

        <div className="ml-auto flex items-center gap-4 h-full">
          <Link
            href="/task_portal"
            onClick={() => handleNavClick("task_portal")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("task_portal")}`}
          >
            <LayoutList
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "task_portal" ? "#297AD6" : "#334155"}`}
            />
            Tasks Portal
          </Link>

          <Link
            href="/task_portal/mine"
            onClick={() => handleNavClick("my-tasks")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("my-tasks")}`}
          >
            <LayoutList
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "my-tasks" ? "#297AD6" : "#334155"}`}
            />
            My Tasks
          </Link>
          <Link
            href="/participants"
            onClick={() => handleNavClick("participants")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("participants")}`}
          >
            <LayoutList
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "tasks" ? "#297AD6" : "#334155"}`}
            />
            Participant List
          </Link>
          <div className="flex items-center h-10 p-2 bg-[#F1F5F9] rounded-md p-2">
            <span className="flex items-center gap-2 font-normal text-[#1E293B] text-sm middle-ellipsis">
              <Wallet size={18} strokeWidth={2.65} color="#334155" />
              <ConnectKitButton showAvatar={false} theme="auto" />
            </span>
          </div>
          <Avatar className="bg-red-400 h-7 w-7">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* )} */}
      </div>
      <div className="h-[calc(100dvh-60px)] overflow-auto">{children}</div>
    </header>
  );
}
