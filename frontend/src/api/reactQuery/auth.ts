import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import ENDPOINTS from "../endpoints";

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
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (sendData: { email: string; password: string }) => {
      const response = await axiosInstance.post(ENDPOINTS.REGISTER, sendData);
      return response.data;
    },
  });
};
