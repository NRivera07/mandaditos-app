import { db } from "@/firebase";
import { useTheme } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/store/useAuthStore";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  id: string;
  name: string;
  phone: string;
  role: "delivery" | "customer";
  status?: string;
  rating?: number;
};

export default function Login() {
  const { login } = useAuthStore((state) => state);
  const theme = useTheme();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!phone) return alert("Ingresa tu teléfono");

    setLoading(true);
    try {
      const userRef = doc(db, "users", phone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLoading(false);
        return alert("Usuario no encontrado");
      }

      const data = userSnap.data();

      const userData: User = {
        id: phone,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: data.status,
        rating: data.rating,
      };

      login(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>¡Ingrese su número telefónico!</Text>

      <TextInput
        placeholder="Teléfono"
        placeholderTextColor="#9CA3AF"
        value={phone}
        onChangeText={(text) => {
          const onlyNumbers = text.replace(/[^0-9]/g, "");
          setPhone(onlyNumbers);
        }}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={8}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#FFFFFF",
    color: "#FFFFFF",
  },

  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
    fontSize: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});
