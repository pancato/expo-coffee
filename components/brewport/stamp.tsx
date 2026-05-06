import { Text, View } from "react-native";

import { stampDate } from "./date-utils";
import { bodyFont, monoFont } from "./typography";
import type { BrewEntry, Language, Palette } from "./types";

export function Stamp({
  entry,
  index,
  colors,
  language,
  scale = 1,
}: {
  entry: BrewEntry;
  index: number;
  colors: Palette;
  language: Language;
  scale?: number;
}) {
  const oval = index % 3 === 2;

  return (
    <View
      style={{
        width: oval ? 146 : 132,
        height: oval ? 94 : 132,
        borderRadius: oval ? 48 : 66,
        borderWidth: 3,
        borderColor: oval ? colors.accent : colors.stamp,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        transform: [{ rotate: index % 2 ? "6deg" : "-7deg" }, { scale }],
        opacity: 0.94,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: oval ? 132 : 116,
          height: oval ? 80 : 116,
          borderRadius: oval ? 40 : 58,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: oval ? colors.accent : colors.stamp,
          opacity: 0.5,
        }}
      />
      <Text
        selectable
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={{
          color: oval ? colors.accent : colors.stamp,
          textAlign: "center",
          fontFamily: bodyFont(language),
          fontSize: 12,
          lineHeight: 15,
          fontWeight: "900",
        }}
      >
        {entry.shop}
      </Text>
      <Text
        selectable
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        style={{
          color: oval ? colors.accent : colors.stamp,
          marginTop: 8,
          fontFamily: monoFont(language),
          fontSize: 16,
          fontWeight: "900",
        }}
      >
        {stampDate(entry.dateISO)}
      </Text>
      <Text selectable numberOfLines={1} style={{ color: oval ? colors.accent : colors.stamp, marginTop: 6, fontFamily: bodyFont(language), fontWeight: "900" }}>
        {entry.city}
      </Text>
    </View>
  );
}
