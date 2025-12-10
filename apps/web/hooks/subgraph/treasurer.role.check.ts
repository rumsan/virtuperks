import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";

export const useGetTreasurerWallets = (
  treasurerRole: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  const query = useQuery<string[]>({
    queryKey: ["treasurerWallets", treasurerRole],
    queryFn: async (): Promise<string[]> => {
      if (!queryService) return [];

      const { data, error } =
        await queryService.getWalletsByRole(treasurerRole);

      if (error || !data) return [];

      return data?.roleAdminGranteds;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!treasurerRole && !skip,
  });

  return query;
};
