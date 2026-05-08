import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";
import type { AxiosError } from "axios";
import type { ApiError } from "@/interfaces";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (sendData: { email: string; password: string }) => {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, sendData);
      return response.data;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation<
    unknown,
    AxiosError<ApiError>,
    { email: string; password: string }
  >({
    mutationKey: ["register"],
    mutationFn: async (sendData: { email: string; password: string }) => {
      const response = await axiosInstance.post(ENDPOINTS.REGISTER, sendData);

      return response.data;
    },
  });
};
