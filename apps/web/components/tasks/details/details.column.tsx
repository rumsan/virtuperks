import { DialogButton } from "@/components/common/ui/dialog";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import {
  useAcceptParticipantMutation,
  useRejectParticipantMutation,
  useVerifyParticipantMutation,
} from "@/hooks/subgraph/querycall";
import { getDialogContent } from "@/utils/dialog";
import hasRole from "@/utils/role";
import { ColumnDef } from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/types/task.type";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Check, CircleCheck, Copy, ExternalLink, XCircle } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";

interface SelectedTask {
  id: string;
  participant: string;
  completionUrl?: string;
  status: "PENDING" | "COMPLETED" | "VERIFIED";
  entityId?: string;
}
interface TaskCreatedWithRejectReason extends TaskCreated {
  rejectedReason?: string;
}

type ActionType = "accept" | "verify" | "reject";

export function useColumns(): ColumnDef<TaskCreated>[] {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());

  const acceptParticipantMutation = useAcceptParticipantMutation();
  const verifyParticipantMutation = useVerifyParticipantMutation();
  const rejectParticipantMutation = useRejectParticipantMutation();

  const { toast } = useToast();
  const { address: userAddress } = useAccount();

  const handleMutation = async (
    task: SelectedTask,
    action: ActionType,
    remarks?: string,
  ) => {
    try {

      setPendingTaskIds((prev) => new Set(prev).add(task.id));
      setOpenTaskId(null);

      if (action === "accept" && task.status === "PENDING") {
        await acceptParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId ?? "0x",
        });
        toast({
          title: "Participant accepted successfully!",
          variant: "success",
        });
      }

      if (action === "verify" && task.status === "COMPLETED") {
        await verifyParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId ?? "0x",
        });
        toast({
          title: "Participant verified successfully!",
          variant: "success",
          duration: 2000,
        });
      }

      if (action === "reject" && task.status === "COMPLETED") {
        await rejectParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId ?? "0x",
          remark: remarks?.trim() || "",
        });
        console.log("✅ Reject mutation completed successfully");
        toast({
          title: "Participant rejected successfully!",
          variant: "destructive",
          duration: 2000,
        });
      }
      setSelectedTask(null);
      setActionType(null);
    } catch (error) {
      console.error("Error handling mutation:", error);
      toast({ title: "Action failed", variant: "destructive", duration: 2000 });
    } finally {

      setPendingTaskIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  const handleAction = (row: any, action: ActionType) => {
    const status = row.getValue("status") as string;

    if (action === "accept" && status === "PENDING") {
      setSelectedTask({
        id: row.original.taskId,
        participant: row.getValue("participant") as string,
        status: "PENDING",
        entityId: row.original.rewardManagement?.rewardManagement ?? "0x",
      });
      setOpenTaskId(row.original.taskId);
      setActionType("accept");
    }

    if ((action === "verify" || action === "reject") && status === "COMPLETED") {
      setSelectedTask({
        id: row.original.taskId,
        participant: row.getValue("participant") as string,
        status: "COMPLETED",
        entityId: row.original.rewardManagement?.rewardManagement ?? "0x",
        completionUrl: row.getValue("completionUrl") as string | undefined,
      });
      setOpenTaskId(row.original.taskId);
      setActionType(action);
    }
  };

  return [
    // Participant
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Wallet Address</div>
      ),
      cell: ({ row }) => {
        const [copied, setCopied] = useState(false);
        const walletAddress = row.getValue("participant") as string;

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Failed to copy wallet address:", err);
          }
        };

        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleCopy}
          >
            <span className="text-sm text-gray-700">{walletAddress}</span>
            {copied ? (
              <Check color="#03AB65" size={16} strokeWidth={2.75} />
            ) : (
              <Copy color="#94A3B8" size={16} strokeWidth={2.75} />
            )}
          </div>
        );
      },
    },

    // Completion URL
    {
      accessorKey: "completionUrl",
      header: ({ table }) => {
        const hasNonRejected = table
          .getRowModel()
          .rows.some((row) => row.getValue("status") !== "REJECTED");
        if (!hasNonRejected) return null;
        return (
          <div className="text-left text-gray-600 font-bold">
            Completion URL
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "REJECTED") return null;

        const completionUrl = row.getValue("completionUrl") as string | undefined;
        if (!completionUrl) return null;

        const absoluteUrl =
          completionUrl.startsWith("http://") || completionUrl.startsWith("https://")
            ? completionUrl
            : `https://${completionUrl}`;

        let displayUrl = completionUrl;
        try {
          displayUrl = new URL(absoluteUrl).hostname;
        } catch { }

        return (
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline decoration-2"
          >
            <span className="text-sm truncate max-w-[200px]">{displayUrl}</span>
            <ExternalLink size={16} />
          </a>
        );
      },
    },

    // Status
    {
      accessorKey: "status",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Status</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColor =
          status === "COMPLETED"
            ? "text-green-600"
            : status === "UNACCEPTED"
              ? "text-yellow-600"
              : "text-gray-700";
        return <span className={`text-sm ${statusColor}`}>{status}</span>;
      },
    },

    // Actions / Remark Column
    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action / Remark</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        if (status === "REJECTED") {
          return (
            <span className="text-sm text-red-600">
              {row.original.rejectedReason || "No reason provided"}
            </span>
          );
        }

        const dialogContent = getDialogContent(status);
        const taskOwnerAddress = row.original.taskDetail.owner;
        const entityContractAddress =
          row.original.rewardManagement?.rewardManagement ?? "";

        const { entityRole } = useGetEntityRole(entityContractAddress);
        const hasEntityOwnerRole = hasRole({
          role: entityRole ?? "",
          address: userAddress,
        });
        const isTaskOwner =
          userAddress?.toLowerCase() === taskOwnerAddress?.toLowerCase();

        const isAcceptAction = status === "PENDING";
        const isVerifyRejectAction = status === "COMPLETED";
        const isDisabled =
          (pendingTaskIds.has(row.original.taskId)) ||
          (isAcceptAction && !hasEntityOwnerRole) ||
          (isVerifyRejectAction && !isTaskOwner);

        if (!(status === "PENDING" || status === "COMPLETED")) {
          return (
            <span className="text-sm text-gray-500">No action available</span>
          );
        }

        return (
          <div className="flex items-center gap-2 relative">
            {pendingTaskIds.has(row.original.taskId) ? (
              <div className="flex items-center gap-2 ml-1 text-sm text-gray-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>
                  {selectedTask?.status === "PENDING"
                    ? "Accepting..."
                    : actionType === "reject"
                      ? "Rejecting..."
                      : "Verifying..."}
                </span>
              </div>
            ) : (
              <>
                {isAcceptAction && (
                  <button
                    onClick={() => handleAction(row, "accept")}
                    disabled={isDisabled}
                    title="Accept participant"
                  >
                    <CircleCheck
                      color={isDisabled ? "#A1A1AA" : "#03AB65"}
                      strokeWidth={1.5}
                      size={28}
                    />
                  </button>
                )}

                {isVerifyRejectAction && (
                  <>
                    <button
                      onClick={() => handleAction(row, "verify")}
                      disabled={isDisabled}
                      title="Verify Task Completion"
                    >
                      <CircleCheck
                        color={isDisabled ? "#A1A1AA" : "#03AB65"}
                        strokeWidth={1.5}
                        size={28}
                      />
                    </button>

                    <button
                      onClick={() => handleAction(row, "reject")}
                      disabled={isDisabled}
                      title="Reject Task Completion"
                    >
                      <XCircle
                        color={isDisabled ? "#A1A1AA" : "#FF0000"}
                        strokeWidth={1.5}
                        size={28}
                      />
                    </button>
                  </>
                )}
              </>
            )}

            {selectedTask &&
              openTaskId === row.original.taskId &&
              actionType && (
                <DialogButton
                  isOpen={!!openTaskId}
                  setIsOpen={() => setOpenTaskId(null)}
                  title={
                    actionType === "accept"
                      ? "Accept this participant?"
                      : actionType === "verify"
                        ? "Verify this participant?"
                        : "Reject this participant?"
                  }
                  subTitle={
                    actionType === "reject"
                      ? "Please provide a reason (optional)."
                      : dialogContent.subTitle
                  }
                  buttonName={
                    pendingTaskIds.has(row.original.taskId)
                      ? "Processing..."
                      : actionType === "reject"
                        ? "Reject"
                        : dialogContent.buttonName
                  }
                  submitType={actionType === "reject" ? "Reject" : undefined}
                  handleApplyTaskLogic={(data) =>
                    handleMutation(selectedTask, actionType, data?.remarks)
                  }
                  isDisabled={pendingTaskIds.has(row.original.taskId)}
                />
              )}
          </div>
        );
      },
    },
  ];
}
