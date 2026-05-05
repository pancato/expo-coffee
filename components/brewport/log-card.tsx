import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { bodyFont } from "./typography";
import type { BrewEntry, Language, Palette } from "./types";

export function LogCard({ entry, colors, language }: { entry: BrewEntry; colors: Palette; language: Language }) {
  return (
    <View
      style={{
        minHeight: 88,
        borderRadius: 26,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.62)",
        borderWidth: 1,
        borderColor: colors.hairline,
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
      }}
    >
      {entry.photoUri ? (
        <Image source={{ uri: entry.photoUri }} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 20 }} />
      ) : (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: colors.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="coffee-outline" size={34} color={colors.accentDark} />
        </View>
      )}
      <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
        <Text selectable numberOfLines={1} style={{ color: colors.text, fontFamily: bodyFont(language), fontSize: 17, fontWeight: "900" }}>
          {entry.shop}
        </Text>
        <Text selectable numberOfLines={1} style={{ color: colors.muted, fontFamily: bodyFont(language), fontSize: 13, fontWeight: "800" }}>
          {entry.item} * {entry.city}
        </Text>
        <Text selectable numberOfLines={1} style={{ color: colors.accentDark, fontSize: 12, fontWeight: "900" }}>
          {"★".repeat(entry.rating)}
        </Text>
      </View>
    </View>
  );
}
