import { BlurView } from "expo-blur";
import { View } from "react-native";

import { AppIcon } from "./icons";
import type { Palette, ViewName } from "./types";
import { CircleButton, HapticPressable, shadow } from "./ui";

export function BottomDock({
  view,
  onNavigate,
  onAdd,
  colors,
  bottomOffset,
  bottomBlurHeight,
}: {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  onAdd: () => void;
  colors: Palette;
  bottomOffset: number;
  bottomBlurHeight: number;
}) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: bottomOffset + 84,
        alignItems: "center",
      }}
    >
      <BlurView
        pointerEvents="none"
        intensity={76}
        tint="systemUltraThinMaterial"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bottomBlurHeight,
          overflow: "hidden",
          backgroundColor: "rgba(255,253,247,0.14)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: bottomOffset,
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
        }}
      >
        <View
          style={{
            width: 214,
            height: 72,
            borderRadius: 38,
            padding: 6,
            flexDirection: "row",
            backgroundColor: "rgba(255,255,255,0.72)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.92)",
            boxShadow: shadow(colors, 16, 36),
          }}
        >
          {(["journal", "passport"] as ViewName[]).map((item) => {
            const active = view === item;
            return (
              <HapticPressable
                key={item}
                accessibilityRole="tab"
                haptic={active ? "selection" : "light"}
                onPress={() => onNavigate(item)}
                style={{
                  flex: 1,
                  borderRadius: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? colors.recessed : "transparent",
                }}
              >
                <AppIcon
                  name={item === "journal" ? "coffee" : "stamp"}
                  size={32}
                  color={active ? colors.accent : colors.muted}
                  weight={active ? "bold" : "regular"}
                />
              </HapticPressable>
            );
          })}
        </View>
        <CircleButton icon="plus" label="add" onPress={onAdd} colors={colors} emphasized haptic="medium" />
      </View>
    </View>
  );
}
