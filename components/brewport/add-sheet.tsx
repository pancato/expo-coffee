import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Modal, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n } from "./constants";
import { titleFont } from "./typography";
import type { Language, Palette } from "./types";
import { CircleButton, HapticPressable } from "./ui";

export function AddSheet({
  visible,
  language,
  colors,
  onClose,
  onCamera,
  onGallery,
  onManual,
}: {
  visible: boolean;
  language: Language;
  colors: Palette;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onManual: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36,31,28,0.24)", padding: 20 }}>
        <View style={{ gap: 12, paddingBottom: insets.bottom + 28 }}>
          <ActionRow icon="camera" label={i18n[language].takePhoto} colors={colors} language={language} onPress={onCamera} />
          <ActionRow icon="image" label={i18n[language].gallery} colors={colors} language={language} onPress={onGallery} />
          <ActionRow icon="edit-3" label={i18n[language].manual} colors={colors} language={language} onPress={onManual} />
          <View style={{ alignItems: "flex-end", paddingTop: 4 }}>
            <CircleButton icon="x" label={i18n[language].close} colors={colors} onPress={onClose} haptic="light" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ActionRow({
  icon,
  label,
  colors,
  language,
  onPress,
}: {
  icon: ComponentProps<typeof Feather>["name"];
  label: string;
  colors: Palette;
  language: Language;
  onPress: () => void;
}) {
  return (
    <HapticPressable
      haptic="light"
      onPress={onPress}
      style={{
        minHeight: 82,
        borderRadius: 28,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: "rgba(255,255,255,0.78)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.92)",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
        }}
      >
        <Feather name={icon} size={25} color={colors.accent} />
      </View>
      <Text
        selectable
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ flex: 1, color: colors.text, fontFamily: titleFont(language), fontSize: language === "zh" ? 19 : 21, fontWeight: "900" }}
      >
        {label}
      </Text>
      <Feather name="chevron-right" size={25} color={colors.quiet} />
    </HapticPressable>
  );
}
