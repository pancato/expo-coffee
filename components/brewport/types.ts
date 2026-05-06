import type { ImageSourcePropType } from "react-native";

export type Language = "en" | "zh";
export type ThemeName = "crema" | "sage" | "graphite" | "coral";
export type ViewName = "journal" | "passport";

export type BrewEntry = {
  id: string;
  dateISO: string;
  shop: string;
  city: string;
  item: string;
  note: string;
  rating: number;
  photoUri?: string;
  stickerUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type DraftEntry = Omit<BrewEntry, "id" | "dateISO">;

export type ShopCandidate = {
  id: string;
  name: string;
  city?: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
};

export type Palette = {
  label: string;
  zhLabel: string;
  pageTint: string;
  surface: string;
  raised: string;
  recessed: string;
  text: string;
  muted: string;
  quiet: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  stamp: string;
  hairline: string;
  shadow: string;
};

export type PaperAsset = ImageSourcePropType;
