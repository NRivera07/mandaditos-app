import { useAuthStore } from "@/store/useAuthStore";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // pequeño delay para asegurar hidratación
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (user.role === "delivery") {
      router.replace("/(tabs)/(delivery)/map");
    } else {
      router.replace("/(tabs)/(customer)/home");
    }
  }, [user, isReady]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
