import { ScrollView, Text, View } from "react-native";

import { i18n } from "../../locales";
import { unique } from "./date-utils";
import { Stamp } from "./stamp";
import type { BrewEntry, Language, Palette } from "./types";
import { titleFont } from "./typography";

export function PassportView({
  entries,
  language,
  colors,
  compact,
  bottomInset,
}: {
  entries: BrewEntry[];
  language: Language;
  colors: Palette;
  compact: boolean;
  bottomInset: number;
}) {
  const shops = unique(entries.map((entry) => entry.shop));
  const cities = unique(entries.map((entry) => entry.city));
  const columnWidth = compact ? "33.333%" : "50%";
  const slotHeight = compact ? 132 : 160;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: bottomInset,
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
            style={{ width: columnWidth, alignItems: "center", height: slotHeight }}
          >
            <Stamp
              entry={entry}
              index={index}
              colors={colors}
              language={language}
              scale={compact ? 0.78 : 1}
            />
          </View>
        ))}
        {Array.from({ length: Math.max(0, 6 - entries.length) }).map(
          (_, index) => (
            <View
              key={`ghost-${index}`}
              style={{
                width: columnWidth,
                alignItems: "center",
                height: slotHeight,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: compact ? 92 : 122,
                  height: compact ? 92 : 122,
                  borderRadius: compact ? 46 : 61,
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

    </ScrollView>
  );
}
