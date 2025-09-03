import { DialogButton } from "@/components/common/ui/dialog";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import {
  useAcceptParticipantMutation,
  useVerifyParticipantMutation,
} from "@/hooks/subgraph/querycall";
import { getDialogContent } from "@/utils/dialog";
import hasRole from "@/utils/role";
import { ColumnDef } from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/types/task.type";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Check, CircleCheck, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";

interface SelectedTask {
  id: string;
  participant: string;
  completionUrl?: string;
  status: "PENDING" | "COMPLETED" | "VERIFIED";
  entityId?: string;
}

export function useColumns(): ColumnDef<TaskCreated>[] {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const acceptParticipantMutation = useAcceptParticipantMutation();
  const verifyParticipantMutation = useVerifyParticipantMutation();
  const { toast } = useToast();
  const { address: userAddress } = useAccount();

  const isPending =
    acceptParticipantMutation.isPending || verifyParticipantMutation.isPending;

  const handleMutation = async (task: SelectedTask) => {
    try {
      setOpenTaskId(null);

      if (task.status === "PENDING") {
        await acceptParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId ?? "0x",
        });
        toast({
          title: "Participant accepted successfully!",
          variant: "success",
        });
      } else if (task.status === "COMPLETED") {
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

      setSelectedTask(null);
    } catch (error) {
      console.error(
        `Error ${task.status === "PENDING" ? "accepting" : "verifying"} participant:`,
        error,
      );
      toast({
        title: `Failed to ${task.status === "PENDING" ? "accept" : "verify"} participant.`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleAction = (row: any) => {
    const status = row.getValue("status") as string;
    if (status === "PENDING" || status === "COMPLETED") {
      const task: SelectedTask = {
        id: row.original.taskId,
        participant: row.getValue("participant") as string,
        status: status as SelectedTask["status"],
        entityId: row.original.rewardManagement?.rewardManagement ?? "0x",
        completionUrl: row.getValue("completionUrl") as string | undefined,
      };
      setSelectedTask(task);
      setOpenTaskId(task.id);
    }
  };

  return [
    // Participant Column
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

    // Completion URL Column
    {
      accessorKey: "completionUrl",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Completion URL</div>
      ),
      cell: ({ row }) => {
        const completionUrl = row.getValue("completionUrl") as
          | string
          | undefined;
        if (!completionUrl) return null;

        const absoluteUrl =
          completionUrl.startsWith("http://") ||
          completionUrl.startsWith("https://")
            ? completionUrl
            : `https://${completionUrl}`;

        let displayUrl = completionUrl;
        try {
          displayUrl = new URL(absoluteUrl).hostname;
        } catch {}

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

    // Status Column
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

    // Actions Column
    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const dialogContent = getDialogContent(status);

        const taskOwnerAddress = row.original.taskDetail.owner;
        const entityContractAddress =
          row.original.rewardManagement?.rewardManagement ?? "";

        // Use role hook
        const { entityRole } = useGetEntityRole(entityContractAddress);
        const hasEntityOwnerRole = hasRole({ role: entityRole ?? "" });

        const isTaskOwner =
          userAddress?.toLowerCase() === taskOwnerAddress?.toLowerCase();
        const isAcceptAction = status === "PENDING";
        const isVerifyAction = status === "COMPLETED";

        const isDisabled =
          isPending ||
          (isAcceptAction && !hasEntityOwnerRole) ||
          (isVerifyAction && !isTaskOwner) ||
          !(status === "PENDING" || status === "COMPLETED");

        const tooltipMessage = isPending
          ? "Processing, please wait..."
          : isAcceptAction && !hasEntityOwnerRole
            ? "Only entity owners can accept participants"
            : isVerifyAction && !isTaskOwner
              ? "Only the task owner can verify participants"
              : `Click to ${isAcceptAction ? "accept" : "verify"} participant`;

        if (!(status === "PENDING" || status === "COMPLETED")) {
          return (
            <span className="text-sm text-gray-500">No action available</span>
          );
        }

        return (
          <div className="flex items-center gap-2 relative">
            {/* Show loader + message instead of CircleCheck when pending */}
            {isPending && selectedTask?.id === row.original.taskId ? (
              <div className="flex items-center gap-2 ml-1 text-sm text-gray-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>
                  {selectedTask.status === "PENDING"
                    ? "Accepting participant..."
                    : "Verifying participant..."}
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleAction(row)}
                disabled={isDisabled}
                title={tooltipMessage}
                className="disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <CircleCheck
                  color={isDisabled ? "#A1A1AA" : "#03AB65"}
                  strokeWidth={1.5}
                  size={28}
                />
              </button>
            )}

            {/* Dialog for action */}
            {selectedTask && openTaskId === row.original.taskId && (
              <DialogButton
                isOpen={!!openTaskId}
                setIsOpen={() => setOpenTaskId(null)}
                title={dialogContent.title}
                subTitle={dialogContent.subTitle}
                buttonName={
                  isPending ? "Processing..." : dialogContent.buttonName
                }
                handleApplyTaskLogic={() => handleMutation(selectedTask)}
                isDisabled={isPending}
              />
            )}
          </div>
        );
      },
    },
  ];
}
