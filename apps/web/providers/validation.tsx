"use client";

import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { AppRegistryABI } from "@workspace/contracts/abis";
import { ConnectKitButton } from "connectkit";
import { AlertTriangle } from "lucide-react";
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

  // Overlay shown when wallet is NOT connected
  const showOverlay = !isConnected;

  const renderOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="border border-blue-300 rounded-md p-6 max-w-md w-full mx-4 text-center bg-white shadow-lg">
        {/* Centered Circle with Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
            <AlertTriangle size={35} stroke="white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Wallet Not Connected
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You must connect your wallet to access this app
        </p>

        {/* Connect Wallet Button */}
        <div className="flex flex-col items-center gap-4">
          {/* Visible custom button */}
          <button className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 transition-colors">
            <ConnectKitButton
              label="Connect Wallet"
              showAvatar={false}
              theme="auto"
            />
          </button>
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

  return (
    <>
      {renderNav()}
      {showOverlay && renderOverlay()}
    </>
  );
};

export default Validation;
