import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

import { i18n } from "./constants";
import { unique } from "./date-utils";
import { Stamp } from "./stamp";
import type { BrewEntry, Language, Palette } from "./types";
import { titleFont } from "./typography";
import { HapticPressable, shadow } from "./ui";

export function PassportView({
  entries,
  language,
  colors,
  onMap,
}: {
  entries: BrewEntry[];
  language: Language;
  colors: Palette;
  onMap: () => void;
}) {
  const shops = unique(entries.map((entry) => entry.shop));
  const cities = unique(entries.map((entry) => entry.city));

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 142,
        gap: 22,
      }}
    >
      <View
        style={{
          alignSelf: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.54)",
          borderWidth: 1,
          borderColor: colors.hairline,
        }}
      >
        <Text
          selectable
          style={{
            color: colors.muted,
            fontFamily: titleFont(language),
            fontSize: 15,
            fontWeight: "900",
          }}
        >
          {entries.length} {i18n[language].stamps} * {shops}{" "}
          {i18n[language].shops} * {cities} {i18n[language].cities}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 26 }}>
        {entries.map((entry, index) => (
          <View
            key={entry.id}
            style={{ width: "50%", alignItems: "center", height: 160 }}
          >
            <Stamp
              entry={entry}
              index={index}
              colors={colors}
              language={language}
            />
          </View>
        ))}
        {Array.from({ length: Math.max(0, 6 - entries.length) }).map(
          (_, index) => (
            <View
              key={`ghost-${index}`}
              style={{
                width: "50%",
                alignItems: "center",
                height: 160,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 122,
                  height: 122,
                  borderRadius: 61,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: colors.quiet,
                  opacity: 0.38,
                }}
              />
            </View>
          ),
        )}
      </View>

      <HapticPressable
        haptic="light"
        onPress={onMap}
        style={{
          minHeight: 72,
          paddingHorizontal: 18,
          borderRadius: 26,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          boxShadow: shadow(colors, 14, 32),
        }}
      >
        <Feather name="map" size={24} color={colors.accent} />
        <Text
          selectable
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 17,
            fontWeight: "900",
            fontFamily: titleFont(language),
          }}
        >
          {i18n[language].map}
        </Text>
        <Feather name="chevron-right" size={25} color={colors.quiet} />
      </HapticPressable>
    </ScrollView>
  );
}
