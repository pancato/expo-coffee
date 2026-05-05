import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

import type { Palette, ViewName } from "./types";
import { CircleButton, HapticPressable, shadow } from "./ui";

export function BottomDock({
  view,
  setView,
  onAdd,
  colors,
  bottomOffset,
}: {
  view: ViewName;
  setView: (view: ViewName) => void;
  onAdd: () => void;
  colors: Palette;
  bottomOffset: number;
}) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
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
                onPress={() => setView(item)}
                style={{
                  flex: 1,
                  borderRadius: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? colors.recessed : "transparent",
                }}
              >
                <MaterialCommunityIcons
                  name={item === "journal" ? "coffee-outline" : "stamper"}
                  size={32}
                  color={active ? colors.accent : colors.muted}
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
