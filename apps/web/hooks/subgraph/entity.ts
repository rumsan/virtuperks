import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReadRewardManagementFactoryGetEntityOwners,
  useReadRewardManagementGetTotalUnallocatedTokens,
  useReadRewardManagementTotalAllocatedTokens,
  useWriteRewardManagementFactoryCreateRewardManagement,
  useWriteRewardTokenMint,
} from "../wagmi/contracts";
import { createId } from "@paralleldrive/cuid2";
import { keccak256 } from "viem";
import { toUtf8Bytes } from "ethers";


export const useGetAllEntity = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["entityList"],
    queryFn: async () => {
      const taskDetail = await queryService?.getDeployments()
      return taskDetail;
    },
  });
};

export const useDepartmentAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } =
    useWriteRewardManagementFactoryCreateRewardManagement();

  const appId = process.env.NEXT_PUBLIC_APP_ID as `0x${string}` || "0x";



  const mutation = useMutation({
    mutationFn: async (data: any) => {
         const cuid = createId()
            const entityId = keccak256(toUtf8Bytes(cuid))
      const result = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        args: [
          entityId as `0x${string}`,
          appId,
          
          process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
          {name:data.name as string, entityOwners: data.entityOwners as readonly `0x${string}`[]},
        ],
      });
      return result;
    },
    onSuccess: (result, variable) => {},
  });
  return {
    departmentAdd: mutation.mutateAsync,
    departmentPending: mutation.isPending,
    departmentSuccess: mutation.isSuccess,
  };
};

export const useGetEntityById = (rewardManagement: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["entityByRewardManagement", rewardManagement],
    enabled: !!rewardManagement && !!queryService,
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }

      const result =
        await queryService.getRewardManagementCreatedByAddress(
          rewardManagement,
        );

   

      const entity = result?.data?.rewardManagementCreateds?.[0];

      if (!entity) {
        throw new Error("Entity not found in subgraph response.");
      }

      return entity;
    },
  });
};

// Mint tokens
export const useRewardTokenMint = () => {
  const { writeContractAsync } = useWriteRewardTokenMint();

  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;

  const mutation = useMutation({
    mutationFn: async ({
      address,
      amount,
    }: {
      address: string;
      amount: number;
    }) => {
      const result = await writeContractAsync({
        address: tokenAddress,
        args: [address as `0x${string}`, BigInt(amount)],
      });
      return result;
    },
  });

  return {
    tokenMint: mutation.mutateAsync,
    mintPending: mutation.isPending,
    mintSuccess: mutation.isSuccess,
    mintError: mutation.isError,
  };
};


export const useCheckTotalUnallocatedTokens = (entityId:string) => {
  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;
  
  const {
    data,
    isError,
    isLoading,
  } = useReadRewardManagementGetTotalUnallocatedTokens({
    address: entityId as `0x${string}`,
    args: [tokenAddress],
  });
 

  return {
    unallocatedTokens:data,
    isError,
    statusLoading: isLoading,
  };
};



export const useCheckTotalAllocatedTokens= (entityId:string) => {
  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;
  
  const {
    data,
    isError,
    isLoading,
  } = useReadRewardManagementTotalAllocatedTokens({
    address: entityId as `0x${string}`,
    args: [tokenAddress],
  });
 

  return {
     totalAllocatedTokens:data,
    isError,
    statusLoading: isLoading,
  };
};



export const useGetEntityOwners= (entityId:string) => {
  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`;

  
  const {
    data,
    isError,
    isLoading,
  } = useReadRewardManagementFactoryGetEntityOwners({
    address: factoryAddress as `0x${string}`,
    args: [entityId as `0x${string}`],
  });
 

  return {
     getEntityOwners:data,
    isError,
    statusLoading: isLoading,
  };
};


