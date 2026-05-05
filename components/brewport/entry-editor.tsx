import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { i18n } from "./constants";
import { playHaptic } from "./haptics";
import type { DraftEntry, Language, Palette } from "./types";
import { bodyFont, titleFont } from "./typography";
import { HapticPressable } from "./ui";

export function EntryEditor({
  visible,
  language,
  colors,
  draft,
  setDraft,
  onClose,
  onSave,
  onLocation,
}: {
  visible: boolean;
  language: Language;
  colors: Palette;
  draft: DraftEntry;
  setDraft: (draft: DraftEntry) => void;
  onClose: () => void;
  onSave: () => void;
  onLocation: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(36,31,28,0.22)",
        }}
      >
        <View
          style={{
            maxHeight: "90%",
            borderTopLeftRadius: 34,
            borderTopRightRadius: 34,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 22,
              paddingBottom: insets.bottom + 26,
              gap: 14,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text
                selectable
                style={{
                  flex: 1,
                  color: colors.text,
                  fontFamily: titleFont(language),
                  fontSize: 26,
                  fontWeight: "900",
                }}
              >
                {i18n[language].newStamp}
              </Text>
              <HapticPressable
                haptic="light"
                onPress={onClose}
                style={{
                  width: 42,
                  height: 42,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="x" size={28} color={colors.muted} />
              </HapticPressable>
            </View>

            {draft.photoUri ? (
              <View style={{ gap: 8 }}>
                <Image
                  source={{ uri: draft.photoUri }}
                  contentFit="cover"
                  style={{
                    height: 148,
                    borderRadius: 24,
                    backgroundColor: colors.recessed,
                  }}
                />
                <Text
                  selectable
                  style={{
                    color: colors.muted,
                    fontFamily: bodyFont(language),
                    fontSize: 12,
                    fontWeight: "800",
                  }}
                >
                  {i18n[language].photoReady}
                </Text>
              </View>
            ) : null}

            <Field
              label={i18n[language].shop}
              value={draft.shop}
              onChangeText={(shop) => setDraft({ ...draft, shop })}
              colors={colors}
              language={language}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field
                  label={i18n[language].city}
                  value={draft.city}
                  onChangeText={(city) => setDraft({ ...draft, city })}
                  colors={colors}
                  language={language}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label={i18n[language].item}
                  value={draft.item}
                  onChangeText={(item) => setDraft({ ...draft, item })}
                  colors={colors}
                  language={language}
                />
              </View>
            </View>
            <Field
              label={i18n[language].note}
              value={draft.note}
              onChangeText={(note) => setDraft({ ...draft, note })}
              colors={colors}
              language={language}
              multiline
            />

            <View style={{ gap: 9 }}>
              <Text
                selectable
                style={{
                  color: colors.muted,
                  fontFamily: bodyFont(language),
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                {i18n[language].rating}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <HapticPressable
                    key={rating}
                    haptic="selection"
                    onPress={() => setDraft({ ...draft, rating })}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        rating <= draft.rating
                          ? colors.accent
                          : colors.recessed,
                    }}
                  >
                    <Text
                      selectable
                      style={{
                        color:
                          rating <= draft.rating ? colors.raised : colors.muted,
                        fontWeight: "900",
                      }}
                    >
                      {rating}
                    </Text>
                  </HapticPressable>
                ))}
              </View>
            </View>

            <HapticPressable
              haptic="light"
              onPress={onLocation}
              style={{
                height: 54,
                borderRadius: 19,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: draft.location
                  ? colors.accentSoft
                  : colors.recessed,
              }}
            >
              <Feather name="map-pin" size={20} color={colors.accentDark} />
              <Text
                selectable
                numberOfLines={1}
                style={{
                  color: colors.text,
                  fontFamily: bodyFont(language),
                  fontWeight: "900",
                }}
              >
                {draft.location
                  ? i18n[language].locationReady
                  : i18n[language].useLocation}
              </Text>
            </HapticPressable>

            <HapticPressable
              haptic="success"
              onPress={onSave}
              style={{
                height: 58,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.accent,
              }}
            >
              <Text
                selectable
                style={{
                  color: colors.raised,
                  fontFamily: titleFont(language),
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {i18n[language].save}
              </Text>
            </HapticPressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  colors,
  language,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: Palette;
  language: Language;
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 7 }}>
      <Text
        selectable
        numberOfLines={1}
        style={{
          color: colors.muted,
          fontFamily: bodyFont(language),
          fontSize: 13,
          fontWeight: "900",
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => void playHaptic("selection")}
        multiline={multiline}
        placeholderTextColor={colors.quiet}
        style={{
          minHeight: multiline ? 86 : 50,
          borderRadius: 18,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: colors.recessed,
          color: colors.text,
          fontFamily: bodyFont(language),
          fontSize: 15,
          fontWeight: "800",
        }}
      />
    </View>
  );
}
