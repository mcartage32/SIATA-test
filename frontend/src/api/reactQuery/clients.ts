import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";
import type {
  ApiError,
  IClient,
  ICreateClientPayload,
  IPaginatedResponse,
  IPaginationParams,
  ISelectOption,
  IUpdateClientPayload,
} from "@/interfaces";
import type { AxiosError } from "axios";

export const useClientsListQuery = (params?: IPaginationParams) => {
  return useQuery({
    queryKey: ["clientsList", params],
    queryFn: async (): Promise<IPaginatedResponse<IClient>> => {
      const response = await axiosInstance.get<IPaginatedResponse<IClient>>(
        ENDPOINTS.CLIENTS_LIST,
        {
          params,
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useClientsSelectOptionsQuery = () => {
  return useQuery({
    queryKey: ["clientsSelectOptions"],
    queryFn: async (): Promise<ISelectOption[]> => {
      const response = await axiosInstance.get<ISelectOption[]>(
        ENDPOINTS.CLIENTS_SELECT_OPTIONS,
      );
      return response.data;
    },
  });
};

export const useClientDetailQuery = (maskuuid?: string) => {
  return useQuery({
    queryKey: ["clientDetail", maskuuid],
    queryFn: async (): Promise<IClient> => {
      const response = await axiosInstance.get<IClient>(
        ENDPOINTS.CLIENTS_ID(maskuuid!),
      );
      return response.data;
    },
    enabled: !!maskuuid,
  });
};

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiError>, ICreateClientPayload>({
    mutationFn: async (payload: ICreateClientPayload) => {
      const response = await axiosInstance.post(
        ENDPOINTS.CLIENTS_LIST,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientsSelectOptions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["clientsList"],
        exact: false,
      });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    { maskuuid: string; payload: IUpdateClientPayload }
  >({
    mutationFn: async ({
      maskuuid,
      payload,
    }: {
      maskuuid: string;
      payload: IUpdateClientPayload;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.CLIENTS_ID(maskuuid),
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsList"] });
      queryClient.invalidateQueries({ queryKey: ["clientsSelectOptions"] });
      queryClient.invalidateQueries({ queryKey: ["clientDetail"] });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiError>, string>({
    mutationFn: async (maskuuid: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.CLIENTS_ID(maskuuid),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientsSelectOptions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["clientsList"],
        exact: false,
      });
    },
  });
};
