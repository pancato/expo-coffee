import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n } from "./constants";
import { titleFont } from "./typography";
import type { BrewEntry, Language, Palette } from "./types";
import { CircleButton, shadow } from "./ui";

export function BrewMapModal({
  visible,
  entries,
  colors,
  language,
  onClose,
}: {
  visible: boolean;
  entries: BrewEntry[];
  colors: Palette;
  language: Language;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const markers = entries.filter((entry) => entry.location);
  const first = markers[0]?.location ?? { latitude: 30.23, longitude: 120.22 };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.recessed }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: first.latitude,
            longitude: first.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
          customMapStyle={mapStyle}
        >
          {markers.map((entry) => (
            <Marker key={entry.id} coordinate={entry.location!} title={entry.shop} description={`${entry.item} * ${entry.city}`}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface,
                    borderWidth: 3,
                    borderColor: "rgba(255,255,255,0.85)",
                    boxShadow: shadow(colors, 10, 22),
                  }}
                >
                  <MaterialCommunityIcons name="coffee-outline" size={32} color={colors.stamp} />
                </View>
                <View
                  style={{
                    marginTop: -2,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 8,
                    borderRightWidth: 8,
                    borderTopWidth: 11,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderTopColor: colors.surface,
                  }}
                />
              </View>
            </Marker>
          ))}
        </MapView>
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 18,
            right: 18,
            minHeight: 58,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <CircleButton icon="menu" label="menu" colors={colors} onPress={() => {}} />
          <View
            style={{
              flex: 1,
              height: 54,
              borderRadius: 27,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.9)",
            }}
          >
            <Text selectable numberOfLines={1} style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 22, fontWeight: "900" }}>
              {i18n[language].map}
            </Text>
          </View>
          <CircleButton icon="x" label={i18n[language].close} colors={colors} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f3f0e7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#716a63" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f4ec" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#9fd8e2" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#d8d4cb" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dfead0" }] },
];
