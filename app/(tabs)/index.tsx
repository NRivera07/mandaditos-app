import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type LocationCoords = {
  latitude: number;
  longitude: number;
};
export default function App() {
  const [location, setLocation] = useState<LocationCoords | undefined>(
    undefined
  );

  const mandados = location
    ? [
        {
          id: "1",
          descripcion: "Comprar medicina",
          lat: location.latitude + 0.002,
          lng: location.longitude + 0.002,
        },
        {
          id: "2",
          descripcion: "Ir al banco",
          lat: location.latitude - 0.002,
          lng: location.longitude - 0.001,
        },
      ]
    : [];

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
        {mandados.map((m) => (
          <Marker
            key={m.id}
            coordinate={{
              latitude: m.lat,
              longitude: m.lng,
            }}
            title={m.descripcion}
          />
        ))}
      </MapView>
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
});
