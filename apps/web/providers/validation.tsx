"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { AppRegistryABI } from "@workspace/contracts/abis";
import { ConnectKitButton } from "connectkit";
import { AlertTriangle, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

type Role = "ADMIN" | "TREASURER" | "PARTICIPANT" | "NONE" | "BOTH";

interface ValidationProps {
  children: React.ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const { address, isConnected, isConnecting } = useAccount();

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
    if (isConnecting) return;

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
  }, [isConnected, isConnecting, hasDefaultAdminRole, hasTreasurerRole]);

  const renderOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white/95 shadow-xl rounded-2xl p-6 text-center max-w-sm w-100 border border-red-300">
        <div className="flex flex-col items-center justify-center mb-4">
          <AlertTriangle size={48} className="text-red-500 mb-2" />
          <h2 className="text-2xl font-bold text-red-600">
            Wallet Not Connected
          </h2>
        </div>
        <p className="text-red-700 text-l mb-4">
          You must connect your wallet to access the app.
        </p>
        <div className="flex flex-col items-center justify-center border border-red-300 rounded-xl p-4 cursor-pointer bg-white/80 hover:bg-white/90 transition-all duration-200 max-w-[200px] mx-auto">
          <Wallet size={40} strokeWidth={2.5} className="mb-2 text-gray-700" />
          <ConnectKitButton
            label="Connect Wallet"
            showAvatar={false}
            theme="auto"
          />
        </div>
      </div>
    </div>
  );

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
        return <TaskPortalNav>{children}</TaskPortalNav>;
      default:
        return null;
    }
  };

  const showOverlay = currentRole === "NONE" && !isConnected && !isConnecting;

  return (
    <>
      {renderNav()}
      {showOverlay && renderOverlay()}
    </>
  );
};

export default Validation;
