import { useGraphService } from "@/providers/subgraph-provider";
import { createId } from "@paralleldrive/cuid2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toUtf8Bytes } from "ethers";
import { keccak256 } from "viem";
import {
  useReadRewardManagementFactoryGetEntityOwners,
  useReadRewardManagementGetTotalUnallocatedTokens,
  useReadRewardManagementOwner,
  useReadRewardManagementTotalAllocatedTokens,
  useWriteRewardManagementFactoryCreateRewardManagement,
} from "../wagmi/contracts";

export const useGetAllEntity = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["entityList"],
    queryFn: async () => {
      const taskDetail = await queryService?.getDeployments();
      return taskDetail;
    },
  });
};

export const useDepartmentAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementFactoryCreateRewardManagement();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      entityOwners: readonly `0x${string}`[];
    }) => {
      const cuid = createId();
      const entityId = keccak256(toUtf8Bytes(cuid));
      const result = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        args: [
          entityId as `0x${string}`,
          process.env.NEXT_PUBLIC_APP_ID as `0x${string}`,
          process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
          {
            name: data.name,
            entityOwners: data.entityOwners,
          },
        ],
      });
      return { result };
    },

    onSuccess: async (resultObj) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["entityList"],
      });
    },
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

export const useCheckTotalUnallocatedTokens = (entityId: string) => {
  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;

  const { data, isError, isLoading } =
    useReadRewardManagementGetTotalUnallocatedTokens({
      address: entityId as `0x${string}`,
      args: [tokenAddress],
    });

  return {
    unallocatedTokens: data,
    isError,
    statusLoading: isLoading,
  };
};

export const useCheckTotalAllocatedTokens = (entityId: string) => {
  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;

  const { data, isError, isLoading } =
    useReadRewardManagementTotalAllocatedTokens({
      address: entityId as `0x${string}`,
      args: [tokenAddress],
    });

  return {
    totalAllocatedTokens: data,
    isError,
    statusLoading: isLoading,
  };
};

export const useGetEntityOwners = (entityId: string) => {
  const factoryAddress = process.env
    .NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`;

  const { data, isError, isLoading } =
    useReadRewardManagementFactoryGetEntityOwners({
      address: factoryAddress as `0x${string}`,
      args: [entityId as `0x${string}`],
    });

  return {
    getEntityOwners: data,
    isError,
    statusLoading: isLoading,
  };
};

export const useGetOwner = (entityId: string) => {
  const { data, isError, isLoading } = useReadRewardManagementOwner({
    address: entityId as `0x${string}`,
    args: [],
  });

  return {
    getEntityOwnerRole: data,
    isError,
    statusLoading: isLoading,
  };
};

export const usegetEntityOwner = (entityId: string) => {
  const { data, isError, isLoading } = useReadRewardManagementOwner({
    address: entityId as `0x${string}`,
    args: [],
  });

  return {
    getEntityOwnerRole: data,
    isError,
    roleLoading: isLoading,
  };
};

export const useGetEntityRole = (entityId: string) => {
  const { data, isError, isLoading } = useReadRewardManagementOwner({
    address: entityId as `0x${string}`,
    args: [],
  });

  return {
    entityRole: data,
    isError,
    roleLoading: isLoading,
  };
};

export const useFindEntityOwner = (ownerAddress: string) => {
  const { queryService } = useGraphService();
  const queryClient = useQueryClient();
  const cachedEntityOwner = queryClient.getQueryData<any>([
    "entityOwnerCheck",
    ownerAddress,
  ]);

  const query = useQuery({
    queryKey: ["entityOwnerCheck", ownerAddress],
    enabled:
      !!ownerAddress &&
      ownerAddress !== "0x" &&
      ownerAddress !== "" &&
      !!queryService,
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }

      const result = await queryService.getEntityOwnerByUserAddress(
        ownerAddress as `0x${string}`,
      );

      return result;
    },
    initialData: cachedEntityOwner,

    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
  return query;
};
