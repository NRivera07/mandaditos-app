import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

type LocationCoords = {
  latitude: number;
  longitude: number;
};

export default function Map() {
  const [location, setLocation] = useState<LocationCoords | undefined>(
    undefined,
  );

  const [modalVisible, setModalVisible] = useState(false);

  const [mandado, setMandado] = useState("");

  const handleMapPress = (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;

    setLocation(coords);
    setModalVisible(true);
  };

  const handleCreateOrder = () => {
    console.log({
      mandado,
      location: location,
    });

    setMandado("");
    handleCloseModal();
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

  const handleCloseModal = () => {
    setModalVisible(false);
    setMandado("");
  };

  if (!location) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={location} />
      </MapView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.title}>Nuevo mandado</Text>

                <TextInput
                  placeholder="¿Qué necesitas? Agrega la información que quieras que el mandadito sepa."
                  placeholderTextColor="#9CA3AF"
                  value={mandado}
                  onChangeText={setMandado}
                  style={styles.input}
                  multiline
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateOrder}
                >
                  <Text style={styles.buttonText}>Crear mandado</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={styles.cancel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#65C22A",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#001F2D",
    fontWeight: "700",
    fontSize: 16,
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
  },
});
