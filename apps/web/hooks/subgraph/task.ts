import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useWriteRewardManagementCreateTask } from "../wagmi/contracts";



export const useTaskAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } =
      useWriteRewardManagementCreateTask();
    const { address, isConnected } = useAccount();

      
 

 
    
  const mutation = useMutation({
      mutationFn: async (data: any) => {
        
      const verifiedParticipants = data.verifiedParticipants || [];
       
   
      const result = await writeContractAsync({
        address: data.entityAddress as `0x${string}`,
          args: [data.taskId, { 
            name: data.name as string, 
            detailsUrl: data.detailsUrl as string, 
            owner: data.owner as `0x${string}`, 
            expiryDate: BigInt(data.expiryDate), 
            rewardToken: data.rewardToken as `0x${string}`, 
            totalRewardAmount: BigInt(data.totalRewardAmount), 
            isOpen: Boolean(data.isOpen), 
            requireApproval: Boolean(data.requireApproval), 
            isWhitelisted: Boolean(data.isWhitelisted), 
            isTokenDisbursed: Boolean(data.isTokenDisbursed), 
            maxParticipants: BigInt(data.maxParticipants), 
            acceptedParticipantCount: BigInt(data.acceptedParticipantCount), 
            verifiedParticipants:verifiedParticipants as readonly `0x${string}`[] 
          }, data.whitelistedParticipants],
      });
     return result;
    },
    onSuccess: (result, variable) => {
    
    },
  });
  return {
    taskAdd: mutation.mutateAsync,
    taskPending: mutation.isPending,
    taskSuccess: mutation.isSuccess,
  };
};




export const useGetAllTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskList"],
    queryFn: async () => {
      const taskDetail = await queryService?.getTaskManagementData()
      return taskDetail;
    },
  });
};