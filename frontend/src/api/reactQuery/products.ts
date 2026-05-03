import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";
import type {
  IProduct,
  ICreateProductPayload,
  IUpdateProductPayload,
  IPaginatedResponse,
  IPaginationParams,
  ISelectOption,
} from "@/interfaces";

export const useProductsListQuery = (params?: IPaginationParams) => {
  return useQuery({
    queryKey: ["productsList", params],
    queryFn: async (): Promise<IPaginatedResponse<IProduct>> => {
      const response = await axiosInstance.get<IPaginatedResponse<IProduct>>(
        ENDPOINTS.PRODUCTS_LIST,
        {
          params,
        },
      );

      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProductsSelectOptionsQuery = () => {
  return useQuery({
    queryKey: ["productsSelectOptions"],
    queryFn: async (): Promise<ISelectOption[]> => {
      const response = await axiosInstance.get<ISelectOption[]>(
        ENDPOINTS.PRODUCTS_SELECT_OPTIONS,
      );
      return response.data;
    },
  });
};

export const useProductDetailQuery = (maskuuid?: string) => {
  return useQuery({
    queryKey: ["productDetail", maskuuid],
    queryFn: async (): Promise<IProduct> => {
      const response = await axiosInstance.get<IProduct>(
        ENDPOINTS.PRODUCTS_ID(maskuuid!),
      );
      return response.data;
    },
    enabled: !!maskuuid,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateProductPayload) => {
      const response = await axiosInstance.post(
        ENDPOINTS.PRODUCTS_LIST,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
      queryClient.invalidateQueries({ queryKey: ["productsSelectOptions"] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maskuuid,
      payload,
    }: {
      maskuuid: string;
      payload: IUpdateProductPayload;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.PRODUCTS_ID(maskuuid),
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
      queryClient.invalidateQueries({ queryKey: ["productsSelectOptions"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maskuuid: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.PRODUCTS_ID(maskuuid),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
      queryClient.invalidateQueries({ queryKey: ["productsSelectOptions"] });
    },
  });
};
