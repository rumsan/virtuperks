import { useGetEntityRole } from "@/hooks/subgraph/entity";
import { useGetWhiteListedParticipantByTask } from "@/hooks/subgraph/participant";
import { useAddToWhitelist, useRemoveFromWhitelist, useUpdateTaskDetails } from "@/hooks/subgraph/task";
import { formatDate } from "@/utils/formatDate";
import hasRole from "@/utils/role";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Building2, Pencil, Timer, Trophy, UserRoundCog, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";

type TaskDetailsProps = {
  taskData: any;
};

const TaskDetails = ({ taskData }: TaskDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [detailsUrl, setDetailsUrl] = useState(taskData?.taskDetail?.detailsUrl || "");
  const [expiryDate, setExpiryDate] = useState(taskData?.taskDetail?.expiryDate || "");
  const [newParticipant, setNewParticipant] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const { address } = useAccount();
  const { addToWhitelist, addPending } = useAddToWhitelist();
  const { removeFromWhitelist, removePending } = useRemoveFromWhitelist();
  const { entityRole, roleLoading } = useGetEntityRole(
      taskData?.rewardManagement?.rewardManagement || "",
      );
  const hasEntityOwnerRole = hasRole({
        role: entityRole || "",
        address,
      });

const getWhiteListedParticipants = useGetWhiteListedParticipantByTask(taskData?.taskDetail?.id);
const whiteListedParticipants = getWhiteListedParticipants?.data?.data?.participantWhitelisteds || [];

const handleAddParticipant = async () => {
  if (!newParticipant) return;

  try {
    await addToWhitelist({
      entityAddress: taskData.rewardManagement.rewardManagement,
      taskId: taskData.taskDetail.id,
      participant: newParticipant,
    });

    toast({
      title: "Success",
      description: `Participant ${newParticipant} added to whitelist!`,
      variant: "success",
    });

    setNewParticipant("");
  } catch (err: any) {
    toast({
      title: "Error",
      description: err?.message || "Failed to add participant",
      variant: "destructive",
    });
  }
};

const handleRemoveFromWhitelist = async (participant: string) => {
  try {
    setRemoving(participant);

    await removeFromWhitelist({
      entityAddress: taskData.rewardManagement.rewardManagement,
      taskId: taskData.taskDetail.id,
      participant,
    });

    toast({
      title: "Removed",
      description: `Participant ${participant} removed`,
      variant: "success",
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err?.message || "Failed to remove participant",
      variant: "destructive",
    });
  } finally {
    setRemoving(null);
  }
};



  const { updateTaskDetails, isPending } = useUpdateTaskDetails();

  const formattedDate = formatDate(taskData?.taskDetail?.expiryDate);
  const isWhiteListed = taskData?.taskDetail?.isWhitelisted;

  const openEditModal = () => {
    setDetailsUrl(taskData?.taskDetail?.detailsUrl || "");
    setExpiryDate(taskData?.taskDetail?.expiryDate || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateTaskDetails({
        entityAddress: taskData?.rewardManagement?.rewardManagement,
        taskId: taskData?.taskDetail?.id,
        detailsUrl,
        expiryDate: Number(new Date(expiryDate).getTime() / 1000),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task details:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Card className="w-[70%] h-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardTitle className="flex flex-col gap-4 w-full">
          {/* Title and Status */}
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#1E293B]">{taskData?.taskDetail?.name}</span>
              <span
                className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                  taskData?.taskDetail?.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {taskData?.taskDetail?.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <button
  className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 flex items-center gap-2"
  onClick={openEditModal}
>
  <Pencil size={18} className="text-blue-600" />
  Edit URL & Deadline
</button>

          </div>

          <div
    className="flex items-center gap-2 max-w-[300px] truncate text-base group cursor-pointer"
    onClick={() =>
      taskData?.taskDetail?.detailsUrl &&
      window.open(taskData.taskDetail.detailsUrl, "_blank")
    }
  >
    <span
      className="text-[#297AD6] truncate border-b-2 border-transparent group-hover:border-[#297AD6] transition-all"
      title={taskData?.taskDetail?.detailsUrl}
    >
      {taskData?.taskDetail?.detailsUrl
        ? taskData.taskDetail.detailsUrl.length > 50
          ? `${taskData.taskDetail.detailsUrl.slice(0, 50)}...`
          : taskData.taskDetail.detailsUrl
        : ""}
    </span>
  </div>
        </CardTitle>

        {/* Task Info */}
        <div className="flex flex-col text-gray-600 font-medium gap-2 mt-4 text-base">
          <span className="flex items-center gap-3">
            <UserRoundCog color="#64748B" size={22} strokeWidth={2.5} />
            Task Owner: <span className="font-semibold">{taskData?.taskDetail?.owner}</span>
          </span>

          <span className="flex items-center gap-3">
            <Users color="#64748B" size={22} strokeWidth={2.5} />
            <span className="font-semibold">{taskData?.taskDetail?.maxParticipants}</span> members participating
          </span>

          <span className="flex items-center gap-3">
            <Timer color="#64748B" size={22} strokeWidth={2.5} />
            Deadline: <span className="font-semibold">{formattedDate}</span>
          </span>

          <span className="flex items-center gap-3 mt-3">
            <Building2 color="#64748B" size={22} strokeWidth={2.5} />
            Department: <span className="font-semibold">{taskData?.rewardManagement?.name || "N/A"}</span>
          </span>

          <span className="flex items-center gap-3 mt-3">
          <Trophy color="#64748B" size={22} strokeWidth={2.5} />
           Tokens:
          <span className="font-semibold">
    {taskData?.taskDetail?.totalRewardAmount || "N/A"}
  </span>
          </span>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">Eligibility: </span>
              {isWhiteListed ? (
                <span>
                  Only <span className="font-semibold">whitelisted participants</span> can participate.
                </span>
              ) : (
                <span>
                  Anyone with the <span className="font-semibold">participant role</span> can participate.
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>

      
  <Card className="w-[30%] p-4 ml-auto flex flex-col gap-6 bg-white rounded-xl shadow-sm h-[382px]">
  {/* Section Title */}
  <div className="flex flex-col">
    <span className="text-xl font-semibold text-[#1E293B]">Whitelisted Participants</span>
    <span className="text-gray-500 text-sm">
      Add or manage participants allowed to join this task
    </span>
  </div>

  {/* Input Field */}
  {taskData?.taskDetail?.isWhitelisted && hasEntityOwnerRole && (
    <div className="flex gap-2">
      <input
        type="text"
        value={newParticipant}
        onChange={(e) => setNewParticipant(e.target.value)}
        placeholder="Enter wallet address (0x...)"
        className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm"
        onClick={handleAddParticipant}
        disabled={addPending}
      >
        {addPending ? "Adding..." : "Add"}
      </button>
    </div>
  )}

  {/* Scrollable Whitelist Container */}
  <div className="flex-1 overflow-y-auto flex flex-col gap-3 mt-2 pr-1">

    {whiteListedParticipants.length > 0 ? (
      whiteListedParticipants.map((p: any) => (
        <div
          key={p.participant}
          className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
        >
          <span className="text-sm text-gray-700">
            {`${p.participant.slice(0, 20)}...${p.participant.slice(-8)}`}
          </span>

          {hasEntityOwnerRole && (
            <button
              onClick={() => handleRemoveFromWhitelist(p.participant)}
              disabled={removing === p.participant}
              className="text-red-500 hover:text-red-700 flex items-center"
            >
              {removing === p.participant ? (
                <span className="text-xs animate-pulse">Removing...</span>
              ) : (
                <XCircle size={18} strokeWidth={2.5} />
              )}
            </button>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 text-center py-4">
        No whitelisted participants yet
      </p>
    )}
  </div>

</Card>




      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>

            <label className="block mb-2 font-medium">Details URL</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1 mb-4"
              value={detailsUrl}
              onChange={(e) => setDetailsUrl(e.target.value)}
            />

            <label className="block mb-2 font-medium">Deadline</label>
            <input
              type="date"
              className="border border-gray-300 rounded w-full px-2 py-1 mb-4"
              value={expiryDate?.split("T")[0]}
              onChange={(e) => setExpiryDate(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDetails;
