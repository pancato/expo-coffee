import { Text, View } from "react-native";

import { i18n } from "../../locales";
import { formatDate } from "./date-utils";
import { bodyFont, titleFont } from "./typography";
import type { Language, Palette, ViewName } from "./types";
import { CircleButton } from "./ui";

export function Header({
  view,
  language,
  colors,
  onSettings,
  onMap,
  onPassportAction,
  passportCompact,
}: {
  view: ViewName;
  language: Language;
  colors: Palette;
  onSettings: () => void;
  onMap: () => void;
  onPassportAction: () => void;
  passportCompact: boolean;
}) {
  const title = view === "journal" ? i18n[language].today : i18n[language].allStamps;
  const subtitle = view === "journal" ? formatDate(new Date(), language) : i18n[language].passport;

  return (
    <View
      style={{
        minHeight: 86,
        paddingHorizontal: 22,
        paddingTop: 2,
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CircleButton
          icon={view === "journal" ? "gear" : passportCompact ? "stamp" : "grid"}
          label={view === "journal" ? i18n[language].settings : i18n[language].toggleLayout}
          onPress={view === "journal" ? onSettings : onPassportAction}
          colors={colors}
        />
        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 10, gap: 3 }}>
          <Text
            selectable
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            style={{
              color: colors.text,
              fontFamily: titleFont(language),
              fontWeight: "900",
              fontSize: view === "journal" ? 35 : 28,
              letterSpacing: 0,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            style={{
              color: colors.muted,
              fontFamily: bodyFont(language),
              fontWeight: "800",
              fontSize: 14,
              letterSpacing: 0,
              textAlign: "center",
            }}
          >
            {subtitle}
          </Text>
        </View>
        {view === "passport" ? <CircleButton icon="map" label={i18n[language].map} onPress={onMap} colors={colors} /> : <View style={{ width: 52, height: 52 }} />}
      </View>
    </View>
  );
}
