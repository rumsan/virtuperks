import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
interface OfframpPayload {
  tokenAmount: number;
  paymentProviderId: string;
  transactionHash: string;
  senderAddress: string;
  paymentDetails: any;
}

const createOfframp = async (payload: OfframpPayload) => {
  const res = await api.post("/offramp-request", payload);
  return res.data;
};
const executeOfframp = async (payload: OfframpPayload) => {
  const res = await api.post(`/offramp-request/instant`, payload);
  return res.data;
};

export const useExecuteOfframpMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: OfframpPayload) => executeOfframp(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offramp"] });
    },
  });
};

export const useOfframpCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createOfframp(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offramp"] });
    },
  });
};

interface OfframpParams {
  page?: number;
  limit?: number;
}

export const useGetOfframp = (params?: OfframpParams) => {
  return useQuery({
    queryKey: ["offramp", params],
    queryFn: () =>
      api
        .get("/offramp-request", {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
          },
        })
        .then((res) => res.data),
  });
};

export const useUpdateOfframp = (
  cuid: string,
  { status }: { status: string },
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (status) =>
      api.put(`/offramp-request/${cuid}`, { status }).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offramp"] });
    },
  });
};
