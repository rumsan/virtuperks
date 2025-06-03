import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWriteRewardManagementFactoryCreateRewardManagement } from "../wagmi/contracts";

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
  const { writeContractAsync } =
    useWriteRewardManagementFactoryCreateRewardManagement();

  const appId = (process.env.NEXT_PUBLIC_APP_ID as `0x${string}`) || "0x";

  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const result = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        args: [
          appId,
          name,
          process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
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

export const useGetEntityById = (id: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ["entity", id],
    enabled: !!id && !!queryService,
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const result = await queryService.getRewardManagementCreatedById(id);
      return result.data?.rewardManagementCreated;
    },
  });
};
