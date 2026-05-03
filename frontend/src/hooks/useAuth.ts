/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTE } from "@/constants/routes";
import { useLoginMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: loginMutation, error, isPending } = useLoginMutation();

  // Mutación para el login
  const handleLogin = (data: { email: string; password: string }) => {
    loginMutation(data, {
      onSuccess: (response) => {
        const token = response.access_token;
        sessionStorage.setItem("access_token", token);
        navigate(PRIVATE_ROUTE.HOME, { replace: true });
      },
      onError: (_error) => {
        createNotification.error({
          title: "Error de autenticación",
          description:
            "Email o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        });
      },
    });
  };

  // Función de login
  const login = (credentials: { email: string; password: string }) => {
    handleLogin(credentials);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  // Función de logout
  const logout = () => {
    handleLogout();
  };

  // Verificar autenticación
  const isAuthenticated = () => {
    return !!sessionStorage.getItem("access_token");
  };

  return {
    login,
    logout,
    isAuthenticated,
    isLoading: isPending,
    error: error,
  };
};
