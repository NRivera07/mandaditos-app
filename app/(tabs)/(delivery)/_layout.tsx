import { useTheme } from "@/hooks/use-theme-color";
import { Header } from "@/src/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const pathname = usePathname();
  const theme = useTheme();

  const hiddenRoutes = ["profile"];

  const showHeader = !hiddenRoutes.some((route) => pathname.includes(route));

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.background }}
      >
        {showHeader && <Header />}
      </SafeAreaView>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.primary,
          tabBarStyle: {
            height: 65,
            borderTopWidth: 1,
          },
        }}
      >
        <Tabs.Screen
          name="orders"
          options={{
            title: "Mis entregas",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Mapa",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
