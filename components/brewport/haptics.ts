import * as Haptics from "expo-haptics";

export type HapticKind = "selection" | "light" | "medium" | "success" | "warning";

export async function playHaptic(kind: HapticKind = "selection") {
  try {
    if (kind === "success") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (kind === "warning") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (kind === "medium") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    if (kind === "light") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    await Haptics.selectionAsync();
  } catch {
    // Haptics can be unavailable on simulators or some devices.
  }
}
