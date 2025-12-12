import { participantLookupClient } from "@/utils/participant.lookup.api";
import { useQuery } from "@tanstack/react-query";
import { useGetEntityOwners } from "../subgraph/entity";
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

export const useSelectParticipantLookUp = (entityId?: string) => {
  const {
    data,
    isError,
    isLoading: participantLoading,
  } = useParticipantLookup();
  const treasurerRole = process.env.NEXT_PUBLIC_MINTER_ROLE!;
  const { data: treasurerWallets, isLoading: treasurerWalletsLoading } =
    useGetTreasurerWallets(treasurerRole);
  const { getEntityOwners, statusLoading: ownersLoading } = useGetEntityOwners(
    entityId || "",
  );

  const mappedEntityOwners =
    getEntityOwners?.map((wallet: any) => {
      if (isError || !data?.data) {
        return {
          wallet: wallet,
          label: wallet,
        };
      }
      const entityOwner = data.data.find(
        (item: any) => item.address?.toLowerCase() === wallet.toLowerCase(),
      );

      return {
        wallet: wallet,
        label: entityOwner ? entityOwner.name : wallet.account,
      };
    }) || [];

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
    mappedEntityOwners,
    isLoading: treasurerWalletsLoading || participantLoading,
    hasParticipantError: isError,
    lookupByCuid: (address: string) =>
      data
        ? data?.data?.find(
            (item: any) =>
              item.address?.toLowerCase() === address?.toLowerCase()
          )
        : null,    
  };
};
