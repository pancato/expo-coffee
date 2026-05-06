import { BlurView } from "expo-blur";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n } from "../../locales";
import { AppIcon, type IconName } from "./icons";
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
      <BlurView intensity={42} tint="light" style={{ flex: 1 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={i18n[language].close}
          onPress={onClose}
          style={{ position: "absolute", inset: 0, backgroundColor: "rgba(248,244,236,0.34)" }}
        />
        <View style={{ flex: 1, justifyContent: "flex-end", padding: 20 }}>
          <View style={{ gap: 12, paddingBottom: insets.bottom + 28 }}>
          <ActionRow icon="camera" label={i18n[language].takePhoto} colors={colors} language={language} onPress={onCamera} />
          <ActionRow icon="image" label={i18n[language].gallery} colors={colors} language={language} onPress={onGallery} />
          <ActionRow icon="edit" label={i18n[language].manual} colors={colors} language={language} onPress={onManual} />
            <View style={{ alignItems: "flex-end", paddingTop: 4 }}>
              <CircleButton icon="x" label={i18n[language].close} colors={colors} onPress={onClose} haptic="light" />
            </View>
          </View>
        </View>
      </BlurView>
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
  icon: IconName;
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
        <AppIcon name={icon} size={25} color={colors.accent} weight="bold" />
      </View>
      <Text
        selectable
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ flex: 1, color: colors.text, fontFamily: titleFont(language), fontSize: language === "zh" ? 19 : 21, fontWeight: "900" }}
      >
        {label}
      </Text>
      <AppIcon name="chevron-right" size={25} color={colors.quiet} />
    </HapticPressable>
  );
}
