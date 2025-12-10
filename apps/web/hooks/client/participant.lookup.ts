import { participantLookupClient } from "@/utils/participant.lookup.api";
import { useQuery } from "@tanstack/react-query";
import { useGetTreasurerWallets } from "../subgraph/treasurer.role.check";

export const useParticipantLookup = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["participantLookupAll"],
    queryFn: async () => {
      const response = await participantLookupClient.get("/");
      return response.data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export const useSelectParticipantLookUp = () => {
  const {
    data,
    isError,
    isLoading: participantLoading,
  } = useParticipantLookup();
  const treasurerRole = process.env.NEXT_PUBLIC_MINTER_ROLE!;
  const { data: treasurerWallets, isLoading: treasurerWalletsLoading } =
    useGetTreasurerWallets(treasurerRole);

  const mappedTreasurers =
    treasurerWallets?.map((wallet: any) => {
      //for fall back
      if (isError || !data?.data) {
        return {
          wallet: wallet.account,
          label: wallet.account,
        };
      }

      const participant = data.data.find(
        (item: any) =>
          item.address?.toLowerCase() === wallet.account.toLowerCase(),
      );

      return {
        wallet: wallet.account,
        label: participant ? participant.name : wallet.account,
      };
    }) || [];

  return {
    name: data?.data || [],
    mappedTreasurers,
    isLoading: treasurerWalletsLoading || participantLoading,
    hasParticipantError: isError,
    lookupByCuid: (address: string) =>
      data ? data?.data?.find((item: any) => item.address === address) : null,
  };
};
