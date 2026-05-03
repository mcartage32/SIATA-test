import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";
import type {
  IPort,
  ICreatePortPayload,
  IUpdatePortPayload,
  IPaginatedResponse,
  IPaginationParams,
  ISelectOption,
} from "@/interfaces";

export const usePortsListQuery = (params?: IPaginationParams) => {
  return useQuery({
    queryKey: ["portsList", params],
    queryFn: async (): Promise<IPaginatedResponse<IPort>> => {
      const response = await axiosInstance.get<IPaginatedResponse<IPort>>(
        ENDPOINTS.PORTS_LIST,
        { params },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const usePortsSelectOptionsQuery = () => {
  return useQuery({
    queryKey: ["portsSelectOptions"],
    queryFn: async (): Promise<ISelectOption[]> => {
      const response = await axiosInstance.get<ISelectOption[]>(
        ENDPOINTS.PORTS_SELECT_OPTIONS,
      );
      return response.data;
    },
  });
};

export const usePortDetailQuery = (maskuuid: string) => {
  return useQuery({
    queryKey: ["portDetail", maskuuid],
    queryFn: async (): Promise<IPort> => {
      const response = await axiosInstance.get<IPort>(
        ENDPOINTS.PORTS_ID(maskuuid),
      );
      return response.data;
    },
    enabled: !!maskuuid,
  });
};

export const useCreatePortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreatePortPayload) => {
      const response = await axiosInstance.post(ENDPOINTS.PORTS_LIST, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portsList"] });
      queryClient.invalidateQueries({ queryKey: ["portsSelectOptions"] });
    },
  });
};

export const useUpdatePortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maskuuid,
      payload,
    }: {
      maskuuid: string;
      payload: IUpdatePortPayload;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.PORTS_ID(maskuuid),
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portsList"] });
      queryClient.invalidateQueries({ queryKey: ["portsSelectOptions"] });
      queryClient.invalidateQueries({ queryKey: ["portDetail"] });
    },
  });
};

export const useDeletePortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maskuuid: string) => {
      const response = await axiosInstance.delete(ENDPOINTS.PORTS_ID(maskuuid));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portsList"] });
      queryClient.invalidateQueries({ queryKey: ["portsSelectOptions"] });
    },
  });
};
