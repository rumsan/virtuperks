"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import {
  Coins,
  Layers,
  LayoutDashboard,
  LayoutList,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";
import { NavItem } from "../../../type/nav.types";

export default function UnifiedNav({ children }: PropsWithChildren) {
  const [activeNavBar, setActiveNavBar] = useState<NavItem>(
    NavItem.TASK_PORTAL,
  );
  const handleNavClick = (nav: NavItem) => {
    setActiveNavBar(nav);
  };

  const getNavItemClasses = (nav: NavItem) => {
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
              onClick={() => handleNavClick(NavItem.TASK_PORTAL)}
              width={50}
              height={50}
              alt="Logo"
            />
          </Link>
        </nav>
        <nav className="flex items-center gap-6 h-full">
          <Link
            href="/participants"
            onClick={() => handleNavClick(NavItem.PARTICIPANTs)}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.PARTICIPANTs)}`}
          >
            <LayoutDashboard size={18} strokeWidth={2.65} />
            Participants
          </Link>
          <Link
            href="/departments"
            onClick={() => handleNavClick(NavItem.DEPARTMENTS)}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.DEPARTMENTS)}`}
          >
            <Coins size={18} strokeWidth={2.65} />
            Department
          </Link>
          <Link
            href="/treasurer/token"
            onClick={() => handleNavClick(NavItem.TREASURER_TOKEN)}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TREASURER_TOKEN)}`}
          >
            <Layers size={18} strokeWidth={2.65} />
            Token Management
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 h-full">
          <Link
            href="/task_portal"
            onClick={() => handleNavClick(NavItem.TASK_PORTAL)}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASK_PORTAL)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            Tasks Portal
          </Link>
          <Link
            href="/tasks"
            onClick={() => handleNavClick(NavItem.TASKS)}
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASKS)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
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
        {/* )} */}
      </div>

      <div className="h-[calc(100dvh-60px)] overflow-auto">{children}</div>
    </header>
  );
}
