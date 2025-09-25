import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const createOfframp = async (payload: any) => {
  const res = await api.post("/offramp-request", payload);
  return res.data;
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
