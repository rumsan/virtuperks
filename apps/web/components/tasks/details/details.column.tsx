import { DialogButton } from "@/components/common/ui/dialog";
import { getDialogContent } from "@/utils/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, Copy } from "lucide-react";
import { useState } from "react";
import useAcceptParticipant from "./accept.participant";

export function useColumns<T>(): ColumnDef<T>[] {
  const { handleAcceptParticipant } = useAcceptParticipant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const handleAction = (row: any) => {
 
  
    const entityId = row.original.taskDetail.task.entityTaskManager.entityTaskManager
    const taskId = row.original.taskId
 
    const status = row.getValue("status");
  
    const participant = row.getValue("participant");
  
  

    if (status === "UNACCEPTED") {
    
      setSelectedTask({ id: taskId, participant, status, entityId });
      setIsDialogOpen(true);
    } else if (status === "COMPLETED") {
     setSelectedTask({ id: taskId, participant, status });
      setIsDialogOpen(true);
    }
  };

  const handleDialogAction = async () => {
    if (selectedTask) {
      if (selectedTask.status === "UNACCEPTED") {
        try {
          setIsAcceptLoading(true);
          await handleAcceptParticipant(
            selectedTask.id, 
            selectedTask.participant, 
            selectedTask.entityId
          );
          setIsDialogOpen(false);
          setSelectedTask(null);
        } catch (error) {
          console.error("Error accepting participant:", error);
        } finally {
          setIsAcceptLoading(false);
        }
      }
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
        
       
        if (status === "COMPLETED") {
          return null; 
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

            <DialogButton
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              title={dialogContent.title}
              subTitle={dialogContent.subTitle}
              buttonName={isAcceptLoading ? "Processing..." : dialogContent.buttonName}
              handleApplyTaskLogic={handleDialogAction}
              isDisabled={isAcceptLoading}
            />
          </>
        );
      },
    },
  ];
}
