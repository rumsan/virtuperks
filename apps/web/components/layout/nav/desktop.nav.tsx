"use client";

import { userList } from "@/sampleData";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import {
  Briefcase,
  Coins,
  Layers,
  LayoutDashboard,
  LayoutList,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function DesktopNav() {
  const [activeNavBar, setActiveNavBar] = useState("dashboard");

  const { address } = useAccount();
  console.log(address, "address");

  const findRole = userList.find((user) => {
    return user.address === address;
  });
  console.log(findRole, "findRole");

  // const hello = new SubgraphService("");

  // const a = hello.getRoleGrantedList();
  // console.log(a, "a");

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
      <div className="flex h-14 items-center px-4 gap-8">
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
          <Link
            href="/"
            onClick={() => handleNavClick("dashboard")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("dashboard")}`}
          >
            <LayoutDashboard
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "dashboard" ? "#297AD6" : "#334155"}`}
            />
            Dashboard
          </Link>
          <Link
            href="/departments"
            onClick={() => handleNavClick("departments")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("departments")}`}
          >
            <Layers
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "departments" ? "#297AD6" : "#334155"}`}
            />
            Department
          </Link>
          <Link
            href="/tasks"
            onClick={() => handleNavClick("tasks")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("tasks")}`}
          >
            <Briefcase
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "tasks" ? "#297AD6" : "#334155"}`}
            />
            Task Management
          </Link>
          <Link
            href="/treasurer"
            onClick={() => handleNavClick("treasurer")}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("treasurer")}`}
          >
            <Coins
              size={18}
              strokeWidth={2.65}
              color={`${activeNavBar === "treasurer" ? "#297AD6" : "#334155"}`}
            />
            History
          </Link>
        </nav>
        {findRole?.role === "participant" && (
          <div className="ml-auto flex items-center gap-4 h-full">
            <Link
              href="/tasks"
              onClick={() => handleNavClick("tasks")}
              className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses("tasks")}`}
            >
              <LayoutList
                size={18}
                strokeWidth={2.65}
                color={`${activeNavBar === "tasks" ? "#297AD6" : "#334155"}`}
              />
              My Tasks
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
        )}
      </div>
    </header>
  );
}
