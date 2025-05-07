"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import { AccessManagerABI } from "@workspace/contracts/abis";
import { ReactNode } from "react";
import { useAccount, useReadContract } from "wagmi";

interface ValidationProps {
  children: ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const { address, isConnected } = useAccount();

  const contractAddress = (
    process.env.NEXT_PUBLIC_ACCESSMANAGER?.startsWith("0x")
      ? process.env.NEXT_PUBLIC_ACCESSMANAGER
      : ""
  ) as `0x${string}`;

  const { data: hasEntityOwnerRole } = useReadContract({
    address: contractAddress,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_ENTITY_OWNER_ROLE,
      address,
    ],
  });

  const { data: hasTreasurerRole } = useReadContract({
    address: contractAddress,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_TREASURER_ROLE,
      address,
    ],
  });

  const isEntityOwner = Boolean(hasEntityOwnerRole);
  const isTreasurer = Boolean(hasTreasurerRole);

  if (!isConnected) {
    return <TaskPortalNav>{children}</TaskPortalNav>;
  }

  if (isEntityOwner) {
    return <EntityOwnerNav>{children}</EntityOwnerNav>;
  }

  if (isTreasurer) {
    return <TreasurerNav>{children}</TreasurerNav>;
  }

  return <TaskPortalNav>{children}</TaskPortalNav>;
};

export default Validation;
