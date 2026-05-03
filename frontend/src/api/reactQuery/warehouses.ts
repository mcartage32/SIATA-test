import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";

import type {
  IWarehouse,
  ICreateWarehousePayload,
  IUpdateWarehousePayload,
  IPaginatedResponse,
  IPaginationParams,
  ISelectOption,
} from "@/interfaces";

export const useWarehousesListQuery = (params?: IPaginationParams) => {
  return useQuery({
    queryKey: ["warehousesList", params],
    queryFn: async (): Promise<IPaginatedResponse<IWarehouse>> => {
      const response = await axiosInstance.get<IPaginatedResponse<IWarehouse>>(
        ENDPOINTS.WAREHOUSES_LIST,
        {
          params,
        },
      );

      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useWarehousesSelectOptionsQuery = () => {
  return useQuery({
    queryKey: ["warehousesSelectOptions"],
    queryFn: async (): Promise<ISelectOption[]> => {
      const response = await axiosInstance.get<ISelectOption[]>(
        ENDPOINTS.WAREHOUSES_SELECT_OPTIONS,
      );

      return response.data;
    },
  });
};

export const useWarehouseDetailQuery = (maskuuid: string) => {
  return useQuery({
    queryKey: ["warehouseDetail", maskuuid],
    queryFn: async (): Promise<IWarehouse> => {
      const response = await axiosInstance.get<IWarehouse>(
        ENDPOINTS.WAREHOUSES_ID(maskuuid),
      );

      return response.data;
    },
    enabled: !!maskuuid,
  });
};

export const useCreateWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateWarehousePayload) => {
      const response = await axiosInstance.post(
        ENDPOINTS.WAREHOUSES_LIST,
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehousesList"] });
      queryClient.invalidateQueries({
        queryKey: ["warehousesSelectOptions"],
      });
    },
  });
};

export const useUpdateWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maskuuid,
      payload,
    }: {
      maskuuid: string;
      payload: IUpdateWarehousePayload;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.WAREHOUSES_ID(maskuuid),
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehousesList"] });
      queryClient.invalidateQueries({
        queryKey: ["warehousesSelectOptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouseDetail"],
      });
    },
  });
};

export const useDeleteWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maskuuid: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.WAREHOUSES_ID(maskuuid),
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehousesList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehousesSelectOptions"],
      });
    },
  });
};
