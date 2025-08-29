import { DialogButton } from "@/components/common/ui/dialog";
import {
  useAcceptParticipantMutation,
  useVerifyParticipantMutation,
} from "@/hooks/subgraph/querycall";
import { getDialogContent } from "@/utils/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const acceptParticipantMutation = useAcceptParticipantMutation();
  const verifyParticipantMutation = useVerifyParticipantMutation();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
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
        });
      }
      setIsDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error(
        `Error ${task.status === "PENDING" ? "accepting" : "verifying"} participant:`,
        error,
      );
      toast({
        title: `Failed to ${task.status === "PENDING" ? "accept" : "verify"} participant.`,
        variant: "destructive",
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

  const LoadingBar = () =>
    isPending ? (
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
    ) : null;

  return [
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

        let displayUrl: string;
        try {
          const urlObj = new URL(absoluteUrl);
          displayUrl = urlObj.hostname;
        } catch {
          displayUrl = completionUrl;
        }

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
    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        // ... (existing logic)
        const status = row.getValue("status") as string;
        const dialogContent = getDialogContent(status);
        const taskOwnerAddress = row.original.taskDetail.owner;

        const isOwner =
          userAddress?.toLowerCase() === taskOwnerAddress?.toLowerCase();
        const isDisabled = isPending || !isOwner;

        // Determine the tooltip message based on the disabled state
        const tooltipMessage = !isOwner
          ? "Only the task owner of task can perform this action"
          : isPending
            ? "Processing, please wait..."
            : `Click to ${status === "PENDING" ? "accept" : "verify"} participant`;

        if (status !== "PENDING" && status !== "COMPLETED") {
          return (
            <span className="text-sm text-gray-500">No action available</span>
          );
        }

        return (
          <>
            <button
              onClick={() => handleAction(row)}
              disabled={isDisabled}
              title={tooltipMessage}
              className={`disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CircleCheck color="#03AB65" strokeWidth={1.5} size={28} />
            </button>
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
            <LoadingBar />
          </>
        );
      },
    },
  ];
}
