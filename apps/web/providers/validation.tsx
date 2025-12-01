"use client";

import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import UnifiedNav from "@/components/layout/nav/unified.nav";
import { useFindEntityOwner } from "@/hooks/subgraph/entity";
import { useFindTaskOwner } from "@/hooks/subgraph/task";
import { AppRegistryABI } from "@workspace/contracts/abis";
import { ConnectKitButton } from "connectkit";
import { AlertTriangle, Wallet } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

type Role = "ADMIN" | "TREASURER" | "PARTICIPANT" | "NONE" | "BOTH";

interface ValidationProps {
  children: React.ReactNode;
}

const Validation = ({ children }: ValidationProps) => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const { address, isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const previousRoleRef = useRef<Role | null>(null);

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

  const { data: hasParticipantRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [
      process.env.NEXT_PUBLIC_APP_ID,
      process.env.NEXT_PUBLIC_PARTICIPANT_ROLE,
      address,
    ],
  });

  // Check for privileged roles first
  const hasBasicPrivilegedRole = hasDefaultAdminRole || hasTreasurerRole;

  // Only check entity owner and task owner if user doesn't have basic privileged roles
  // This reduces unnecessary subgraph calls
  const shouldCheckEntityOwner =
    !hasBasicPrivilegedRole && isConnected && !!address;
  const { data: hasEntityOwnerRole } = useFindEntityOwner(
    shouldCheckEntityOwner ? (address as string) : "",
  );

  // will implement later
  const { data: hasTaskOwnerRole } = useFindTaskOwner(address as string);
  console.log("hasTaskOwnerRole", hasTaskOwnerRole);

  useEffect(() => {
    if (isConnecting) return;

    if (!isConnected) {
      setCurrentRole("NONE");
      previousRoleRef.current = null;
      return;
    }

    // Wait for role data to load before making decisions
    const rolesAreLoading =
      hasDefaultAdminRole === undefined ||
      hasTreasurerRole === undefined ||
      hasParticipantRole === undefined ||
      hasTaskOwnerRole === undefined;

    // For entity owner, only wait if we're actually checking it
    const shouldCheckEntityOwner = !hasBasicPrivilegedRole && isConnected;
    const entityOwnerLoading =
      shouldCheckEntityOwner && hasEntityOwnerRole === undefined;

    if (rolesAreLoading || entityOwnerLoading) {
      return;
    }

    //check privileged role
    const hasPrivilegedRole =
      hasDefaultAdminRole ||
      hasTreasurerRole ||
      hasEntityOwnerRole ||
      hasTaskOwnerRole;

    let newRole: Role;

    if (hasPrivilegedRole && hasParticipantRole) {
      newRole = "BOTH";
    } else if (hasPrivilegedRole) {
      newRole = "BOTH";
    } else if (hasParticipantRole) {
      newRole = "PARTICIPANT";
    } else {
      newRole = "NONE";
    }

    // Update current role and track previous role
    setCurrentRole(newRole);
    previousRoleRef.current = newRole;
  }, [
    isConnected,
    isConnecting,
    hasDefaultAdminRole,
    hasTreasurerRole,
    hasEntityOwnerRole,
    hasTaskOwnerRole,
    hasParticipantRole,
    hasBasicPrivilegedRole,
  ]);

  // Separate effect for handling redirects based on pathname and role
  useEffect(() => {
    if (!currentRole || isConnecting || !isConnected) return;

    // Only redirect participants and NONE users from restricted routes
    if (currentRole === "PARTICIPANT" || currentRole === "NONE") {
      const adminOnlyRoutes = ["/departments", "/tasks", "/participants"];
      const isOnAdminRoute = adminOnlyRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isOnAdminRoute) {
        // Use replace instead of push to avoid adding to history
        router.replace("/task_portal");
      }
    }
  }, [currentRole, pathname, isConnected, isConnecting, router]);

  const renderOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white/95 shadow-xl rounded-2xl p-6 text-center max-w-sm w-100 border border-red-300">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
            <AlertTriangle size={28} stroke="white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Wallet Not Connected
          </h2>
        </div>
        <p className="text-red-700 text-l mb-4">
          You must connect your wallet to access the app.
        </p>
        <div
          className="flex items-center justify-center gap-1.5 border border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 max-w-[200px] mx-auto"
          style={{ backgroundColor: "rgb(246,247,249)" }}
        >
          <Wallet size={40} strokeWidth={2.5} className="text-gray-700" />
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
      case "ADMIN":
      case "TREASURER":
        // Anyone with admin, treasurer, or entity owner role sees UnifiedNav
        return <UnifiedNav>{children}</UnifiedNav>;
      case "PARTICIPANT":
      case "NONE":
        // Participants and non-role users see TaskPortalNav
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
