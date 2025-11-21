import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import { useGetWhiteListedParticipantByTask } from "@/hooks/subgraph/participant";
import { useAddToWhitelist, useRemoveFromWhitelist } from "@/hooks/subgraph/task";
import hasRole from "@/utils/role";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/hooks/use-toast";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useColumns } from "./details.column";


type TaskPortalParticipantProps = { taskId: any; isWhitelisted: boolean; taskData: any };

const TaskPortalParticipant = ({ taskId, isWhitelisted, taskData }: TaskPortalParticipantProps) => {
  console.log("Data: ", taskData)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [newParticipant, setNewParticipant] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const { address } = useAccount();
  const getWhiteListedParticipants = useGetWhiteListedParticipantByTask(taskId.id);
  // const getRemovedWhiteListedParticipants = useGetRemovedWhiteListedParticipantByTask(taskId.id);
  // console.log("Verify removed participant: ", getRemovedWhiteListedParticipants?.data)
  const whiteListedParticipants =
    getWhiteListedParticipants?.data?.data?.participantWhitelisteds || [];
  const hasWhitelistedParticipants = whiteListedParticipants.length > 0;
  const { addToWhitelist, addPending } = useAddToWhitelist();
  const { removeFromWhitelist, removePending } = useRemoveFromWhitelist();
  const { entityRole, roleLoading } = useGetEntityRole(
    taskData?.rewardManagement?.rewardManagement || "",
    );
  const hasEntityOwnerRole = hasRole({
      role: entityRole || "",
      address,
    });
const handleRemoveFromWhitelist = async (participant: string) => {
  try {
    await removeFromWhitelist({
      entityAddress: taskData.rewardManagement.rewardManagement,
      taskId: taskData.internal_id,
      participant,
    });

    toast({
      title: "Removed",
      description: `Participant ${participant} removed from whitelist`,
      variant: "success",
      duration: 5000,
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err?.message || "Failed to remove participant",
      variant: "destructive",
      duration: 5000,
    });
  }
};

  const handleAddToWhitelist = async (participant: string) => {
    try {
      await addToWhitelist({
        entityAddress: taskId.entityAddress,
        taskId: taskId.id,
        participant,
      });
      toast({
        title: "Success",
        description: `Participant ${participant} added to whitelist!`,
        variant: "success", 
        duration: 5000, 
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: 'errorMessage',
        variant: "destructive",
        duration: 5000, 
      });
    }
  };

  const columns = useColumns({
    addToWhitelist: handleAddToWhitelist,
    removeFromWhitelist: handleRemoveFromWhitelist,
    removePending: removePending,
    canRemove: hasEntityOwnerRole,
  });
  const data = useMemo(() => whiteListedParticipants, [whiteListedParticipants]);
const handleAddParticipant = async () => {
    if (!newParticipant) return;
  
    try {
      await addToWhitelist({
        entityAddress: taskData.rewardManagement.rewardManagement,
        taskId: taskData.internal_id,
        participant: newParticipant,
      });
  
      toast({
        title: "Success",
        description: `Participant ${newParticipant} added to whitelist!`,
        variant: "success",
        duration: 5000,
      });
  
      setNewParticipant("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to add participant",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const isWhitelistFull = whiteListedParticipants.length >= taskData.maxParticipants;

  return (
    <Card className="flex flex-col w-[80%] p-6 space-y-6">

  {hasWhitelistedParticipants ? (
    <>
    
      <div className="flex flex-col sm:flex-row justify-between gap-4">

      
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Whitelisted Participants</h2>
          <p className="text-gray-500 text-sm">
            Participants approved to join this task
          </p>
        </div>

        
        {hasEntityOwnerRole && !isWhitelistFull && taskData.isWhitelisted && (
  <div className="flex flex-row gap-2 items-center">
    <input
      type="text"
      value={newParticipant}
      onChange={(e) => setNewParticipant(e.target.value)}
      placeholder="Enter wallet address (0x...)"
      className="border border-gray-300 rounded-xl px-4 py-2 w-80 shadow-sm 
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

    <Button
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
      onClick={handleAddParticipant}
      disabled={addPending}
    >
      {addPending ? "Adding..." : "Add Participant"}
    </Button>
  </div>
)}

      </div>

      <hr className="border-gray-200" />

    
      <div className="flex flex-col gap-4">
        <ListTable table={table} columns={columns} />

        <div className="pt-2">
          <DataTablePagination
            table={table}
            setPagination={setPagination}
            pagination={pagination}
          />
        </div>
      </div>
    </>
  ) : isWhitelisted ? (

   
    <div className="flex flex-col items-center text-center py-10">
      <div className="text-5xl mb-4">📝</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        No participants yet
      </h3>
      <p className="text-gray-600 text-sm max-w-sm">
        This task has whitelist enabled, but no participants have been added.
      </p>
    </div>

  ) : (

   
    <div className="flex flex-col items-center text-center py-10">
      <div className="text-5xl mb-4">🌐</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        No Whitelist Required
      </h3>

      <p className="text-gray-600 text-sm max-w-sm">
        Any user with the <span className="font-semibold text-blue-600">participant role</span> can join this task.
      </p>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs">
        ✓ Open participation enabled
      </div>
    </div>
  )}
</Card>
  );
};

export default TaskPortalParticipant;
