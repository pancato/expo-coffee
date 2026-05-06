import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { playHaptic, type HapticKind } from "./haptics";
import { AppIcon, type IconName } from "./icons";
import { bodyFont, titleFont } from "./typography";
import type { Language, Palette } from "./types";

export function shadow(colors: Palette, y = 12, blur = 28) {
  return `0 ${y}px ${blur}px ${colors.shadow}`;
}

export function HapticPressable({
  children,
  haptic = "selection",
  onPress,
  ...props
}: PressableProps & {
  children: ReactNode;
  haptic?: HapticKind;
}) {
  return (
    <Pressable
      {...props}
      onPress={(event) => {
        void playHaptic(haptic);
        onPress?.(event);
      }}
    >
      {children}
    </Pressable>
  );
}

export function CircleButton({
  icon,
  label,
  onPress,
  colors,
  emphasized = false,
  haptic = "light",
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  colors: Palette;
  emphasized?: boolean;
  haptic?: HapticKind;
}) {
  return (
    <HapticPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      haptic={haptic}
      onPress={onPress}
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: emphasized ? colors.accent : "rgba(255,255,255,0.7)",
        borderWidth: 1,
        borderColor: emphasized ? colors.accent : "rgba(255,255,255,0.9)",
        boxShadow: shadow(colors, 8, 20),
      }}
    >
      <AppIcon name={icon} size={emphasized ? 28 : 24} color={emphasized ? colors.raised : colors.muted} weight={emphasized ? "bold" : "regular"} />
    </HapticPressable>
  );
}

export function SectionTitle({
  title,
  meta,
  colors,
  language,
}: {
  title: string;
  meta: string;
  colors: Palette;
  language: Language;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
      <Text selectable style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 21, fontWeight: "900" }}>
        {title}
      </Text>
      <Text
        selectable
        numberOfLines={1}
        style={{
          flex: 1,
          color: colors.muted,
          fontFamily: bodyFont(language),
          fontSize: 13,
          fontWeight: "800",
        }}
      >
        {meta}
      </Text>
    </View>
  );
}
