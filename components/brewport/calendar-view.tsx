import { useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";

import { i18n, weekdayLabels } from "../../locales";
import { addMonths, dateForDay, formatDate, formatMonth, monthCells, toISODate } from "./date-utils";
import { LogCard } from "./log-card";
import { AppIcon } from "./icons";
import { playHaptic } from "./haptics";
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
  droppingEntryId,
  onDropComplete,
}: {
  entries: BrewEntry[];
  calendarMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setCalendarMonth: (date: Date) => void;
  language: Language;
  colors: Palette;
  width: number;
  droppingEntryId?: string;
  onDropComplete: () => void;
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

        <View style={{ gap, height: tile * 6 + gap * 5 }}>
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <View key={`week-${weekIndex}`} style={{ flexDirection: "row", gap, height: tile }}>
              {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                const cellIndex = weekIndex * 7 + dayIndex;
                if (!day) return <View key={`empty-${cellIndex}`} style={{ width: tile, height: tile }} />;

                const date = dateForDay(calendarMonth, day);
                const iso = toISODate(date);
                const selected = iso === selectedISO;
                const isToday = iso === todayISO;
                const dayEntries = entriesByDate[iso] ?? [];
                const hasEntry = Boolean(dayEntries.length);

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
                        fontSize: Math.max(12, tile * 0.31),
                        fontWeight: "900",
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {day}
                    </Text>
                    {hasEntry ? (
                      <DayStickerStack
                        entries={dayEntries}
                        colors={colors}
                        size={tile}
                        droppingEntryId={droppingEntryId}
                        onDropComplete={onDropComplete}
                      />
                    ) : null}
                  </HapticPressable>
                );
              })}
            </View>
          ))}
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

function DayStickerStack({
  entries,
  colors,
  size,
  droppingEntryId,
  onDropComplete,
}: {
  entries: BrewEntry[];
  colors: Palette;
  size: number;
  droppingEntryId?: string;
  onDropComplete: () => void;
}) {
  const visible = entries.filter((entry) => entry.stickerUri || entry.photoUri).slice(0, 3);
  const newest = visible[0];
  const shouldDrop = Boolean(newest && newest.id === droppingEntryId);
  const drop = useRef(new Animated.Value(shouldDrop ? -90 : 0)).current;

  useEffect(() => {
    if (!shouldDrop) return;

    drop.setValue(-90);
    Animated.spring(drop, {
      toValue: 0,
      damping: 9,
      stiffness: 150,
      mass: 0.6,
      useNativeDriver: true,
    }).start(() => {
      void playHaptic("success");
      onDropComplete();
    });
  }, [drop, onDropComplete, shouldDrop]);

  if (!newest) {
    return (
      <View
        style={{
          position: "absolute",
          bottom: Math.max(4, size * 0.12),
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.accent,
        }}
      />
    );
  }

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 4, right: 4, bottom: 3, top: size * 0.38 }}>
      {visible
        .slice()
        .reverse()
        .map((entry, reverseIndex) => {
          const visualIndex = visible.length - 1 - reverseIndex;
          const uri = entry.stickerUri || entry.photoUri;
          if (!uri) return null;
          const image = (
            <View
              key={entry.id}
              style={{
                position: "absolute",
                left: size * 0.1 + visualIndex * 3,
                bottom: visualIndex * 3,
                width: size * 0.42,
                height: size * 0.42,
                borderRadius: size * 0.12,
                padding: 2,
                backgroundColor: "#FFFFFF",
                transform: [{ rotate: `${visualIndex % 2 ? 8 : -8}deg` }],
                boxShadow: `0 2px 5px ${colors.shadow}`,
              }}
            >
              <Image source={{ uri }} contentFit="cover" style={{ flex: 1, borderRadius: size * 0.09 }} />
            </View>
          );

          if (entry.id !== droppingEntryId) return image;

          return (
            <Animated.View key={entry.id} style={{ transform: [{ translateY: drop }] }}>
              {image}
            </Animated.View>
          );
        })}
      {entries.length > 1 ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: -2,
            minWidth: 19,
            height: 19,
            borderRadius: 10,
            paddingHorizontal: 4,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.accent,
          }}
        >
          <Text selectable style={{ color: colors.raised, fontSize: 11, fontWeight: "900" }}>
            {entries.length}
          </Text>
        </View>
      ) : null}
    </View>
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
      <AppIcon name={icon} size={20} color={colors.muted} />
    </HapticPressable>
  );
}
