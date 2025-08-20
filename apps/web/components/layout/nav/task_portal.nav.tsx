"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import { Layers, LayoutList, ShoppingBag, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { NavItem } from "../../../type/nav.types";
import { navItemPaths } from "./navItemPaths";

export default function TaskPortalNav({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const getNavItemClasses = (navItem: NavItem) => {
    const paths = navItemPaths[navItem];

    return paths.some((path) => {
      if (path === "/task_portal") {
        return (
          pathname === "/task_portal" ||
          (pathname.startsWith("/task_portal/") &&
            pathname !== "/task_portal/mine")
        );
      }
      if (path === "/task_portal/mine") {
        return pathname === "/task_portal/mine";
      }
      return pathname === path || pathname.startsWith(`${path}/`);
    })
      ? "text-[#297AD6] border-b-2 border-[#297AD6]"
      : "text-[#1E293B] hover:text-[#1e293b]";
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center pl-6 pr-4 justify-between border-b-2 border-[#E2E8F0]">
        {/* Left section: Logo + Token Marketplace */}
        <div className="flex items-center gap-20 h-full">
          <Link href="/" className="flex items-center">
            <Image
              src="/bg/rumsan-logo.png"
              width={40}
              height={40}
              alt="Logo"
            />
          </Link>
          <Link
            href="/departments"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.DEPARTMENTS)}`}
          >
            <Layers size={18} strokeWidth={2.65} />
            Department
          </Link>
          <Link
            href="/token_marketplace"
            className={`flex items-center gap-2 text-sm font-medium h-full px-2 ${getNavItemClasses(NavItem.TOKEN_MARKETPLACE)}`}
          >
            <ShoppingBag size={18} strokeWidth={2.65} />
            Token Marketplace
          </Link>
        </div>

        {/* Right section: Navigation + Wallet + Avatar */}
        <div className="flex items-center gap-4 h-full">
          <Link
            href="/task_portal"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full px-2 ${getNavItemClasses(NavItem.TASK_PORTAL)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            Tasks Portal
          </Link>
          <Link
            href="/task_portal/mine"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full px-2 ${getNavItemClasses(NavItem.MY_TASKS)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            My Tasks
          </Link>

          <div className="flex items-center h-10 bg-[#F1F5F9] rounded-md px-3">
            <span className="flex items-center gap-2 text-sm text-[#1E293B]">
              <Wallet size={18} strokeWidth={2.65} color="#334155" />
              <ConnectKitButton showAvatar={false} theme="auto" />
            </span>
          </div>

          <Avatar className="h-7 w-7 bg-red-400">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="h-[calc(100dvh-60px)] overflow-auto">{children}</div>
    </header>
  );
}
