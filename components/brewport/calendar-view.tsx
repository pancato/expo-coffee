import { useMemo } from "react";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

import { i18n, weekdayLabels } from "./constants";
import { addMonths, dateForDay, formatDate, formatMonth, monthCells, toISODate } from "./date-utils";
import { LogCard } from "./log-card";
import { bodyFont, monoFont, titleFont } from "./typography";
import type { BrewEntry, Language, Palette } from "./types";
import { HapticPressable, SectionTitle, shadow } from "./ui";

export function CalendarView({
  entries,
  calendarMonth,
  selectedDate,
  setSelectedDate,
  setCalendarMonth,
  language,
  colors,
  width,
}: {
  entries: BrewEntry[];
  calendarMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setCalendarMonth: (date: Date) => void;
  language: Language;
  colors: Palette;
  width: number;
}) {
  const cells = monthCells(calendarMonth);
  const cardPadding = 18;
  const gap = 10;
  const tile = Math.floor((width - cardPadding * 2 - gap * 6) / 7);
  const selectedISO = toISODate(selectedDate);
  const todayISO = toISODate(new Date());
  const entriesByDate = useMemo(() => {
    return entries.reduce<Record<string, BrewEntry[]>>((acc, entry) => {
      acc[entry.dateISO] = [...(acc[entry.dateISO] ?? []), entry];
      return acc;
    }, {});
  }, [entries]);
  const selectedEntries = entriesByDate[selectedISO] ?? [];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 142, gap: 22 }}
    >
      <View
        style={{
          padding: cardPadding,
          borderRadius: 32,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
          boxShadow: shadow(colors, 14, 32),
          gap: 15,
        }}
      >
        <View style={{ minHeight: 42, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MonthButton icon="chevron-left" colors={colors} onPress={() => setCalendarMonth(addMonths(calendarMonth, -1))} />
          <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <Text
              selectable
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 18, fontWeight: "900" }}
            >
              {formatMonth(calendarMonth, language)}
            </Text>
            <Text selectable numberOfLines={1} style={{ color: colors.muted, fontFamily: bodyFont(language), fontSize: 11, fontWeight: "800" }}>
              {formatDate(selectedDate, language)}
            </Text>
          </View>
          <MonthButton icon="chevron-right" colors={colors} onPress={() => setCalendarMonth(addMonths(calendarMonth, 1))} />
          <HapticPressable
            haptic="light"
            onPress={() => {
              const today = new Date();
              setSelectedDate(today);
              setCalendarMonth(today);
            }}
            style={{
              height: 34,
              paddingHorizontal: 12,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.accentSoft,
            }}
          >
            <Text selectable style={{ color: colors.accentDark, fontFamily: bodyFont(language), fontSize: 12, fontWeight: "900" }}>
              {i18n[language].todayAction}
            </Text>
          </HapticPressable>
        </View>

        <View style={{ flexDirection: "row", gap }}>
          {weekdayLabels[language].map((day) => (
            <Text
              key={day}
              selectable
              style={{
                width: tile,
                textAlign: "center",
                color: colors.muted,
                fontSize: 13,
                fontWeight: "900",
                fontFamily: monoFont(language),
              }}
            >
              {day}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
          {cells.map((day, index) => {
            if (!day) return <View key={`empty-${index}`} style={{ width: tile, height: tile }} />;

            const date = dateForDay(calendarMonth, day);
            const iso = toISODate(date);
            const selected = iso === selectedISO;
            const isToday = iso === todayISO;
            const hasEntry = Boolean(entriesByDate[iso]?.length);

            return (
              <HapticPressable
                key={iso}
                haptic={selected ? "light" : "selection"}
                onPress={() => {
                  setSelectedDate(date);
                  setCalendarMonth(date);
                }}
                style={{
                  width: tile,
                  height: tile,
                  minWidth: 36,
                  minHeight: 36,
                  borderRadius: Math.max(12, tile * 0.3),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected ? colors.accent : hasEntry ? colors.accentSoft : colors.recessed,
                  borderWidth: isToday && !selected ? 1.5 : 0,
                  borderColor: colors.accent,
                }}
              >
                <Text
                  selectable
                  style={{
                    color: selected ? colors.raised : colors.text,
                    fontFamily: monoFont(language),
                    fontSize: Math.max(13, tile * 0.31),
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {day}
                </Text>
                {hasEntry ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: Math.max(4, tile * 0.12),
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: selected ? colors.raised : colors.accent,
                    }}
                  />
                ) : null}
              </HapticPressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <SectionTitle title={i18n[language].recent} meta={formatDate(selectedDate, language)} colors={colors} language={language} />
        {selectedEntries.length ? (
          selectedEntries.map((entry) => <LogCard key={entry.id} entry={entry} colors={colors} language={language} />)
        ) : (
          <View
            style={{
              minHeight: 112,
              borderRadius: 26,
              padding: 18,
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.46)",
              borderWidth: 1,
              borderColor: colors.hairline,
            }}
          >
            <Text selectable style={{ color: colors.muted, fontFamily: bodyFont(language), fontSize: 15, lineHeight: 23, fontWeight: "700" }}>
              {i18n[language].empty}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function MonthButton({
  icon,
  colors,
  onPress,
}: {
  icon: "chevron-left" | "chevron-right";
  colors: Palette;
  onPress: () => void;
}) {
  return (
    <HapticPressable
      haptic="selection"
      onPress={onPress}
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.recessed,
      }}
    >
      <Feather name={icon} size={20} color={colors.muted} />
    </HapticPressable>
  );
}
