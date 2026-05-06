import {
  NotoSansSC_400Regular,
  NotoSansSC_500Medium,
  NotoSansSC_600SemiBold,
  NotoSansSC_700Bold,
  NotoSansSC_900Black,
  useFonts,
} from "@expo-google-fonts/noto-sans-sc";
import { ZCOOLQingKeHuangYou_400Regular } from "@expo-google-fonts/zcool-qingke-huangyou";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  InteractionManager,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n } from "../locales";
import { AddSheet } from "./brewport/add-sheet";
import { BottomDock } from "./brewport/bottom-dock";
import { CalendarView } from "./brewport/calendar-view";
import {
  palettes,
  paperTexture,
  seedEntries,
  storageKeys,
} from "./brewport/constants";
import { startOfMonth, toISODate } from "./brewport/date-utils";
import { EntryEditor } from "./brewport/entry-editor";
import { playHaptic } from "./brewport/haptics";
import { Header } from "./brewport/header";
import { BrewMapModal } from "./brewport/map-modal";
import { fetchNearbyShops } from "./brewport/nearby-shops";
import { PassportView } from "./brewport/passport-view";
import { SettingsModal } from "./brewport/settings-modal";
import { readStored, writeStored } from "./brewport/storage";
import type {
  BrewEntry,
  DraftEntry,
  Language,
  ShopCandidate,
  ThemeName,
  ViewName,
} from "./brewport/types";

type AddAction = "camera" | "gallery";


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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out")), timeoutMs);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

function waitForNativeTransition(delayMs = 260): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(resolve, delayMs);
    });
  });
}

function debugPickerFlow(step: string, details?: unknown) {
  if (__DEV__) {
    console.info("[Brewport:image-picker]", step, details ?? "");
  }
}

export function BrewportApp({ view }: { view: ViewName }) {
  const [fontsLoaded] = useFonts({
    NotoSansSC_400Regular,
    NotoSansSC_500Medium,
    NotoSansSC_600SemiBold,
    NotoSansSC_700Bold,
    NotoSansSC_900Black,
    ZCOOLQingKeHuangYou_400Regular,
  });
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const screenWidth = Math.min(width, 520);
  const contentWidth = screenWidth - 40;
  const [entries, setEntries] = useState<BrewEntry[]>(() =>
    readStored(storageKeys.entries, seedEntries),
  );
  const [language, setLanguage] = useState<Language>(() =>
    readStored(storageKeys.language, "en"),
  );
  const [theme, setTheme] = useState<ThemeName>(() =>
    readStored(storageKeys.theme, "crema"),
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [draft, setDraft] = useState<DraftEntry>(() => emptyDraft());
  const [nearbyShops, setNearbyShops] = useState<ShopCandidate[]>([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [droppingEntryId, setDroppingEntryId] = useState<string | undefined>();
  const [passportCompact, setPassportCompact] = useState(false);
  const autoLocationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const pendingAddAction = useRef<AddAction | undefined>(undefined);
  const addActionBusy = useRef(false);
  const colors = palettes[theme];

  useFocusEffect(
    useCallback(() => {
      setEntries(readStored(storageKeys.entries, seedEntries));
      setLanguage(readStored(storageKeys.language, "en"));
      setTheme(readStored(storageKeys.theme, "crema"));
      setDroppingEntryId(
        readStored<string | undefined>(storageKeys.lastDrop, undefined),
      );
    }, []),
  );

  useEffect(() => {
    return () => {
      if (autoLocationTimer.current) clearTimeout(autoLocationTimer.current);
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <ImageBackground
        source={paperTexture}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: colors.pageTint }} />
      </ImageBackground>
    );
  }

  function persist(next: BrewEntry[]) {
    setEntries(next);
    writeStored(storageKeys.entries, next);
  }

  function openEditor(photoUri?: string) {
    debugPickerFlow("open-editor", { hasPhoto: Boolean(photoUri) });
    const now = new Date();
    const nextDraft = emptyDraft(photoUri);
    if (autoLocationTimer.current) clearTimeout(autoLocationTimer.current);
    setSelectedDate(now);
    setCalendarMonth(startOfMonth(now));
    setDraft(nextDraft);
    setNearbyShops([]);
    setAddOpen(false);
    setEditorOpen(true);
    autoLocationTimer.current = setTimeout(() => {
      void hydrateLocationAndShops(nextDraft, { requestPermission: false });
    }, 450);
  }

  async function openEditorAfterPicker(photoUri: string) {
    debugPickerFlow("picker-returned-waiting-for-editor");
    await waitForNativeTransition(180);
    openEditor(photoUri);
    void playHaptic("success");
  }

  function queueAddAction(action: AddAction) {
    if (addActionBusy.current) {
      debugPickerFlow("ignored-busy-action", action);
      return;
    }

    addActionBusy.current = true;
    pendingAddAction.current = action;
    debugPickerFlow("queue-add-action", action);
    setAddOpen(false);

    setTimeout(() => {
      void runPendingAddAction("timeout-fallback");
    }, 520);
  }

  async function runPendingAddAction(source: string) {
    const action = pendingAddAction.current;
    if (!action) return;

    pendingAddAction.current = undefined;
    debugPickerFlow("run-pending-add-action", { action, source });

    try {


      if (action === "camera") {
        await takePhoto();
        return;
      }

      await pickGallery();
    } finally {
      addActionBusy.current = false;
    }
  }

  async function hydrateLocationAndShops(
    currentDraft: DraftEntry,
    { requestPermission }: { requestPermission: boolean },
  ): Promise<boolean> {
    setShopsLoading(true);
    try {
      const permission = requestPermission
        ? await Location.requestForegroundPermissionsAsync()
        : await Location.getForegroundPermissionsAsync();
      if (!permission.granted) {
        if (requestPermission) await playHaptic("warning");
        setShopsLoading(false);
        return false;
      }

      const position = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          mayShowUserSettingsDialog: requestPermission,
        }),
        6500,
      );
      let city = currentDraft.city;
      try {
        const places = await Location.reverseGeocodeAsync(position.coords);
        city = places[0]?.city || places[0]?.region || city;
      } catch {
        city = currentDraft.city;
      }

      setDraft((existing) => ({
        ...existing,
        city: existing.city || city,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      }));

      try {
        const shops = await withTimeout(
          fetchNearbyShops({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city,
          }),
          9500,
        );
        setNearbyShops(shops);
      } catch {
        setNearbyShops([]);
      }
      return true;
    } catch {
      setNearbyShops([]);
      return false;
    } finally {
      setShopsLoading(false);
    }
  }

  async function takePhoto() {
    await waitForNativeTransition(80);

    debugPickerFlow("take-photo-request-permission");
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      await playHaptic("warning");
      Alert.alert(i18n[language].permission, i18n[language].cameraPermission);
      return;
    }

    await playHaptic("medium");
    debugPickerFlow("take-photo-launch-camera");
    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.84,
      });
    } catch (error) {
      debugPickerFlow("take-photo-error", error);
      Alert.alert(i18n[language].permission, i18n[language].cameraPermission);
      return;
    }

    debugPickerFlow("take-photo-result", { canceled: result.canceled });
    if (!result.canceled && result.assets[0]) {
      await openEditorAfterPicker(result.assets[0].uri);
    }
  }

  async function pickGallery() {
    await waitForNativeTransition(80);

    debugPickerFlow("gallery-request-permission");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      await playHaptic("warning");
      Alert.alert(i18n[language].permission, i18n[language].galleryPermission);
      return;
    }

    await playHaptic("medium");
    debugPickerFlow("gallery-launch-library");
    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.84,
      });
    } catch (error) {
      debugPickerFlow("gallery-error", error);
      Alert.alert(i18n[language].permission, i18n[language].galleryPermission);
      return;
    }

    debugPickerFlow("gallery-result", { canceled: result.canceled });
    if (!result.canceled && result.assets[0]) {
      await openEditorAfterPicker(result.assets[0].uri);
    }
  }

  async function attachLocation() {
    await playHaptic("medium");
    const attached = await hydrateLocationAndShops(draft, {
      requestPermission: true,
    });
    if (attached) {
      await playHaptic("success");
    } else {
      Alert.alert(i18n[language].permission, i18n[language].locationPermission);
    }
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
      stickerUri: draft.photoUri,
      location: draft.location,
    };

    persist([next, ...entries]);
    writeStored(storageKeys.lastDrop, next.id);
    setEditorOpen(false);
    router.push("/journal");
  }

  return (
    <ImageBackground
      source={paperTexture}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
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
          <Header
            view={view}
            language={language}
            colors={colors}
            onSettings={() => setSettingsOpen(true)}
            onMap={() => setMapOpen(true)}
            onPassportAction={() => setPassportCompact((value) => !value)}
            passportCompact={passportCompact}
          />
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
                droppingEntryId={droppingEntryId}
                onDropComplete={() => {
                  setDroppingEntryId(undefined);
                  localStorage.removeItem(storageKeys.lastDrop);
                }}
              />
            ) : (
              <PassportView
                entries={entries}
                language={language}
                colors={colors}
                compact={passportCompact}
              />
            )}
          </View>
          <BottomDock
            view={view}
            onNavigate={(nextView) =>
              router.push(nextView === "journal" ? "/journal" : "/passport")
            }
            onAdd={() => setAddOpen(true)}
            colors={colors}
            bottomOffset={insets.bottom + 26}
          />
        </View>

        <AddSheet
          visible={addOpen}
          language={language}
          colors={colors}
          onClose={() => setAddOpen(false)}
          onDismiss={() => {
            void runPendingAddAction("modal-dismiss");
          }}
          onCamera={() => queueAddAction("camera")}
          onGallery={() => queueAddAction("gallery")}

        />
        <EntryEditor
          visible={editorOpen}
          language={language}
          colors={colors}
          draft={draft}
          setDraft={setDraft}
          date={selectedDate}
          nearbyShops={nearbyShops}
          shopsLoading={shopsLoading}
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
        <BrewMapModal
          visible={mapOpen}
          entries={entries}
          colors={colors}
          language={language}
          onClose={() => setMapOpen(false)}
        />
      </View>
    </ImageBackground>
  );
}
