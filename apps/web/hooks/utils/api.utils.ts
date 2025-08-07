import { QueryClient } from "@tanstack/react-query";
import { ApiClient } from "@workspace/sdk/client";

const fallbackQueryClient = new QueryClient();

export function useRemoteClient() {
  const apiClient = new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  return {
    userClient: apiClient.Participants,
    queryClient: fallbackQueryClient,
  };
}
