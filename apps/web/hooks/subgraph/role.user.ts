import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWriteAppRegistryGrantRoleAdmin, useWriteAppRegistryRevokeRoleAdmin } from "../wagmi/contracts";

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteAppRegistryGrantRoleAdmin();

  const mutation = useMutation({
    mutationFn: async (data: {
      role: `0x${string}`;
      appId: `0x${string}`;
      wallet: `0x${string}`;
    }) => {
      console.log("Assigning Role:", data);
      const txHash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
        args: [data.appId, data.role, data.wallet],
      });
      return { txHash };
    },
    onSuccess: async () => {
      // wait for block confirmation
      await new Promise((r) => setTimeout(r, 8000));
      queryClient.invalidateQueries({
        queryKey: ["treasurerWallets"],
      });
    },

    onError: (error) => {
      console.error("Error assigning role:", error);
    },
  });

  return {
    assignRole: mutation.mutateAsync,
    assignRolePending: mutation.isPending,
    assignRoleSuccess: mutation.isSuccess,
  };
};





export const useRevokeRole = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteAppRegistryRevokeRoleAdmin();

  const mutation = useMutation({
    mutationFn: async (data: {
      role: `0x${string}`;
      appId: `0x${string}`;
      wallet: `0x${string}`;
    }) => {
      console.log("Revoking Role:", data);

      const txHash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
        args: [data.appId, data.role, data.wallet],
      });

      return { txHash };
    },

    onSuccess: async () => {
      // wait for block confirmation
      await new Promise((r) => setTimeout(r, 8000));

      queryClient.invalidateQueries({
        queryKey: ["treasurerWallets"], // or other relevant queries
      });
    },

    onError: (error) => {
      console.error("Error revoking role:", error);
    },
  });

  return {
    revokeRole: mutation.mutateAsync,
    revokeRolePending: mutation.isPending,
    revokeRoleSuccess: mutation.isSuccess,
  };
};
