import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { ImageBackground, Modal, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n, palettes, paperTexture, storageKeys } from "./constants";
import { writeStored } from "./storage";
import { bodyFont, titleFont } from "./typography";
import type { Language, Palette, ThemeName } from "./types";
import { CircleButton, HapticPressable } from "./ui";

export function SettingsModal({
  visible,
  language,
  setLanguage,
  theme,
  setTheme,
  colors,
  onClose,
}: {
  visible: boolean;
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: Palette;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <ImageBackground source={paperTexture} resizeMode="cover" style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: colors.pageTint, paddingTop: insets.top + 8, paddingHorizontal: 22 }}>
          <View style={{ minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Text selectable style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 29, fontWeight: "900" }}>
              {i18n[language].settings}
            </Text>
            <View style={{ position: "absolute", right: 0 }}>
              <CircleButton icon="x" label={i18n[language].close} colors={colors} onPress={onClose} />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 34, gap: 16 }} showsVerticalScrollIndicator={false}>
            <SettingsRow icon="user" label="Brewport" colors={colors} language={language} />
            <View style={{ borderRadius: 28, padding: 18, backgroundColor: colors.surface, gap: 16, borderWidth: 1, borderColor: colors.hairline }}>
              <Text selectable style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 20, fontWeight: "900" }}>
                {i18n[language].preference}
              </Text>
              <Text selectable style={{ color: colors.muted, fontFamily: bodyFont(language), fontWeight: "900" }}>
                {i18n[language].language}
              </Text>
              <Segmented
                colors={colors}
                language={language}
                selected={language}
                values={[
                  { value: "en", label: i18n[language].english },
                  { value: "zh", label: i18n[language].chinese },
                ]}
                onSelect={(next) => {
                  setLanguage(next);
                  writeStored(storageKeys.language, next);
                }}
              />
              <Text selectable style={{ color: colors.muted, fontFamily: bodyFont(language), fontWeight: "900" }}>
                {i18n[language].theme}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {(Object.keys(palettes) as ThemeName[]).map((name) => {
                  const palette = palettes[name];
                  const active = name === theme;
                  return (
                    <HapticPressable
                      key={name}
                      haptic="light"
                      onPress={() => {
                        setTheme(name);
                        writeStored(storageKeys.theme, name);
                      }}
                      style={{
                        width: "48%",
                        minHeight: 82,
                        borderRadius: 20,
                        padding: 12,
                        justifyContent: "space-between",
                        backgroundColor: palette.surface,
                        borderWidth: active ? 2 : 1,
                        borderColor: active ? colors.accent : colors.hairline,
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 6 }}>
                        {[palette.recessed, palette.accent, palette.stamp].map((color) => (
                          <View key={color} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color }} />
                        ))}
                      </View>
                      <Text selectable numberOfLines={1} style={{ color: palette.text, fontFamily: bodyFont(language), fontWeight: "900" }}>
                        {language === "zh" ? palette.zhLabel : palette.label}
                      </Text>
                    </HapticPressable>
                  );
                })}
              </View>
            </View>
            <SettingsRow icon="settings" label={i18n[language].general} colors={colors} language={language} />
            <SettingsRow icon="file-text" label={i18n[language].privacy} colors={colors} language={language} />
            <SettingsRow icon="thumbs-up" label={i18n[language].feedback} colors={colors} language={language} />
            <Text selectable style={{ color: colors.quiet, textAlign: "center", fontFamily: bodyFont(language), paddingTop: 8 }}>
              {i18n[language].version}
            </Text>
          </ScrollView>
        </View>
      </ImageBackground>
    </Modal>
  );
}

function SettingsRow({
  icon,
  label,
  colors,
  language,
}: {
  icon: ComponentProps<typeof Feather>["name"];
  label: string;
  colors: Palette;
  language: Language;
}) {
  return (
    <HapticPressable
      haptic="light"
      onPress={() => {}}
      style={{
        minHeight: 86,
        borderRadius: 28,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.hairline,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      }}
    >
      <View style={{ width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: colors.recessed }}>
        <Feather name={icon} size={23} color={colors.accent} />
      </View>
      <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ flex: 1, color: colors.text, fontFamily: titleFont(language), fontSize: 20, fontWeight: "900" }}>
        {label}
      </Text>
      <Feather name="chevron-right" size={24} color={colors.quiet} />
    </HapticPressable>
  );
}

function Segmented<T extends string>({
  values,
  selected,
  onSelect,
  colors,
  language,
}: {
  values: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  colors: Palette;
  language: Language;
}) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: colors.recessed, padding: 5, borderRadius: 18 }}>
      {values.map((item) => {
        const active = item.value === selected;
        return (
          <HapticPressable
            key={item.value}
            haptic="selection"
            onPress={() => onSelect(item.value)}
            style={{
              flex: 1,
              minHeight: 42,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active ? colors.surface : "transparent",
            }}
          >
            <Text selectable numberOfLines={1} style={{ color: active ? colors.text : colors.muted, fontFamily: bodyFont(language), fontWeight: "900" }}>
              {item.label}
            </Text>
          </HapticPressable>
        );
      })}
    </View>
  );
}
