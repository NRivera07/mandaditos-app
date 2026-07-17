import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const queryClient = new QueryClient();

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (user.role === "delivery") {
      router.replace("/(tabs)/(delivery)/map");
    } else {
      router.replace("/(tabs)/(customer)/map");
    }
  }, [user, isReady]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
      <Toast />
    </>
  );
}
