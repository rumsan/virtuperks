import { participantLookupClient } from "@/utils/participant.lookup.api";
import { useQuery } from "@tanstack/react-query";

export const useParticipantLookup = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["participantLookupAll"],
    queryFn: async () => {
      const response = await participantLookupClient.get("/");
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
