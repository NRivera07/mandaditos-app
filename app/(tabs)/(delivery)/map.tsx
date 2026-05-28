import { useOrdersStore } from "@/store/useOrdersStore";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

type LocationCoords = {
  latitude: number;
  longitude: number;
};
export default function Map() {
  const { orders, aceptarMandado } = useOrdersStore();
  const [location, setLocation] = useState<LocationCoords | undefined>(
    undefined,
  );
  const [selectedMandado, setSelectedMandado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getMandadoStyle = (tipo: string) => {
    switch (tipo) {
      case "farmacia":
        return { icon: "💊", color: "#4CAF50" };
      case "banco":
        return { icon: "💰", color: "#2196F3" };
      default:
        return { icon: "📦", color: "#000" };
    }
  };

  const openWhatsApp = (phone: string) => {
    const url = `https://wa.me/+505${phone}`;
    Linking.openURL(url);
  };

  const callPhone = (phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url);
  };

  const viewRoute = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación denegado");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Obteniendo ubicación...</Text>
      </View>
    );
  }

  const cerrarModal = () => {
    setModalVisible(false);
    setSelectedMandado(null);
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {orders
          .filter((m) => m.status === "Pendiente")
          .map((m) => (
            <Marker
              key={m.id}
              coordinate={{
                latitude: m.lat,
                longitude: m.lng,
              }}
              onPress={() => {
                setSelectedMandado(m);
                setModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor:
                      selectedMandado?.id === m.id
                        ? "#000"
                        : getMandadoStyle(m.tipo).color,
                  },
                ]}
              >
                <Text style={styles.markerText}>
                  {getMandadoStyle(m.tipo).icon}
                </Text>
              </View>
            </Marker>
          ))}
      </MapView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={cerrarModal} />

          <View style={styles.modalContent}>
            <Text style={styles.title}>📝 Detalle del mandado</Text>

            <Text style={{ fontWeight: "500" }}>
              📌 {selectedMandado?.description}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text>👤 Cliente: {selectedMandado?.customerName}</Text>
              <Text>📞 Teléfono: {selectedMandado?.phone}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 15, gap: 10 }}>
              <TouchableOpacity
                style={[styles.whatsappButton, { flex: 1 }]}
                onPress={() => {
                  if (!selectedMandado?.phone) return;
                  openWhatsApp(selectedMandado.phone);
                }}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.callButton, { flex: 1 }]}
                onPress={() => {
                  if (!selectedMandado?.phone) return;
                  callPhone(selectedMandado.phone);
                }}
              >
                <Ionicons name="call" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.routeButton, { flex: 1 }]}
                onPress={() => {
                  if (!selectedMandado?.lat || !selectedMandado?.lng) return;
                  viewRoute(selectedMandado.lat, selectedMandado.lng);
                }}
              >
                <Ionicons name="navigate" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.accept}
                onPress={() => {
                  if (!selectedMandado) return;
                  aceptarMandado(selectedMandado.id);
                  cerrarModal();
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Aceptar mandado
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reject: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  actions: {
    marginTop: 20,
  },
  accept: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerText: {
    fontSize: 18,
  },

  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
});
