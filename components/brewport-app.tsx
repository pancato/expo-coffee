import {
  NotoSansSC_400Regular,
  NotoSansSC_500Medium,
  NotoSansSC_600SemiBold,
  NotoSansSC_700Bold,
  NotoSansSC_900Black,
  useFonts,
} from "@expo-google-fonts/noto-sans-sc";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from "react";
import { Alert, ImageBackground, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AddSheet } from "./brewport/add-sheet";
import { BottomDock } from "./brewport/bottom-dock";
import { CalendarView } from "./brewport/calendar-view";
import { i18n, palettes, paperTexture, seedEntries, storageKeys } from "./brewport/constants";
import { startOfMonth, toISODate } from "./brewport/date-utils";
import { EntryEditor } from "./brewport/entry-editor";
import { playHaptic } from "./brewport/haptics";
import { Header } from "./brewport/header";
import { BrewMapModal } from "./brewport/map-modal";
import { PassportView } from "./brewport/passport-view";
import { SettingsModal } from "./brewport/settings-modal";
import { readStored, writeStored } from "./brewport/storage";
import type { BrewEntry, DraftEntry, Language, ThemeName, ViewName } from "./brewport/types";

function emptyDraft(photoUri?: string): DraftEntry {
  return {
    shop: "",
    city: "",
    item: "",
    note: "",
    rating: 5,
    photoUri,
  };
}

export function BrewportApp() {
  const [fontsLoaded] = useFonts({
    NotoSansSC_400Regular,
    NotoSansSC_500Medium,
    NotoSansSC_600SemiBold,
    NotoSansSC_700Bold,
    NotoSansSC_900Black,
  });
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const screenWidth = Math.min(width, 520);
  const contentWidth = screenWidth - 40;
  const [entries, setEntries] = useState<BrewEntry[]>(() => readStored(storageKeys.entries, seedEntries));
  const [language, setLanguage] = useState<Language>(() => readStored(storageKeys.language, "en"));
  const [theme, setTheme] = useState<ThemeName>(() => readStored(storageKeys.theme, "crema"));
  const [view, setView] = useState<ViewName>("journal");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [addOpen, setAddOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [draft, setDraft] = useState<DraftEntry>(() => emptyDraft());
  const colors = palettes[theme];

  if (!fontsLoaded) {
    return (
      <ImageBackground source={paperTexture} resizeMode="cover" style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: colors.pageTint }} />
      </ImageBackground>
    );
  }

  function persist(next: BrewEntry[]) {
    setEntries(next);
    writeStored(storageKeys.entries, next);
  }

  function openEditor(photoUri?: string) {
    setDraft(emptyDraft(photoUri));
    setAddOpen(false);
    setEditorOpen(true);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      await playHaptic("warning");
      Alert.alert(i18n[language].permission, i18n[language].cameraPermission);
      return;
    }

    await playHaptic("medium");
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.84,
    });

    if (!result.canceled && result.assets[0]) {
      await playHaptic("success");
      openEditor(result.assets[0].uri);
    }
  }

  async function pickGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      await playHaptic("warning");
      Alert.alert(i18n[language].permission, i18n[language].galleryPermission);
      return;
    }

    await playHaptic("medium");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.84,
    });

    if (!result.canceled && result.assets[0]) {
      await playHaptic("success");
      openEditor(result.assets[0].uri);
    }
  }

  async function attachLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      await playHaptic("warning");
      Alert.alert(i18n[language].permission, i18n[language].locationPermission);
      return;
    }

    await playHaptic("medium");
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    let city = draft.city;

    try {
      const places = await Location.reverseGeocodeAsync(position.coords);
      city = places[0]?.city || places[0]?.region || city;
    } catch {
      city = draft.city;
    }

    setDraft({
      ...draft,
      city,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    await playHaptic("success");
  }

  function saveEntry() {
    const next: BrewEntry = {
      id: `${Date.now()}`,
      dateISO: toISODate(selectedDate),
      shop: draft.shop.trim() || i18n[language].unknownShop,
      city: draft.city.trim() || i18n[language].unknownCity,
      item: draft.item.trim() || i18n[language].coffee,
      note: draft.note.trim(),
      rating: draft.rating,
      photoUri: draft.photoUri,
      location: draft.location,
    };

    persist([next, ...entries]);
    setEditorOpen(false);
    setView("passport");
  }

  return (
    <ImageBackground source={paperTexture} resizeMode="cover" style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.pageTint }}>
        <View
          style={{
            flex: 1,
            width: screenWidth,
            alignSelf: "center",
            paddingTop: Math.max(2, insets.top - 6),
            paddingBottom: insets.bottom + 22,
          }}
        >
          <Header view={view} language={language} colors={colors} onSettings={() => setSettingsOpen(true)} onMap={() => setMapOpen(true)} />
          <View style={{ flex: 1 }}>
            {view === "journal" ? (
              <CalendarView
                entries={entries}
                calendarMonth={calendarMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setCalendarMonth={setCalendarMonth}
                language={language}
                colors={colors}
                width={contentWidth}
              />
            ) : (
              <PassportView entries={entries} language={language} colors={colors} onMap={() => setMapOpen(true)} />
            )}
          </View>
          <BottomDock view={view} setView={setView} onAdd={() => setAddOpen(true)} colors={colors} bottomOffset={insets.bottom + 26} />
        </View>

        <AddSheet
          visible={addOpen}
          language={language}
          colors={colors}
          onClose={() => setAddOpen(false)}
          onCamera={takePhoto}
          onGallery={pickGallery}
          onManual={() => openEditor()}
        />
        <EntryEditor
          visible={editorOpen}
          language={language}
          colors={colors}
          draft={draft}
          setDraft={setDraft}
          onClose={() => setEditorOpen(false)}
          onSave={saveEntry}
          onLocation={attachLocation}
        />
        <SettingsModal
          visible={settingsOpen}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          colors={colors}
          onClose={() => setSettingsOpen(false)}
        />
        <BrewMapModal visible={mapOpen} entries={entries} colors={colors} language={language} onClose={() => setMapOpen(false)} />
      </View>
    </ImageBackground>
  );
}
