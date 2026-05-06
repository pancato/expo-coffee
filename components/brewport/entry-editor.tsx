import { Image } from "expo-image";
import { ImageBackground, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { i18n } from "../../locales";
import { paperTexture } from "./constants";
import { playHaptic } from "./haptics";
import { AppIcon } from "./icons";
import { bodyFont, titleFont } from "./typography";
import type { DraftEntry, Language, Palette, ShopCandidate } from "./types";
import { HapticPressable, shadow } from "./ui";

export function EntryEditor({
  visible,
  language,
  colors,
  draft,
  setDraft,
  date,
  nearbyShops,
  shopsLoading,
  onClose,
  onSave,
  onLocation,
}: {
  visible: boolean;
  language: Language;
  colors: Palette;
  draft: DraftEntry;
  setDraft: (draft: DraftEntry) => void;
  date: Date;
  nearbyShops: ShopCandidate[];
  shopsLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onLocation: () => void;
}) {
  const insets = useSafeAreaInsets();

  function selectShop(shop: ShopCandidate) {
    setDraft({
      ...draft,
      shop: shop.name,
      city: shop.city || draft.city,
      location: {
        latitude: shop.latitude,
        longitude: shop.longitude,
      },
    });
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose} presentationStyle="fullScreen">
      <View style={{ flex: 1, backgroundColor: "rgba(59,54,50,0.2)" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ImageBackground
            source={paperTexture}
            resizeMode="cover"
            style={{
              flex: 1,
              marginTop: insets.top + 58,
              borderTopLeftRadius: 34,
              borderTopRightRadius: 34,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(255,253,247,0.78)",
                borderTopLeftRadius: 34,
                borderTopRightRadius: 34,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.7)",
              }}
            >
          <ScrollView
            contentContainerStyle={{
              paddingTop: 26,
              paddingHorizontal: 18,
              paddingBottom: insets.bottom + 32,
              gap: 14,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <RoundAction icon="x" colors={colors} onPress={onClose} />
              <Text selectable style={{ color: colors.text, fontFamily: titleFont(language), fontSize: 29, fontWeight: "900" }}>
                {i18n[language].newStamp}
              </Text>
              <RoundAction icon="check" colors={colors} muted={!draft.photoUri && !draft.item && !draft.shop} onPress={onSave} />
            </View>

            <View style={{ height: 248, alignItems: "center", justifyContent: "center" }}>
              {draft.photoUri ? (
                <StickerPreview uri={draft.photoUri} colors={colors} language={language} onRemove={() => setDraft({ ...draft, photoUri: undefined })} />
              ) : (
                <View
                  style={{
                    width: 210,
                    height: 160,
                    borderRadius: 34,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderWidth: 1,
                    borderColor: colors.hairline,
                  }}
                >
                  <AppIcon name="image" size={42} color={colors.quiet} />
                </View>
              )}
            </View>

            <InfoRow icon="calendar" label={new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date)} colors={colors} language={language} rightIcon="caret-down" />

            <FieldRow icon="store" label={i18n[language].shop} value={draft.shop} onChangeText={(shop) => setDraft({ ...draft, shop })} colors={colors} language={language} />
            <NearbyShopPicker
              language={language}
              colors={colors}
              shops={nearbyShops}
              loading={shopsLoading}
              selectedName={draft.shop}
              onSelect={selectShop}
            />
            <FieldRow icon="pin" label={i18n[language].city} value={draft.city} onChangeText={(city) => setDraft({ ...draft, city })} colors={colors} language={language} />
            <FieldRow icon="coffee" label={i18n[language].item} value={draft.item} onChangeText={(item) => setDraft({ ...draft, item })} colors={colors} language={language} rightIcon="star" />
            <HapticPressable
              haptic="light"
              onPress={onLocation}
              style={{
                minHeight: 54,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: draft.location ? colors.accentSoft : "rgba(255,255,255,0.66)",
                borderWidth: 1,
                borderColor: colors.hairline,
              }}
            >
              <AppIcon name="map" size={21} color={colors.accentDark} />
              <Text selectable style={{ color: colors.text, fontFamily: bodyFont(language), fontWeight: "900" }}>
                {draft.location ? i18n[language].locationReady : i18n[language].useLocation}
              </Text>
            </HapticPressable>
            <FieldRow
              icon="note"
              label={i18n[language].note}
              value={draft.note}
              onChangeText={(note) => setDraft({ ...draft, note })}
              colors={colors}
              language={language}
              multiline
            />
          </ScrollView>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function RoundAction({
  icon,
  colors,
  muted,
  onPress,
}: {
  icon: "x" | "check";
  colors: Palette;
  muted?: boolean;
  onPress: () => void;
}) {
  return (
    <HapticPressable
      haptic={icon === "check" ? "success" : "light"}
      onPress={onPress}
      style={{
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.6)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.88)",
      }}
    >
      <AppIcon name={icon} size={31} color={muted ? colors.quiet : colors.muted} weight="bold" />
    </HapticPressable>
  );
}

function StickerPreview({
  uri,
  colors,
  language,
  onRemove,
}: {
  uri: string;
  colors: Palette;
  language: Language;
  onRemove: () => void;
}) {
  return (
    <View
      style={{
        width: 306,
        height: 228,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 286,
          height: 198,
          transform: [{ rotate: "8deg" }],
          boxShadow: shadow(colors, 18, 34),
        }}
      >
        <Svg width="286" height="198" viewBox="0 0 286 198">
          <Path
            d="M22 28 C42 10 67 18 93 13 C124 7 151 19 181 16 C218 12 248 22 263 47 C281 76 265 104 269 130 C273 156 254 178 224 180 C194 182 166 173 133 181 C100 189 75 177 48 174 C22 171 8 149 13 123 C18 97 2 56 22 28 Z"
            fill="#FFFFFF"
          />
        </Svg>
      </View>
      <View
        style={{
          width: 248,
          height: 154,
          borderRadius: 42,
          padding: 8,
          backgroundColor: "#FFFFFF",
          transform: [{ rotate: "8deg" }],
        }}
      >
        <Image source={{ uri }} contentFit="cover" style={{ flex: 1, borderRadius: 34, backgroundColor: colors.recessed }} />
      </View>
      <HapticPressable
        haptic="light"
        accessibilityLabel={i18n[language].removePhoto}
        onPress={onRemove}
        style={{
          position: "absolute",
          right: 28,
          top: 16,
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(80,72,68,0.78)",
        }}
      >
        <AppIcon name="x" size={20} color="#FFFFFF" weight="bold" />
      </HapticPressable>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  colors,
  language,
  rightIcon,
}: {
  icon: "calendar";
  label: string;
  colors: Palette;
  language: Language;
  rightIcon?: "caret-down";
}) {
  return (
    <View
      style={{
        minHeight: 70,
        borderRadius: 24,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "rgba(255,255,255,0.74)",
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <AppIcon name={icon} size={25} color={colors.accent} weight="bold" />
      <Text selectable numberOfLines={1} style={{ flex: 1, color: colors.text, fontFamily: titleFont(language), fontSize: 18, fontWeight: "900" }}>
        {label}
      </Text>
      {rightIcon ? <AppIcon name={rightIcon} size={24} color={colors.quiet} /> : null}
    </View>
  );
}

function FieldRow({
  icon,
  label,
  value,
  onChangeText,
  colors,
  language,
  rightIcon,
  multiline = false,
}: {
  icon: "store" | "pin" | "coffee" | "note";
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: Palette;
  language: Language;
  rightIcon?: "star";
  multiline?: boolean;
}) {
  return (
    <View
      style={{
        minHeight: multiline ? 84 : 70,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: multiline ? 12 : 0,
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
        gap: 14,
        backgroundColor: "rgba(255,255,255,0.74)",
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <View style={{ paddingTop: multiline ? 10 : 0 }}>
        <AppIcon name={icon} size={25} color={colors.muted} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => void playHaptic("selection")}
        multiline={multiline}
        placeholder={label + "..."}
        placeholderTextColor={colors.quiet}
        style={{
          flex: 1,
          minHeight: multiline ? 58 : 48,
          color: colors.text,
          fontFamily: titleFont(language),
          fontSize: 18,
          fontWeight: "900",
        }}
      />
      {rightIcon ? (
        <View style={{ paddingTop: multiline ? 10 : 0 }}>
          <AppIcon name={rightIcon} size={25} color={colors.quiet} />
        </View>
      ) : null}
    </View>
  );
}

function NearbyShopPicker({
  language,
  colors,
  shops,
  loading,
  selectedName,
  onSelect,
}: {
  language: Language;
  colors: Palette;
  shops: ShopCandidate[];
  loading: boolean;
  selectedName: string;
  onSelect: (shop: ShopCandidate) => void;
}) {
  return (
    <View
      style={{
        borderRadius: 24,
        padding: 14,
        gap: 10,
        backgroundColor: "rgba(255,255,255,0.5)",
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <Text selectable style={{ color: colors.muted, fontFamily: bodyFont(language), fontSize: 12, fontWeight: "900" }}>
        {loading ? i18n[language].findingShops : i18n[language].nearbyShops}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
        {shops.length === 0 && !loading ? (
          <Text selectable style={{ color: colors.quiet, fontFamily: bodyFont(language), fontWeight: "800" }}>
            {i18n[language].noNearbyShops}
          </Text>
        ) : null}
        {shops.map((shop) => {
          const active = selectedName === shop.name;
          return (
            <HapticPressable
              key={shop.id}
              haptic="selection"
              onPress={() => onSelect(shop)}
              style={{
                minHeight: 36,
                borderRadius: 18,
                paddingHorizontal: 13,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? colors.accent : colors.recessed,
              }}
            >
              <Text selectable numberOfLines={1} style={{ color: active ? colors.raised : colors.text, fontFamily: bodyFont(language), fontSize: 13, fontWeight: "900" }}>
                {shop.name}
                {shop.distanceMeters ? ` · ${shop.distanceMeters}m` : ""}
              </Text>
            </HapticPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
