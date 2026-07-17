import { createOrder } from "@/src/services/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      Toast.show({
        type: "success",
        text1: "Mandado creado correctamente",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "¡Ups! No se pudo crear el mandado",
      });
    },
  });
};
