import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useWriteRewardManagementCreateTask } from "../wagmi/contracts";



export const useTaskAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } =
      useWriteRewardManagementCreateTask();
    const { address, isConnected } = useAccount();
    console.log(address, 'in the useTaskAdd hook');
    console.log(isConnected, 'in the useTaskAdd hook');
      
 

 
    
  const mutation = useMutation({
      mutationFn: async (data: any) => {
          console.log(data, 'in the useTaskAdd hoook')
      const verifiedParticipants = data.verifiedParticipants || [];
        const entityAddress = "0x44703d020aab00fe7ea50178a81a665409edef5c"
   
      const result = await writeContractAsync({
        address: entityAddress as `0x${string}`,
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
