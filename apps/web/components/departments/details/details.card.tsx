"use client";

import { DialogButton } from "@/components/common/ui/dialog";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import {
  useAcceptTokenTransfer,
  useDirectTokenTransfer,
} from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/hooks/use-toast";
import {
  Building,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Loader2,
  Plus,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useAccount } from "wagmi";

type DepartmentDetailsCardProps = {
  entity: any;
  totalUnAllocatedTokens?: bigint;
  approvedTokens?: number;
  totalAllocatedTokens?: bigint;
  treasurerAddress?: string;
  getEntityOwners?: { wallet: `0x${string}`; label: string }[];
  router: AppRouterInstance;
  closePending?: boolean;
  handleCloseExpiredTasks?: () => Promise<void>;
};

export default function DepartmentDetailsCard({
  entity,
  totalUnAllocatedTokens,
  approvedTokens,
  treasurerAddress,
  getEntityOwners,
  totalAllocatedTokens,
  router,
  closePending,
  handleCloseExpiredTasks,
}: DepartmentDetailsCardProps) {
  const { address } = useAccount();
  const roleData = hasRole({
    role: process.env.NEXT_PUBLIC_MINTER_ROLE!,
    address,
  });

  const canAllocateToken = Boolean(roleData);

  const { entityRole, roleLoading } = useGetEntityRole(
    entity?.rewardManagement || "",
  );

  const hasEntityOwnerRole = hasRole({
    role: entityRole || "",
    address,
  });

  const canTransferToken = Boolean(hasEntityOwnerRole);

  const { directTransfer, directTransferPending } = useDirectTokenTransfer();

  const acceptTokenMutation = useAcceptTokenTransfer();

  const [isOpen, setIsOpen] = useState(false);
  const [copiedOwner, setCopiedOwner] = React.useState<string | null>(null);

  const params = useParams();
  const cuid = params?.id as string;

  const handleAcceptTokens = async () => {
    if (!approvedTokens || approvedTokens <= 0) {
      toast({
        title: "No approved tokens to accept",
        variant: "destructive",
      });
      return;
    }

    try {
      await acceptTokenMutation.mutateAsync({
        treasuryAddress: treasurerAddress || "",
        tokenAddress: process.env.NEXT_PUBLIC_RAHAT_TOKEN || "",
        amount: approvedTokens?.toString() || "0",
        rewardManagementAddress: entity.rewardManagement,
      });

      toast({
        title: "Tokens accepted successfully!",
        description: `${approvedTokens} tokens have been transferred to your department.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error accepting tokens:", error);
      toast({
        title: "Failed to accept tokens",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  if (!entity) {
    return (
      <p className="text-red-600">
        Department data is not available or could not be found.
      </p>
    );
  }

  const handleDialogAction = async (data: any) => {
    if (!approvedTokens) {
      toast({
        title: "Unable to fetch available tokens.",
        variant: "destructive",
      });
      return;
    }

    if (data.amount > approvedTokens) {
      toast({
        title: `Transfer amount exceeds available tokens!`,
        description: `Available: ${approvedTokens}, Requested: ${data.amount}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await directTransfer({
        to: data.to,
        amount: data.amount,
        remarks: data.remarks,
        entityId: entity.rewardManagement,
      });
      setIsOpen(false);
      toast({
        title: "Token transferred successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to transfer token. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTransferButton = () => {
    if (roleLoading) {
      return (
        <Button
          variant="outline"
          disabled
          className="h-12 w-48 flex items-center justify-center border border-[#03AB65] opacity-70 cursor-not-allowed"
        >
          <Loader2 className="h-4 w-4 animate-spin text-[#03AB65]" />
          <span className="ml-2 text-[#03AB65]">Loading...</span>
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="h-12 w-48 flex items-center justify-center border border-[#03AB65]"
        disabled={directTransferPending}
        onClick={() => !directTransferPending && setIsOpen(true)}
      >
        <span className="text-[#03AB65] flex items-center gap-2">
          {directTransferPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Gift size={16} strokeWidth={2.75} />
          )}
          {directTransferPending ? "Processing..." : "Bonus Token"}
        </span>
      </Button>
    );
  };

  const getCloseExpiredButton = () => {
    if (roleLoading) {
      return (
        <button
          type="button"
          disabled
          className="h-12 w-56 flex items-center justify-center rounded-md border border-[#FF5733] opacity-70 cursor-not-allowed"
        >
          <Loader2 className="h-4 w-4 animate-spin text-[#FF5733]" />
          <span className="ml-2 text-[#FF5733]">Loading...</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        disabled={closePending}
        onClick={handleCloseExpiredTasks}
        className={`h-12 w-56 flex items-center justify-center rounded-md border border-[#FF5733] 
          transition-colors font-medium
          ${closePending ? "opacity-70 cursor-not-allowed" : "hover:bg-[#FF5733]/10 cursor-pointer"}`}
      >
        <span
          className={`flex items-center gap-2 ${
            closePending ? "text-red-600" : "text-[#FF5733]"
          }`}
        >
          {closePending ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
          ) : (
            <Clock size={16} strokeWidth={2.75} />
          )}
          {closePending ? "Closing..." : "Close Expired Tasks"}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-1 my-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{entity.name}</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected department
            </h3>
          </div>
          <div className="flex gap-10">
            {/* Bonus Drop Button */}
            {canTransferToken && getTransferButton()}

            {canTransferToken && (
              <Button
                className="h-12 w-48 fw-[600] flex items-center justify-center"
                variant="default"
                onClick={() => router.push(PATHS.DEPARTMENT.TASK_ADD(cuid))}
              >
                <Plus size={22} strokeWidth={2.75} />
                <span>Create Task</span>
              </Button>
            )}

            {!directTransferPending && canTransferToken && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to transfer token amount?"
                subTitle="This action cannot be undone"
                buttonName={
                  directTransferPending ? "Processing..." : "Bonus Token"
                }
                submitType="directdisburse"
                handleApplyTaskLogic={handleDialogAction}
                availableTokens={approvedTokens ? Number(approvedTokens) : 0}
              />
            )}

            {canAllocateToken && (
              <Button
                className="h-12 w-48 fw-[600] flex items-center justify-center"
                variant="default"
                type="button"
                onClick={() =>
                  router.push(PATHS.TREASURER.CREATE(entity.entityId))
                }
              >
                <Plus size={22} strokeWidth={2.75} />
                <span className="">Approve Token</span>
              </Button>
            )}

            {canTransferToken && getCloseExpiredButton()}
          </div>
        </div>
      </div>

      {/* No Tokens - Info Banner */}
      {canTransferToken &&
        totalUnAllocatedTokens !== undefined &&
        totalUnAllocatedTokens === BigInt(0) &&
        (!approvedTokens || approvedTokens === 0) && (
          <div className="mt-4 mb-2">
            <div className="flex items-center gap-4 rounded-lg border-2 border-blue-400 bg-blue-50 p-4 shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                  <Gift className="h-6 w-6 text-blue-600" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-blue-800 text-base">
                    No Tokens Available - Getting Started
                  </span>
                  <span className="text-sm text-blue-700">
                    To create tasks and distribute rewards, follow these steps:
                  </span>
                  <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal space-y-1">
                    <li>
                      <span className="font-medium">Treasury/Minter</span> must
                      approve tokens to your department
                    </li>
                    <li>
                      Once approved,{" "}
                      <span className="font-medium">
                        you&apos;ll see a green banner
                      </span>{" "}
                      to accept the tokens
                    </li>
                    <li>
                      After accepting, tokens will be available for{" "}
                      <span className="font-medium">creating tasks</span> and
                      distributing rewards
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Token Acceptance Notification Banner */}
      {canTransferToken && approvedTokens && approvedTokens > 0 && (
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-green-500 bg-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full bg-green-100 p-2">
                <CheckCircle2
                  className="h-6 w-6 text-green-600"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-green-800 text-base">
                  Treasury has Approved {approvedTokens} Tokens
                </span>
                <span className="text-sm text-green-700">
                  Click the button to accept and transfer these tokens to your
                  department.
                </span>
              </div>
            </div>

            <Button
              variant="default"
              className="h-12 w-56 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              disabled={acceptTokenMutation.isPending}
              onClick={handleAcceptTokens}
            >
              {acceptTokenMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Accepting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                  <span>Accept Tokens</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 mt-4 gap-4 w-full">
        <Card className="font-normal text-base h-48 flex flex-col p-4">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full flex p-2 bg-[#475263] mb-auto">
              <Building color="#fff" size={20} />
            </div>
            <CardDescription className="flex flex-col gap-2">
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-start text-[#334155] text-xl justify-start">
                  {entity.name}
                </div>
                {getEntityOwners && getEntityOwners.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[#475569] font-medium text-sm">
                      {getEntityOwners.length === 1
                        ? "Department Owner"
                        : "Department Owners"}
                    </span>

                    <div className="flex flex-col gap-1 text-sm">
                      {getEntityOwners.map((owner, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => {
                            navigator.clipboard.writeText(owner.wallet);
                            setCopiedOwner(owner.wallet);
                            setTimeout(() => setCopiedOwner(null), 2000);
                          }}
                        >
                          <span className="truncate max-w-[180px] text-[#475569]">
                            {owner.label} ({owner.wallet.slice(0, 6)}...
                            {owner.wallet.slice(-4)})
                          </span>

                          {copiedOwner === owner.wallet ? (
                            <span className="text-green-600 font-bold">✔</span>
                          ) : (
                            <Copy
                              className="group-hover:text-blue-800"
                              size={16}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardTitle>
        </Card>

        <Card className="font-normal text-base h-48 flex flex-col">
          <CardHeader className="flex-grow p-5">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A] text-lg">
              Total Allocated Tokens
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold pb-5">
            {totalAllocatedTokens?.toString() ?? "-"}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-48 flex flex-col">
          <CardHeader className="flex-grow p-5">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A] text-lg">
              Total Unallocated Tokens
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold pb-5">
            {totalUnAllocatedTokens?.toString() ?? "-"}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-48 flex flex-col">
          <CardHeader className="flex-grow p-5">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A] text-lg">
              Total Tokens Redeemed
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold pb-5">
            -
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
