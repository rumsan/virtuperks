"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { AccessManagerABI } from "@workspace/contracts/abis";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

type Role = "ENTITY_OWNER" | "TREASURER" | "PARTICIPANT" | "NONE" | "BOTH";

interface ValidationProps {
  children: React.ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const [currentRole, setCurrentRole] = useState<Role>("NONE");
  const { address, isConnected } = useAccount();

  const { data: hasEntityOwnerRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_ACCESSMANAGER as `0x${string}`,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_ENTITY_OWNER_ROLE,
      address,
    ],
  });

  const { data: hasTreasurerRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_ACCESSMANAGER as `0x${string}`,
    abi: AccessManagerABI,
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

    if (hasEntityOwnerRole && hasTreasurerRole) {
      setCurrentRole("BOTH");
    } else if (hasEntityOwnerRole) {
      setCurrentRole("ENTITY_OWNER");
    } else if (hasTreasurerRole) {
      setCurrentRole("TREASURER");
    } else {
      setCurrentRole("PARTICIPANT");
    }
  }, [isConnected, hasEntityOwnerRole, hasTreasurerRole]);
  console.log("currentRole", currentRole);

  const renderNav = () => {
    switch (currentRole) {
      case "BOTH":
        return <UnifiedNav>{children}</UnifiedNav>;
      case "ENTITY_OWNER":
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
