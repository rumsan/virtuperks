import { useGetAllUsers } from "@/hooks/subgraph/participant";
import { UserLookup } from "@/type/participantLookup.type";

export const useParticipantLookup = () => {
  const {
    data: allUsers = [],
    isLoading,
    isError,
  } = useGetAllUsers() as {
    data: UserLookup[];
    isLoading: boolean;
    isError: boolean;
  };

  return {
    isLoading,
    isError,
    lookupByWallet: (wallet: string): string => {
      if (!wallet) return "Unnamed Participant";
      const user = allUsers.find(
        (u) => u.wallet?.toLowerCase() === wallet?.toLowerCase(),
      );
      return user?.details?.name || "Unnamed Participant";
    },
  };
};
