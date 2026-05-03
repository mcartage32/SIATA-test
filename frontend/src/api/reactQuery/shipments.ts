import type {
  IShipment,
  IPaginatedResponse,
  IPaginationParams,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
} from "@/interfaces";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";

export const useShipmentsListQuery = (params?: IPaginationParams) => {
  return useQuery({
    queryKey: ["shipmentsList", params],
    queryFn: async (): Promise<IPaginatedResponse<IShipment>> => {
      const response = await axiosInstance.get<IPaginatedResponse<IShipment>>(
        ENDPOINTS.SHIPMENTS_LIST,
        {
          params,
        },
      );

      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateShipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateShipmentPayload) => {
      const response = await axiosInstance.post("/shipments", payload);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipmentsList"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["shipmentsSelectOptions"],
        exact: false,
      });
    },
  });
};

export const useShipmentDetailQuery = (maskuuid: string) => {
  return useQuery({
    queryKey: ["shipmentDetail", maskuuid],
    queryFn: async (): Promise<IShipment> => {
      const response = await axiosInstance.get<IShipment>(
        ENDPOINTS.SHIPMENTS_ID(maskuuid),
      );
      return response.data;
    },
    enabled: !!maskuuid,
  });
};

export const useDeleteShipmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (maskuuid: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.SHIPMENTS_ID(maskuuid),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipmentsList"],
        exact: false,
      });
    },
  });
};

export const useUpdateShipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maskuuid,
      payload,
    }: {
      maskuuid: string;
      payload: IUpdateShipmentPayload;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.SHIPMENTS_ID(maskuuid),
        payload,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipmentsList"] });
      queryClient.invalidateQueries({ queryKey: ["shipmentDetail"] });
    },
  });
};
