import type { Language } from "./types";

export const fontFamilies = {
  display: "ZCOOLQingKeHuangYou_400Regular",
  regular: "NotoSansSC_400Regular",
  medium: "NotoSansSC_500Medium",
  semiBold: "NotoSansSC_600SemiBold",
  bold: "NotoSansSC_700Bold",
  black: "NotoSansSC_900Black",
};

export function titleFont(language: Language) {
  void language;
  return fontFamilies.display;
}

export function bodyFont(language: Language) {
  void language;
  return fontFamilies.medium;
}

export function monoFont(language: Language) {
  void language;
  return fontFamilies.bold;
}
