import { DialogButton } from "@/components/common/ui/dialog";
import { useAcceptParticipantMutation, useVerifyParticipantMutation } from "@/hooks/subgraph/querycall";
import { getDialogContent } from "@/utils/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { CircleCheck, CircleX, Copy, ExternalLink } from 'lucide-react';
import { useState } from "react";
interface SelectedTask {
  id: string;
  participant: string;
  completionUrl?: string;
  status: "PENDING" | "COMPLETED" |
  "vERIFIED";
  entityId?: string;
}

export function useColumns<T extends { taskId: string }>(): ColumnDef<T>[] {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const acceptParticipantMutation = useAcceptParticipantMutation();
  const verifyParticipantMutation = useVerifyParticipantMutation();
  const { toast } = useToast();

  const handleMutation = async (task: SelectedTask) => {
    try {
     
      if (task.status === "PENDING") {
        await acceptParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId || "0x",
        });
        toast({
          title: "Participant accepted successfully!",
          variant: "success",
        });
      } else if (task.status === "COMPLETED") {
        await verifyParticipantMutation.mutateAsync({
          taskId: task.id,
          participant: task.participant,
          entityId: task.entityId || "0x",
        });
        toast({
          title: "Participant verified successfully!",
          variant: "success",
        });
      }
      setIsDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error(`Error ${task.status === "PENDING" ? "accepting" : "verifying"} participant:`, error);
      toast({
        title: `Failed to ${task.status === "PENDING" ? "accept" : "verify"} participant.`,
        variant: "destructive",
      });
    }
  };

const handleAction = (row: any) => {
  const status = row.getValue("status") 

  if (status === "PENDING" || status === "COMPLETED") {
    const task = {
      id: row.original.taskId,
      participant: row.getValue("participant"),
      status,
      entityId: row.original.rewardManagement.rewardManagement,  


      }
      setSelectedTask(task);
      setIsDialogOpen(true);
    }
  };



  

  const LoadingBar = () =>
    acceptParticipantMutation.isPending ? (
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
    ) : null;

  return [
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Wallet Address</div>
      ),

      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {row.getValue("participant")}
            </span>
            <Copy color="#94A3B8" size={16} strokeWidth={2.75} />
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
        const status = row.getValue("status");
        const completionUrl = row.getValue("completionUrl");

        if (!completionUrl) {
          return null;
        }

        return (
          <a 
            href={completionUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <span className="text-sm">View Submission</span>
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
        const status = row.getValue("status");
        return (
          <span
            className={`text-sm ${
              status === "COMPLETED"
                ? "text-green-600"
                : status === "UNACCEPTED"
                  ? "text-yellow-600"
                  : "text-gray-700"
            }`}
          >
            {row.getValue("status")}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue("status");
        const dialogContent = getDialogContent(status as string);
        const isPending = acceptParticipantMutation.isPending || verifyParticipantMutation.isPending;
        if (status !== "PENDING" && status !== "COMPLETED") {
          return <span className="text-sm text-gray-500">No action available</span>;
        }

     

        return (
          <>
            <span className="flex items-center gap-1">
              <CircleCheck
                color="#03AB65"
                strokeWidth={1.5}
                size={28}
                onClick={() => handleAction(row)}
                className="cursor-pointer"
              />
              <CircleX color="#E44134" strokeWidth={1.5} size={28} />
            </span>

            {selectedTask && isDialogOpen &&  selectedTask.id===row.original.taskId &&(
              <DialogButton
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                title={dialogContent.title}
                subTitle={dialogContent.subTitle}
                buttonName={isPending ? "Processing..." : dialogContent.buttonName}
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
