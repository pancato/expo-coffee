import type { ComponentProps, ComponentType } from "react";
import {
  CalendarBlank,
  Camera,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Coffee,
  GearSix,
  GridFour,
  ImageSquare,
  MapTrifold,
  List,
  NotePencil,
  PencilSimpleLine,
  Plus,
  PushPinSimple,
  SealCheck,
  Stamp,
  Star,
  Storefront,
  Tag,
  UserCircle,
  X,
} from "phosphor-react-native";

export type IconName =
  | "calendar"
  | "camera"
  | "caret-down"
  | "chevron-left"
  | "chevron-right"
  | "check"
  | "coffee"
  | "edit"
  | "gear"
  | "grid"
  | "image"
  | "map"
  | "menu"
  | "note"
  | "pin"
  | "plus"
  | "seal"
  | "stamp"
  | "star"
  | "store"
  | "tag"
  | "user"
  | "x";

const iconMap = {
  calendar: CalendarBlank,
  camera: Camera,
  "caret-down": CaretDown,
  "chevron-left": CaretLeft,
  "chevron-right": CaretRight,
  check: Check,
  coffee: Coffee,
  edit: PencilSimpleLine,
  gear: GearSix,
  grid: GridFour,
  image: ImageSquare,
  map: MapTrifold,
  menu: List,
  note: NotePencil,
  pin: PushPinSimple,
  plus: Plus,
  seal: SealCheck,
  stamp: Stamp,
  star: Star,
  store: Storefront,
  tag: Tag,
  user: UserCircle,
  x: X,
} satisfies Record<IconName, ComponentType<ComponentProps<typeof GearSix>>>;

export function AppIcon({
  name,
  size = 24,
  color,
  weight = "regular",
}: {
  name: IconName;
  size?: number;
  color: string;
  weight?: ComponentProps<typeof GearSix>["weight"];
}) {
  const Icon = iconMap[name];
  return <Icon size={size} color={color} weight={weight} />;
}
