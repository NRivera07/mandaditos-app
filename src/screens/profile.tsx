import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const usuario = {
    name: "Juan Pérez",
    phone: "5888-8888",
    image: "https://i.pravatar.cc/150?img=3",
    status: "Disponible",
    rating: 4.2,
    reviews: 24,
  };

  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: 16 }}>
          {i <= Math.round(rating) ? "⭐" : "☆"}
        </Text>,
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: usuario.image }} style={styles.avatar} />

      <Text style={styles.nombre}>{usuario.name}</Text>
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{renderStars(usuario.rating)}</View>
        <Text style={styles.ratingText}>
          {usuario.rating} ({usuario.reviews})
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.dot} />
        <Text style={styles.status}>{usuario.status}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{usuario.phone}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 3,
  },
  button: {
    width: "100%",
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  logout: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  stars: {
    flexDirection: "row",
    marginRight: 6,
  },

  ratingText: {
    fontSize: 13,
    color: "#6B7280",
  },
});
