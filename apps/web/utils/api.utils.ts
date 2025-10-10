import { useRumsanAppStore } from "@rumsan/ui/stores/app.store";
import { QueryClient } from "@tanstack/react-query";
import { ApiClient } from "@workspace/sdk/clients";
//import { AppEventManager } from "../event.manger";

const fallbackQueryClient = new QueryClient();
export function useRemoteClient() {
  const { accessToken, appId, clientId } = useRumsanAppStore();

  return {
    apiClient: new ApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     "rs-app-id": appId,
      //     "rs-client-id": clientId,
      //   },
    }),
    queryClient: fallbackQueryClient,
  };
}
