import { useTheme } from "@/hooks/use-theme-color";
import { useCategories } from "@/src/hooks/useCategories";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

type LocationCoords = {
  latitude: number;
  longitude: number;
};

export default function Map() {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);
  const placesRef = useRef<any>(null);
  const [searchText, setSearchText] = useState("");
  const [placesKey, setPlacesKey] = useState(0);
  const [markerKey, setMarkerKey] = useState(0);

  const [location, setLocation] = useState<LocationCoords | undefined>(
    undefined,
  );
  const { data: categories = [], isLoading } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [mandado, setMandado] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { width } = Dimensions.get("window");

  const handleMapPress = (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;

    setLocation(coords);
    setModalVisible(true);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const handleCreateOrder = () => {
    if (!selectedCategory) {
      return showError("Debes seleccionar una categoría.");
    }

    if (!mandado.trim()) {
      return showError("Debes agregar una descripción del mandado.");
    }

    if (mandado.trim().length < 10) {
      return showError("La descripción debe tener al menos 10 caracteres.");
    }

    console.log({
      categoryId: selectedCategory,
      description: mandado,
      location,
    });

    handleCloseModal();
  };

  useEffect(() => {
    if (errorModalVisible) {
      const timer = setTimeout(() => {
        setErrorModalVisible(false);
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorModalVisible]);

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
    setSelectedCategory("");
    setMarkerKey((k) => k + 1);
  };

  if (!location) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <Marker key={markerKey} coordinate={location} />
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          key={placesKey}
          ref={placesRef}
          placeholder="Buscar dirección..."
          fetchDetails={true}
          enablePoweredByContainer={false}
          minLength={2}
          debounce={300}
          renderRow={(rowData) => (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                width: width - 70,
                fontSize: 14,
                color: "#0C2333",
              }}
            >
              {rowData.description}
            </Text>
          )}
          textInputProps={{
            value: searchText,
            onChangeText: setSearchText,
            placeholderTextColor: "#94A3B8",
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
            language: "es",
          }}
          onPress={(data, details) => {
            const lat = details?.geometry.location.lat;
            const lng = details?.geometry.location.lng;

            if (lat == null || lng == null) return;

            const destination = {
              latitude: lat,
              longitude: lng,
            };

            setLocation(destination);

            mapRef.current?.animateToRegion(
              {
                ...destination,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000,
            );
          }}
          onFail={(error) => {
            console.log("GOOGLE PLACES ERROR:", error);
          }}
          styles={{
            container: {
              flex: 0,
            },

            textInputContainer: {
              backgroundColor: "transparent",
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },

            textInput: {
              height: 50,
              backgroundColor: "#FFF",
              borderRadius: 14,
              fontSize: 15,
              color: "#0C2333",
            },

            listView: {
              backgroundColor: "#FFF",
              borderRadius: 14,
              marginTop: 8,
              elevation: 10,
              zIndex: 9999,
            },
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 14,
              top: 13,
              zIndex: 99999,
            }}
            onPress={() => {
              setSearchText("");

              placesRef.current?.setAddressText("");
              setPlacesKey((prev) => prev + 1);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={{ ...styles.title, color: theme.text }}>
                  ¿Qué necesitas?
                </Text>
                <Text style={styles.categoryTitle}>Tipo de mandado</Text>

                {isLoading ? (
                  <Text>Cargando categorías...</Text>
                ) : (
                  <View style={styles.categories}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.category,
                          selectedCategory === category.id && {
                            borderColor: category.color,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <Text style={styles.categoryIcon}>{category.icon}</Text>

                        <Text
                          style={{
                            color: theme.text,
                            fontWeight:
                              selectedCategory === category.id ? "700" : "500",
                          }}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <TextInput
                  placeholder="Agrega la información que quieras que el mandadito sepa."
                  placeholderTextColor="#9CA3AF"
                  value={mandado}
                  onChangeText={setMandado}
                  style={styles.input}
                  multiline
                />

                {errorModalVisible && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateOrder}
                >
                  <Text style={{ ...styles.buttonText, color: theme.text }}>
                    Solicitar mandado
                  </Text>
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
    fontWeight: "700",
    fontSize: 16,
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
  },
  categoryTitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 10,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  category: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontWeight: "500",
  },
  searchContainer: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#0C2333",
  },
});
