import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTreasurerWallets = (
  treasurerRole: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();
  const queryClient = useQueryClient();

  const query = useQuery<string[]>({
    queryKey: ["treasurerWallets", treasurerRole],
    queryFn: async (): Promise<string[]> => {
      if (!queryService) return [];

      const { data, error } = await queryService.getWalletsByRole(treasurerRole);
      console.log("Data: --", data);
      if (error || !data) return [];

      // Extract wallet addresses
      const wallets = data.roleAdminGranteds?.map((r: any) => r.account) ?? [];

      // Ensure uniqueness
      return Array.from(new Set(wallets));
    },
    enabled: !!treasurerRole && !skip,
  });

  return query;
};

  
  
  