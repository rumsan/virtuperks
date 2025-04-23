"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import { AccessManagerABI } from "@workspace/contracts/abis";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

interface ValidationProps {
  children: ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const [isEntityOwner, setIsEntityOwner] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: hasEntityOwnerRole } = useReadContract({
    address: (process.env.NEXT_PUBLIC_ACCESSMANAGER?.startsWith("0x") ? process.env.NEXT_PUBLIC_ACCESSMANAGER : "") as `0x${string}`,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, process.env.NEXT_PUBLIC_ENTITY_OWNER_ROLE, address],
    
  });

  useEffect(() => {
    setIsEntityOwner(!!hasEntityOwnerRole);
  }, [hasEntityOwnerRole]);

 
  if (!isConnected) {
    return <TaskPortalNav>{children}</TaskPortalNav>;
  }

 
  return isEntityOwner ? (
    <EntityOwnerNav>{children}</EntityOwnerNav>
  ) : (
    <TaskPortalNav>{children}</TaskPortalNav>
  );
};

export default Validation;
