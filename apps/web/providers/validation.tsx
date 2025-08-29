"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { AppRegistryABI } from "@workspace/contracts/abis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";

type Role = "ADMIN" | "TREASURER" | "PARTICIPANT" | "NONE" | "BOTH";

interface ValidationProps {
  children: React.ReactNode;
  restricted?: boolean; 
}

const Validation = ({ children, restricted = true }: ValidationProps) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const { data: hasAdminRole, isLoading: loadingAdmin } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE,
      address,
    ],
    query: {
      enabled: isConnected,
    },
  });

  const { data: hasTreasurerRole, isLoading: loadingTreasurer } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
      abi: AppRegistryABI,
      functionName: "hasRole",
      args: [
        process.env.NEXT_PUBLIC_APP_ID,
        process.env.NEXT_PUBLIC_MINTER_ROLE,
        address,
      ],
      query: {
        enabled: isConnected,
      },
    });

  const loading = loadingAdmin || loadingTreasurer || !isConnected;

  const isAuthorized = hasAdminRole || hasTreasurerRole;
  const isRestrictedPage =
    restricted &&
    (pathname.startsWith("/tasks") || pathname.startsWith("/participants"));

  useEffect(() => {
    if (!loading && isRestrictedPage && !isAuthorized) {
      const timer = setTimeout(() => {
        router.replace("/task_portal");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, isRestrictedPage, isAuthorized, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-gray-500">
        Checking permissions... {" "}
      </div>
    );
  } 

  if (isRestrictedPage && !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
        🚫 You are not allowed to access this page. Redirecting you... 
        {" "}
      </div>
    );
  }

  let currentRole: Role;
  if (!isConnected) {
    currentRole = "NONE";
  } else if (hasAdminRole && hasTreasurerRole) {
    currentRole = "BOTH";
  } else if (hasAdminRole) {
    currentRole = "ADMIN";
  } else if (hasTreasurerRole) {
    currentRole = "TREASURER";
  } else {
    currentRole = "PARTICIPANT";
  }

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

export default Validation;
