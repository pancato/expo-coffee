import type { Language } from "../components/brewport/types";

import { en } from "./en";
import { zh } from "./zh";

export const i18n = {
  en,
  zh,
} satisfies Record<Language, typeof en>;

export const weekdayLabels: Record<Language, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  zh: ["日", "一", "二", "三", "四", "五", "六"],
};

export type TranslationKey = keyof typeof en;
