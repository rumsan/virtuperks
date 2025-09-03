"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { AppRegistryABI } from "@workspace/contracts/abis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

type Role = "ADMIN" | "TREASURER" | "PARTICIPANT" | "NONE" | "BOTH";

interface ValidationProps {
  children: React.ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const [currentRole, setCurrentRole] = useState<Role>("NONE");
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const { data: hasDefaultAdminRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE,
      address,
    ],
  });

  const { data: hasTreasurerRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_MINTER_ROLE,
      address,
    ],
  });

  useEffect(() => {
    if (!isConnected) {
      setCurrentRole("NONE");
      return;
    }

    if (hasDefaultAdminRole && hasTreasurerRole) {
      setCurrentRole("BOTH");
    } else if (hasDefaultAdminRole) {
      setCurrentRole("ADMIN");
    } else if (hasTreasurerRole) {
      setCurrentRole("TREASURER");
    } else {
      setCurrentRole("PARTICIPANT");
    }
  }, [isConnected, hasDefaultAdminRole, hasTreasurerRole]);

  // 🚫 If participant tries to access /tasks, show message then redirect
  useEffect(() => {
    if (
      currentRole === "PARTICIPANT" &&
      (pathname === "/tasks" || pathname === "/participants")
    ) {
      const timer = setTimeout(() => {
        router.replace("/task_portal"); // 👈 navigate after 3s
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [currentRole, pathname, router]);

  if (
    currentRole === "PARTICIPANT" &&
    (pathname === "/tasks" || pathname === "/participants")
  ) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
        🚫 You are not allowed to access this page. Redirecting you...
      </div>
    );
  }

  const renderNav = () => {
    switch (currentRole) {
      case "BOTH":
        return <UnifiedNav>{children}</UnifiedNav>;
      case "ADMIN":
        return <EntityOwnerNav>{children}</EntityOwnerNav>;
      case "TREASURER":
        return <TreasurerNav>{children}</TreasurerNav>;
      case "PARTICIPANT":
      case "NONE":
      default:
        return <TaskPortalNav>{children}</TaskPortalNav>;
    }
  };

  return renderNav();
};

export default Validation;
