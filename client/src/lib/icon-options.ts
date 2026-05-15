import {
  Sparkles,
  Eye,
  Activity,
  Sun,
  Moon,
  Star,
  Heart,
  Smile,
  Coffee,
  Utensils,
  Brush,
  Bath,
  Bed,
  Book,
  Music,
  Apple,
  Footprints,
  Bike,
  type LucideIcon,
} from "lucide-react";

/**
 * 管理画面のアイコン候補。lucide-react のコンポーネントを直接保持する。
 * 追加したいアイコンはここに足すだけ。アイコン名 (key) はそのまま DB に保存される。
 */
export type IconOption = {
  key: string;
  Icon: LucideIcon;
  labelKey?: string; // 将来翻訳キーを足したい場合
};

export const ICON_OPTIONS: IconOption[] = [
  { key: "Sparkles", Icon: Sparkles },
  { key: "Eye", Icon: Eye },
  { key: "Activity", Icon: Activity },
  { key: "Sun", Icon: Sun },
  { key: "Moon", Icon: Moon },
  { key: "Star", Icon: Star },
  { key: "Heart", Icon: Heart },
  { key: "Smile", Icon: Smile },
  { key: "Coffee", Icon: Coffee },
  { key: "Utensils", Icon: Utensils },
  { key: "Brush", Icon: Brush },
  { key: "Bath", Icon: Bath },
  { key: "Bed", Icon: Bed },
  { key: "Book", Icon: Book },
  { key: "Music", Icon: Music },
  { key: "Apple", Icon: Apple },
  { key: "Footprints", Icon: Footprints },
  { key: "Bike", Icon: Bike },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.key, o.Icon])
);

/** key からアイコンコンポーネントを取得 (未知の key は Sparkles にフォールバック) */
export function getIconByKey(key: string | null | undefined): LucideIcon {
  if (key && key in ICON_MAP) return ICON_MAP[key];
  return Sparkles;
}
