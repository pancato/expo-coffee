import type { Language } from "./types";

export function toISODate(date: Date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}

export function monthCells(date: Date) {
  const cells: (number | null)[] = [];
  const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);

  return cells;
}

export function dateForDay(base: Date, day: number) {
  return new Date(base.getFullYear(), base.getMonth(), day);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function formatMonth(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function stampDate(dateISO: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
    .format(new Date(`${dateISO}T12:00:00`))
    .toUpperCase();
}

export function unique(values: string[]) {
  return new Set(values.map((value) => value.trim()).filter(Boolean)).size;
}
