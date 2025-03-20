import { DialogButton } from "@/components/common/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, Copy } from "lucide-react";
import { useState } from "react";
import useAcceptParticipant from "./accept.participant";
import useApproveTask from "./approve.task";

export function useColumns<T>(): ColumnDef<T>[] {
  const { handleAcceptParticipant } = useAcceptParticipant();
  const { handleApproveTask } = useApproveTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const getDialogContent = (status: string) => {
    return {
      title: status === "UNACCEPTED" 
        ? "Are you sure you want to accept this participant?" 
        : "Are you sure you want to approve task request?",
      subTitle: status === "UNACCEPTED"
        ? "This will allow the participant to start working on the task"
        : "This action cannot be undone",
      buttonName: status === "UNACCEPTED" ? "Accept" : "Approve"
    };
  };

  const handleAction = (row: any) => {
    const status = row.getValue("status");
    const internal_id = row.getValue("internal_id");
    const participant = row.getValue("participant");

    if (status === "UNACCEPTED") {
      setSelectedTask({ id: internal_id, participant, status });
      setIsDialogOpen(true);
    } else if (status === "COMPLETED") {
      setSelectedTask({ id: internal_id, participant, status });
      setIsDialogOpen(true);
    }
  };

  const handleDialogAction = async () => {
    if (selectedTask) {
  
      if (selectedTask.status === "UNACCEPTED") {
        await handleAcceptParticipant(selectedTask.id, selectedTask.participant);
      } else if (selectedTask.status === "COMPLETED") {
        //await handleApproveTask(selectedTask.id);
      }
      setIsDialogOpen(false);
      setSelectedTask(null);
    }
  };


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
      accessorKey: "internal_id",
      header: () => <div className="text-left text-gray-600 font-bold">ID</div>,
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-700">{row.getValue("internal_id")}</span>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => <div className="text-left text-gray-600 font-bold">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span className={`text-sm ${
            status === "COMPLETED" ? "text-green-600" : 
            status === "UNACCEPTED" ? "text-yellow-600" : 
            "text-gray-700"
          }`}>
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

            <DialogButton
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              title={dialogContent.title}
              subTitle={dialogContent.subTitle}
              buttonName={dialogContent.buttonName}
              handleApplyTaskLogic={handleDialogAction}
            />
          </>
        );
      },
    },
  ];
}
