import { useOrdersStore } from "@/store/useOrdersStore";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Orders() {
  const orders = useOrdersStore((state) => state.mandados);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "farmacia":
        return "💊";
      case "banco":
        return "💰";
      default:
        return "📦";
    }
  };

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return { color: "#F59E0B" };
      case "En curso":
        return { color: "#22C55E" };
      case "Completado":
        return { color: "#6B7280" };
      default:
        return { color: "#000" };
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon(item.tipo)}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={[styles.estado, getEstadoStyle(item.estado)]}>
          {item.estado}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis pedidos</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111827",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  estado: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
});
