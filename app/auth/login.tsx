import { useTheme } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { login } = useAuthStore((state) => state);
  const theme = useTheme();

  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    if (!phone) return alert("Ingresa tu teléfono");

    login({
      name: "Usuario",
      phone,
      role: "delivery",
    });
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
      >
        <Text style={styles.buttonText}>Entrar</Text>
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
